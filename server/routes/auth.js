const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secure_secret_key';

// Register User
router.post('/register', async (req, res) => {
    console.log('Register request:', req.body); // LOGGING
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if user exists
        const existingUsers = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log('Existing users check:', existingUsers); // LOGGING

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        console.log('Insert result:', result); // LOGGING

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration Error:', err); // LOGGING
        res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    console.log('Login request:', req.body); // LOGGING
    const { username, password } = req.body;

    try {
        const users = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, username: user.username, is_admin: user.is_admin },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
    } catch (err) {
        console.error('Login Error:', err); // LOGGING
        res.status(500).json({ error: 'Login failed: ' + err.message });
    }
});

module.exports = router;
