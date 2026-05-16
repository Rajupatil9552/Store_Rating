const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Validation helpers
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const validatePassword = (password) => {
    // 8-16 characters, at least one uppercase letter, one special character
    const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    return re.test(password);
};

const validateName = (name) => {
    return name && name.length >= 10 && name.length <= 60;
};

// Register user
const register = async (req, res) => {
    const { name, email, password, role, address } = req.body;

    try {
        if (!validateName(name)) return res.status(400).json({ message: 'Name must be 20-60 characters' });
        if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email format' });
        if (!validatePassword(password)) return res.status(400).json({ message: 'Password must be 8-16 characters, include one uppercase and one special character' });

        const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'USER', address]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Register error:', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error:', error: error.message });
    }
};

// Update password
const updatePassword = async (req, res) => {
    const { currentPassword, oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const actualOldPassword = oldPassword || currentPassword;

    try {
        if (!validatePassword(newPassword)) {
            return res.status(400).json({ message: 'New password must be 8-16 characters, include one uppercase and one special character' });
        }

        const [users] = await pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
        const isMatch = await bcrypt.compare(actualOldPassword, users[0].password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Update password error', error: error.message });
    }
};

module.exports = { register, login, updatePassword };
