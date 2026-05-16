const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const seed = async () => {
    // Database connection
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'rating_system'
    });

    try {
        const name = "System Administrator Root Account"; // 31 chars
        const email = "admin@nexus.com";
        const password = "Admin@Nexus123"; // Meets all requirements
        const role = "ADMIN";
        const address = "System Core HQ, Nexus City";

        // Check if exists
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('Admin already exists.');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.execute(
            'INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, address]
        );

        console.log('=========================================');
        console.log('ADMIN ACCOUNT CREATED SUCCESSFULLY');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('=========================================');

    } catch (err) {
        console.error('Seed Error:', err);
    } finally {
        await connection.end();
    }
};

seed();
