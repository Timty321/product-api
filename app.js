const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 1616;
const cors = require('cors');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

// Connect to MySQL
db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      throw err;
    }
    console.log('Connected to the database');
    connection.release();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/products', (req, res) => {
  const { name, stock } = req.body;
  const updateTime = new Date();

  const query = 'INSERT INTO products (name, stock, update_time) VALUES (?, ?, ?)';
  const values = [name, stock, updateTime];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product added successfully', id: result.insertId });
  });
});

app.post('/addproduct', (req, res) => {
    const { name, stock } = req.body;
    const updateTime = new Date();
  
    const query = 'INSERT INTO products (name, stock, update_time) VALUES (?, ?, ?)';
    const values = [name, stock, updateTime];
  
    db.query(query, values, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'Product added successfully', id: result.insertId });
    });
  });

  app.delete('/removeproduct/:productName', (req, res) => {
    const productName = req.params.productName;
  
    db.query('DELETE FROM products WHERE name = ?', [productName], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (result.affectedRows === 1) {
          res.json({ message: 'Product removed successfully' });
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      }
    });
  });  
  
  app.delete('/removeproductid/:productId', (req, res) => {
    const productId = req.params.productId;
  
    db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (result.affectedRows === 1) {
          res.json({ message: 'Product removed successfully' });
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      }
    });
  });

app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
