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
  res.send('MBanking App API');
});

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

// POST /transaction
app.post('/transactions', (req, res) => {
    const { type, amount, user_id } = req.body;
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ message: 'Invalid transaction type' });
      return;
    }
    db.query('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)', [user_id, type, amount], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      res.json({ id: results.insertId });
    });
  });
  
  // PUT /transaction/:id
  app.put('/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
    const { type, amount, user_id } = req.body;
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ message: 'Invalid transaction type' });
      return;
    }
    db.query('UPDATE transactions SET type = ?, amount = ? WHERE id = ?', [type, amount, transactionId], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Transaction not found' });
        return;
      }
      res.json({ id: transactionId });
    });
  });
  
  // DELETE /transactions/:id
  app.delete('/transaction/:id', (req, res) => {
    const transactionId = req.params.id;
    db.query('DELETE FROM transactions WHERE id = ?', [transactionId], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Transaction not found' });
        return;
      }
      res.json({ id: transactionId });
    });
  });
  

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
