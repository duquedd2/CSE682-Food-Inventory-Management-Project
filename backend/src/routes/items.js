const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

// All item routes require authentication
router.use(authenticate);

// GET /api/items — fetch all items for the authenticated user
// Computes expiration_status: green (>3 days), yellow (1-3 days), red (expired)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *,
        CASE
          WHEN expiration_date IS NULL THEN 'green'
          WHEN expiration_date < CURRENT_DATE THEN 'red'
          WHEN expiration_date <= CURRENT_DATE + INTERVAL '3 days' THEN 'yellow'
          ELSE 'green'
        END AS expiration_status
      FROM food_items
      WHERE user_id = $1
      ORDER BY expiration_date ASC NULLS LAST, created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/items — add a new food item
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, unit, price, expiration_date, purchase_date, location } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    // NFR-XX: prevent negative inventory
    const qty = parseFloat(quantity) || 1;
    if (qty < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }

    const result = await pool.query(
      `INSERT INTO food_items (user_id, name, category, quantity, unit, price, expiration_date, purchase_date, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        req.user.userId,
        name,
        category || null,
        qty,
        unit || null,
        price || null,
        expiration_date || null,
        purchase_date || new Date().toISOString().split('T')[0],
        location || 'pantry'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// PUT /api/items/:id — update an existing food item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unit, price, expiration_date, location } = req.body;

    // NFR-XX: prevent negative inventory
    if (quantity !== undefined && parseFloat(quantity) < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }

    const result = await pool.query(
      `UPDATE food_items
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           quantity = COALESCE($3, quantity),
           unit = COALESCE($4, unit),
           price = COALESCE($5, price),
           expiration_date = COALESCE($6, expiration_date),
           location = COALESCE($7, location),
           updated_at = CURRENT_TIMESTAMP
       WHERE item_id = $8 AND user_id = $9
       RETURNING *`,
      [name, category, quantity, unit, price, expiration_date, location, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/items/:id — remove a food item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM food_items WHERE item_id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
