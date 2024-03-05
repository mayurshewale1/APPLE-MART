const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection configuration
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  database: 'ecommerce_db',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Define your API endpoints here
// For example:
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = `SELECT * FROM products WHERE id = ?`;

    connection.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error fetching product:', err);
            res.status(500).json({ error: 'Error fetching product' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Product not found here' });
            return;
        }
        res.status(200).json(result[0]);
    });
});
app.post('/cart', (req, res) => {
    const { productId, quantity } = req.body;

    // Here, you can perform the logic to add the product to the cart in your database
    // For example, you might have a table 'cart' in your database to store cart items
    const sql = `INSERT INTO cart (product_id, quantity) VALUES (?, ?)`;
    
    connection.query(sql, [productId, quantity], (err, result) => {
        if (err) {
            console.error('Error adding item to cart:', err);
            res.status(500).json({ error: 'Error adding item to cart' });
            return;
        }
        res.status(200).json({ message: 'Item added to cart' });
    });
});
// Define more endpoints for CRUD operations

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
