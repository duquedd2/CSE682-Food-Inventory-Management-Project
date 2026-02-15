const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// GET /api/stores — list all stores, favorites first (FR-16)
// FR-15: optional filter by last_visited date range
router.get('/', async (req, res) => {
  try {
    const { visited_after, visited_before } = req.query;

    let query = `
      SELECT gs.*,
        COALESCE(ufs.is_favorite, false) AS is_favorite,
        ufs.last_visited
      FROM grocery_stores gs
      LEFT JOIN user_favorite_stores ufs
        ON gs.store_id = ufs.store_id AND ufs.user_id = $1
    `;
    const params = [req.user.userId];

    const conditions = [];
    if (visited_after) {
      params.push(visited_after);
      conditions.push(`ufs.last_visited >= $${params.length}`);
    }
    if (visited_before) {
      params.push(visited_before);
      conditions.push(`ufs.last_visited <= $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // FR-16: favorites shown first
    query += ' ORDER BY COALESCE(ufs.is_favorite, false) DESC, gs.name ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// POST /api/stores/:id/favorite — toggle favorite (FR-14)
router.post('/:id/favorite', async (req, res) => {
  try {
    const storeId = req.params.id;

    const existing = await pool.query(
      'SELECT * FROM user_favorite_stores WHERE user_id = $1 AND store_id = $2',
      [req.user.userId, storeId]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        'UPDATE user_favorite_stores SET is_favorite = NOT is_favorite WHERE user_id = $1 AND store_id = $2 RETURNING *',
        [req.user.userId, storeId]
      );
    } else {
      result = await pool.query(
        'INSERT INTO user_favorite_stores (user_id, store_id, is_favorite, last_visited) VALUES ($1, $2, true, CURRENT_DATE) RETURNING *',
        [req.user.userId, storeId]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to update favorite' });
  }
});

// POST /api/stores/:id/visit — record a store visit (FR-15)
router.post('/:id/visit', async (req, res) => {
  try {
    const storeId = req.params.id;

    await pool.query(
      `INSERT INTO user_favorite_stores (user_id, store_id, last_visited)
       VALUES ($1, $2, CURRENT_DATE)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET last_visited = CURRENT_DATE`,
      [req.user.userId, storeId]
    );

    res.json({ message: 'Visit recorded' });
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

module.exports = router;
