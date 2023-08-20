const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { user_id, type, amount } = req.body;
  const sql = 'INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)';
  db.query(sql, [user_id, type, amount], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while adding the transaction' });
    } else {
      res.json({
        message: 'Transaction added successfully',
        id: result.insertId,
      });
    }
  });
});

router.put('/:id', (req, res) => {
  const transactionId = req.params.id;
  const { type, amount } = req.body;
  const sql = 'UPDATE transactions SET type = ?, amount = ? WHERE id = ?';
  db.query(sql, [type, amount, transactionId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the transaction' });
    } else {
      res.json({ message: 'Transaction updated successfully' });
    }
  });
});

router.delete('/:id', (req, res) => {
  const transactionId = req.params.id;
  const sql = 'DELETE FROM transactions WHERE id = ?';
  db.query(sql, [transactionId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the transaction' });
    } else {
      res.json({ message: 'Transaction deleted successfully' });
    }
  });
});

module.exports = router;
