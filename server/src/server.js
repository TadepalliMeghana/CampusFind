
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://campus-find-snowy.vercel.app'
    ]
}));
app.use(express.json());

// Test backend
app.get('/api/health', (req, res) => {
    res.json({
        message: 'CampusFind backend is running!'
    });
});

// GET all listings
app.get('/api/items', async (req, res) => {
    try {
        const [items] = await db.query(
            'SELECT * FROM items ORDER BY id DESC'
        );

        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);

        res.status(500).json({
            message: 'Failed to fetch listings.'
        });
    }
});

// GET one listing
app.get('/api/items/:id', async (req, res) => {
    try {
        const [items] = await db.execute(
            'SELECT * FROM items WHERE id = ?',
            [req.params.id]
        );

        if (items.length === 0) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }

        res.json(items[0]);
    } catch (error) {
        console.error('Error fetching item:', error);

        res.status(500).json({
            message: 'Failed to fetch item.'
        });
    }
});

// ADD a new lost or found item
app.post('/api/items', async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            type,
            location,
            item_date
        } = req.body;

        // Validate required fields
        if (!title || !category || !type || !location || !item_date) {
            return res.status(400).json({
                message: 'Please fill in all required fields.'
            });
        }

        if (!['lost', 'found'].includes(type)) {
            return res.status(400).json({
                message: 'Type must be lost or found.'
            });
        }

        // Save item in MySQL
        const sql = `
            INSERT INTO items
                (title, description, category, type, location, item_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            title.trim(),
            description || '',
            category,
            type,
            location.trim(),
            item_date
        ]);

        // Return the newly created item
        const [newItems] = await db.execute(
            'SELECT * FROM items WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Item added successfully!',
            item: newItems[0]
        });
    } catch (error) {
        console.error('Error adding item:', error);

        res.status(500).json({
            message: 'Could not save the item to MySQL.',
            error: error.message
        });
    }
});

// DELETE a listing by ID
app.delete('/api/items/:id', async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM items WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }

        res.json({
            message: 'Item deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting item:', error);

        res.status(500).json({
            message: 'Failed to delete item.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`CampusFind backend running at http://localhost:${PORT}`);
});
