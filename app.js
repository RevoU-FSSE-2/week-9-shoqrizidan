const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Shoqri Zidan MBanking App API Week 9');
});

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/user', userRoutes);
app.use('/transactions', transactionRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
