const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const { upload, uploadToCloudinary, deleteImage } = require('../middleware/upload');

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image must be under 5MB.' });
      }
      return res.status(400).json({ error: err.message || 'Image upload failed.' });
    }
    next();
  });
};

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let conditions = ['user_id = $1'];
    let params = [req.user.id];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    const whereClause = conditions.join(' AND ');
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM items WHERE ${whereClause}`,
      params
    );

    params.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM items WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
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

router.post('/', handleUpload,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('title').isLength({ max: 255 }).withMessage('Title too long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, description, category } = req.body;
    let image_url = null;

    try {
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        image_url = result.secure_url;
      }

      const result = await pool.query(
        'INSERT INTO items (user_id, title, description, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.user.id, title, description || '', category || 'General', image_url]
      );

      res.status(201).json({ data: result.rows[0], message: 'Item created.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create item.' });
    }
  }
);

router.put('/:id', handleUpload,
  [body('title').notEmpty().withMessage('Title is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, description, category } = req.body;

    try {
      const check = await pool.query(
        'SELECT * FROM items WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found.' });
      }

      let image_url = check.rows[0].image_url;

      if (req.file) {
        if (image_url) await deleteImage(image_url);
        const uploaded = await uploadToCloudinary(req.file.buffer);
        image_url = uploaded.secure_url;
      }

      const result = await pool.query(
        'UPDATE items SET title = $1, description = $2, category = $3, image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
        [title, description || '', category || 'General', image_url, req.params.id]
      );

      res.json({ data: result.rows[0], message: 'Item updated.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update item.' });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const check = await pool.query(
      'SELECT * FROM items WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    if (check.rows[0].image_url) {
      await deleteImage(check.rows[0].image_url);
    }
    await pool.query('DELETE FROM items WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

module.exports = router;
