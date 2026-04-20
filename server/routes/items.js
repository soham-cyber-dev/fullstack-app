const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const result = await pool.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM items WHERE user_id = $1',
      [req.user.id]
    );
    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM items WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item.' });
  }
});

router.post('/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('title').isLength({ max: 255 }).withMessage('Title too long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { title, description } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO items (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, title, description || '']
      );
      res.status(201).json({ data: result.rows[0], message: 'Item created.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create item.' });
    }
  }
);

router.put('/:id',
  [body('title').notEmpty().withMessage('Title is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { title, description } = req.body;
    try {
      const check = await pool.query(
        'SELECT id FROM items WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found.' });
      }
      const result = await pool.query(
        'UPDATE items SET title = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [title, description || '', req.params.id]
      );
      res.json({ data: result.rows[0], message: 'Item updated.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update item.' });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const check = await pool.query(
      'SELECT id FROM items WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    await pool.query('DELETE FROM items WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

module.exports = router;
