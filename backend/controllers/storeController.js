const pool = require('../config/db');

// List all stores with average rating & user rating (if logged in)
const getStores = async (req, res) => {
    const userId = req.user ? req.user.id : null;
    
    let query = `
        SELECT 
            s.id, s.name, s.address, 
            AVG(r.rating) as overall_rating,
            (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        GROUP BY s.id
    `;

    try {
        const [stores] = await pool.execute(query, [userId]);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stores', error: error.message });
    }
};

// Search stores by name or address
const searchStores = async (req, res) => {
    const { search, name, address } = req.query;
    const userId = req.user ? req.user.id : null;

    let query = `
        SELECT 
            s.id, s.name, s.address, 
            COALESCE(s.average_rating, 0) as overall_rating,
            (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating
        FROM stores s
        WHERE 1=1
    `;
    let params = [userId];

    if (search) {
        query += ' AND (s.name LIKE ? OR s.address LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY s.id';

    try {
        const [stores] = await pool.execute(query, params);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Search error', error: error.message });
    }
};

// Create a new store (OWNER / ADMIN)
const createStore = async (req, res) => {
    const { name, email, address } = req.body;
    const owner_id = req.user.id;

    try {
        const [result] = await pool.execute(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );

        res.status(201).json({ message: 'Store created successfully', storeId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Store creation error', error: error.message });
    }
};

// Update store
const updateStore = async (req, res) => {
    const { name, email, address } = req.body;
    const store_id = req.params.id;

    try {
        const [stores] = await pool.execute('SELECT * FROM stores WHERE id = ?', [store_id]);
        if (stores.length === 0) return res.status(404).json({ message: 'Store not found' });

        if (stores[0].owner_id !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to update this store' });
        }

        await pool.execute(
            'UPDATE stores SET name = ?, email = ?, address = ? WHERE id = ?',
            [name, email, address, store_id]
        );

        res.json({ message: 'Store updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Update error', error: error.message });
    }
};

// Delete store
const deleteStore = async (req, res) => {
    try {
        const [stores] = await pool.execute('SELECT * FROM stores WHERE id = ?', [req.params.id]);
        if (stores.length === 0) return res.status(404).json({ message: 'Store not found' });

        if (stores[0].owner_id !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this store' });
        }

        await pool.execute('DELETE FROM stores WHERE id = ?', [req.params.id]);
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete error', error: error.message });
    }
};

module.exports = { getStores, searchStores, createStore, updateStore, deleteStore };
