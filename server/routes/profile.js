const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

router.put('/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { name, email } = req.body;
    try {
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
        [name, email, req.user.id]
      );
      res.json({ data: result.rows[0], message: 'Profile updated.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update profile.' });
    }
  }
);

router.put('/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { currentPassword, newPassword } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(newPassword, salt);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, req.user.id]);
      res.json({ message: 'Password updated successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update password.' });
    }
  }
);

router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM items WHERE user_id = $1', [req.user.id]);
    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

module.exports = router;
