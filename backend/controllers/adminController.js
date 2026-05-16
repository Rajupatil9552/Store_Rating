const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper for admin validation (synchronized with authController)
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(password);
const validateName = (name) => name && name.length >= 10 && name.length <= 60;

// Add new user / admin (ADMIN only)
const createUser = async (req, res) => {
    const { name, email, password, role, address } = req.body;
    
    // Validations
    if (!validateName(name)) return res.status(400).json({ message: 'Name must be 20-60 characters' });
    if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (!validatePassword(password)) return res.status(400).json({ message: 'Password must be 8-16 chars, 1 upper, 1 special' });
    if (address && address.length > 400) return res.status(400).json({ message: 'Address max 400 characters' });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.execute(
            'INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'USER', address]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Add new store (ADMIN only)
const createStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;
    try {
        await pool.execute(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );
        res.status(201).json({ message: 'Store created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating store', error: error.message });
    }
};

// Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const [[{ totalUsers }]] = await pool.execute('SELECT COUNT(*) as totalUsers FROM users');
        const [[{ totalStores }]] = await pool.execute('SELECT COUNT(*) as totalStores FROM stores');
        const [[{ totalRatings }]] = await pool.execute('SELECT COUNT(*) as totalRatings FROM ratings');

        res.json({ totalUsers, totalStores, totalRatings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// List all stores with filters
const listStores = async (req, res) => {
    const { name, email, address } = req.query;
    let query = 'SELECT name, email, address, average_rating FROM stores WHERE 1=1';
    let params = [];

    if (name) { query += ' AND name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND address LIKE ?'; params.push(`%${address}%`); }

    try {
        const [stores] = await pool.execute(query, params);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stores', error: error.message });
    }
};

// List all users with filters
const listUsers = async (req, res) => {
    const { name, email, address, role } = req.query;
    
    // Join with stores to get average rating for Store Owners
    let query = `
        SELECT 
            u.id, u.name, u.email, u.address, u.role,
            COALESCE((SELECT AVG(average_rating) FROM stores WHERE owner_id = u.id), 0) as average_rating
        FROM users u 
        WHERE 1=1
    `;
    let params = [];

    if (name) { query += ' AND u.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND u.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND u.address LIKE ?'; params.push(`%${address}%`); }
    if (role) { query += ' AND u.role = ?'; params.push(role); }

    try {
        const [users] = await pool.execute(query, params);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

module.exports = { createUser, createStore, getDashboardStats, listStores, listUsers };
