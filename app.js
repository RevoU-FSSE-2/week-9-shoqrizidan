const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zd2108',
  database: 'szmbanking'
});

app.use(bodyParser.json());

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

app.get('/', (req, res) => {
  res.send('Shoqri Zidan MBanking App API Week 9');
});

// Get user information with balance and total expenses
// GET /user/:id
app.get('/user/:id', (req, res) => {
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

// Create new transaction
app.post('/transactions', (req, res) => {
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

// Update transaction
app.put('/transactions/:id', (req, res) => {
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

// Delete transaction
app.delete('/transactions/:id', (req, res) => {
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

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
