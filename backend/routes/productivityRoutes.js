const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, (req, res) => {
    res.json({ message: 'Protected productivity route works' });
});

module.exports = router;