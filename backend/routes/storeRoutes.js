const express = require('express');
const router = express.Router();
const { getStores, searchStores, createStore, updateStore, deleteStore } = require('../controllers/storeController');
const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

// Public / User-Aware
router.get('/', optionalProtect, getStores);
router.get('/search', optionalProtect, searchStores);

// Protected (OWNER, ADMIN Only)
router.post('/', protect, authorize('OWNER', 'ADMIN'), createStore);
router.put('/:id', protect, authorize('OWNER', 'ADMIN'), updateStore);
router.delete('/:id', protect, authorize('OWNER', 'ADMIN'), deleteStore);

module.exports = router;
