const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('OWNER', 'ADMIN'), getOwnerDashboard);

module.exports = router;
