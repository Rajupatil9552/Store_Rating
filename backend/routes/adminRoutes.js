const express = require('express');
const router = express.Router();
const { createUser, createStore, getDashboardStats, listStores, listUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Pluralized endpoints to match REST conventions and frontend calls
router.post('/users', protect, authorize('ADMIN'), createUser);
router.post('/create-store', protect, authorize('ADMIN'), createStore);

// Dashboard data
router.get('/stats', protect, authorize('ADMIN'), getDashboardStats);
router.get('/stores', protect, authorize('ADMIN'), listStores);
router.get('/users', protect, authorize('ADMIN'), listUsers);

// Diagnostic test
router.get('/debug', (req, res) => res.json({ status: 'Admin routes active' }));

module.exports = router;
