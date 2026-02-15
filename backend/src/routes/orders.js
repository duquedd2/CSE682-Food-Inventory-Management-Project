const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// GET /api/orders/meals — pre-determined meals with ingredients (FR-18)
router.get('/meals', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT recipe_id, title, description, prep_time_minutes, cook_time_minutes, servings, ingredients FROM recipes ORDER BY title ASC'
    );

    const meals = result.rows.map(r => ({
      ...r,
      total_time_minutes: r.prep_time_minutes + r.cook_time_minutes,
      // FR-19: estimated time to start cooking and eating
      estimated_ready_by: new Date(
        Date.now() + (r.prep_time_minutes + r.cook_time_minutes + 30) * 60000
      ).toISOString(),
      order_available: false, // Templated: ordering not yet integrated
    }));

    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// GET /api/orders/restaurants — list restaurants, favorites first (FR-XX)
router.get('/restaurants', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*,
        COALESCE(ufr.is_favorite, false) AS is_favorite
      FROM restaurants r
      LEFT JOIN user_favorite_restaurants ufr
        ON r.restaurant_id = ufr.restaurant_id AND ufr.user_id = $1
      ORDER BY COALESCE(ufr.is_favorite, false) DESC, r.name ASC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// POST /api/orders/restaurants/:id/favorite — toggle restaurant favorite
router.post('/restaurants/:id/favorite', async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const existing = await pool.query(
      'SELECT * FROM user_favorite_restaurants WHERE user_id = $1 AND restaurant_id = $2',
      [req.user.userId, restaurantId]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        'UPDATE user_favorite_restaurants SET is_favorite = NOT is_favorite WHERE user_id = $1 AND restaurant_id = $2 RETURNING *',
        [req.user.userId, restaurantId]
      );
    } else {
      result = await pool.query(
        'INSERT INTO user_favorite_restaurants (user_id, restaurant_id, is_favorite) VALUES ($1, $2, true) RETURNING *',
        [req.user.userId, restaurantId]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling restaurant favorite:', error);
    res.status(500).json({ error: 'Failed to update favorite' });
  }
});

// POST /api/orders/place — templated: place an order (FR-18)
router.post('/place', async (req, res) => {
  res.json({
    message: 'Order placement is coming soon. This feature requires integration with grocery delivery services.',
    status: 'not_available'
  });
});

module.exports = router;
