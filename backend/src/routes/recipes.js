const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// GET /api/recipes — list all recipes with optional filters
// FR-11: filter by prep time (quick=<15, medium=15-30, long=>30)
// FR-13: filter by servings
router.get('/', async (req, res) => {
  try {
    const { prep_time, servings } = req.query;
    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];

    if (prep_time === 'quick') {
      query += ' AND prep_time_minutes < 15';
    } else if (prep_time === 'medium') {
      query += ' AND prep_time_minutes >= 15 AND prep_time_minutes <= 30';
    } else if (prep_time === 'long') {
      query += ' AND prep_time_minutes > 30';
    }

    if (servings) {
      params.push(parseInt(servings));
      query += ` AND servings <= $${params.length}`;
    }

    query += ' ORDER BY title ASC';
    const result = await pool.query(query, params);

    // Attach user feedback to each recipe
    const feedbackResult = await pool.query(
      'SELECT recipe_id, is_liked FROM recipe_feedback WHERE user_id = $1',
      [req.user.userId]
    );
    const feedbackMap = {};
    feedbackResult.rows.forEach(f => { feedbackMap[f.recipe_id] = f.is_liked; });

    const recipes = result.rows.map(r => ({
      ...r,
      user_feedback: feedbackMap[r.recipe_id] !== undefined ? feedbackMap[r.recipe_id] : null
    }));

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/suggestions — recipes matching user's current inventory
router.get('/suggestions', async (req, res) => {
  try {
    const userItems = await pool.query(
      'SELECT LOWER(name) as name FROM food_items WHERE user_id = $1',
      [req.user.userId]
    );
    const userItemNames = userItems.rows.map(i => i.name);

    const recipesResult = await pool.query('SELECT * FROM recipes ORDER BY title ASC');

    const recipes = recipesResult.rows.map(recipe => {
      const ingredients = recipe.ingredients || [];
      const matching = ingredients.filter(ing =>
        userItemNames.some(name =>
          name.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(name)
        )
      );
      return {
        ...recipe,
        matching_count: matching.length,
        total_ingredients: ingredients.length,
        matching_ingredients: matching.map(m => m.name),
        missing_ingredients: ingredients
          .filter(ing => !matching.includes(ing))
          .map(m => m.name)
      };
    });

    recipes.sort((a, b) => b.matching_count - a.matching_count);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch recipe suggestions' });
  }
});

// GET /api/recipes/:id — single recipe detail
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recipes WHERE recipe_id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = result.rows[0];

    // User's feedback
    const feedback = await pool.query(
      'SELECT is_liked FROM recipe_feedback WHERE user_id = $1 AND recipe_id = $2',
      [req.user.userId, req.params.id]
    );
    recipe.user_feedback = feedback.rows.length > 0 ? feedback.rows[0].is_liked : null;

    // Aggregate likes/dislikes
    const stats = await pool.query(
      'SELECT COUNT(*) FILTER (WHERE is_liked = true) as likes, COUNT(*) FILTER (WHERE is_liked = false) as dislikes FROM recipe_feedback WHERE recipe_id = $1',
      [req.params.id]
    );
    recipe.likes = parseInt(stats.rows[0].likes);
    recipe.dislikes = parseInt(stats.rows[0].dislikes);

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes/:id/feedback — thumbs up/down (FR-12)
router.post('/:id/feedback', async (req, res) => {
  try {
    const { is_liked } = req.body;

    if (typeof is_liked !== 'boolean') {
      return res.status(400).json({ error: 'is_liked must be true or false' });
    }

    await pool.query(
      `INSERT INTO recipe_feedback (user_id, recipe_id, is_liked)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, recipe_id)
       DO UPDATE SET is_liked = $3, created_at = CURRENT_TIMESTAMP`,
      [req.user.userId, req.params.id, is_liked]
    );

    res.json({ message: 'Feedback saved', is_liked });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// DELETE /api/recipes/:id/feedback — remove feedback
router.delete('/:id/feedback', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM recipe_feedback WHERE user_id = $1 AND recipe_id = $2',
      [req.user.userId, req.params.id]
    );
    res.json({ message: 'Feedback removed' });
  } catch (error) {
    console.error('Error removing feedback:', error);
    res.status(500).json({ error: 'Failed to remove feedback' });
  }
});

module.exports = router;
