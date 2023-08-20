const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:id', (req, res) => {
  const userId = req.params.id;

  db.query('SELECT * FROM user WHERE id = ?', [userId], (error, userResults) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResults[0];

    db.query('SELECT SUM(amount) AS total_income, SUM(CASE WHEN type="expense" THEN amount ELSE 0 END) AS total_expenses FROM transactions WHERE user_id = ?', [userId], (error, transactionResults) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      const totalIncome = transactionResults[0].total_income || 0;
      const totalExpenses = transactionResults[0].total_expenses || 0;
      const balance = totalIncome - totalExpenses;

      const response = {
        id: user.id,
        name: user.name,
        address: user.address,
        balance: balance,
        total_expenses: totalExpenses
      };

      res.json(response);
    });
  });
});

module.exports = router;
