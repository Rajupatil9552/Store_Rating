const express = require('express');
const router = express.Router();
const { submitRating, updateRating, getStoreRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

// Get ratings for a store
router.get('/:storeId', getStoreRatings);

// Protected routes (USER, ADMIN roles)
router.post('/', protect, submitRating);
router.put('/', protect, updateRating);

module.exports = router;
