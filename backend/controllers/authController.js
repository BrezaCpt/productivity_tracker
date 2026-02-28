const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');
require('dotenv').config();

// Admin creates user
const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ message: 'All fields required' });
        }

        // Get role id
        const roleResult = await pool.query(
            'SELECT id FROM roles WHERE name = $1',
            [role]
        );

        if (roleResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const hashedPassword = await hashPassword(password);

        await pool.query(
            'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3)',
            [username, hashedPassword, roleResult.rows[0].id]
        );

        res.status(201).json({ message: 'User created successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            `SELECT users.id, users.password, roles.name as role
             FROM users
             JOIN roles ON users.role_id = roles.id
             WHERE username = $1 AND is_active = true`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };