const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');
const { addEntry, getEntries, deleteEntry } = require('../controllers/productivityController');

// Add new entry
router.post('/', authenticateToken, addEntry);

// Get entries
router.get('/', authenticateToken, getEntries);

// Delete entry by ID
router.delete('/:id', authenticateToken, deleteEntry);

module.exports = router;