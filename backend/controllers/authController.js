const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { comparePassword, hashPassword } = require('../utils/hash');

// Login user (public)
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT users.id, users.username, users.password, roles.name AS role_name
             FROM users
             JOIN roles ON users.role_id = roles.id
             WHERE username=$1 AND is_active=true`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const valid = await comparePassword(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register user (admin only)
const registerUser = async (req, res) => {
    const { username, password, role_id } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (username, password, role_id)
             VALUES ($1, $2, $3)
             RETURNING id, username`,
            [username, hashedPassword, role_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser, registerUser };