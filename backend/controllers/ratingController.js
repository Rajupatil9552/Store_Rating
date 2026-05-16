const pool = require('../config/db');

// Submit a new rating
const submitRating = async (req, res) => {
    const { storeId, rating, comment = '' } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating) {
        return res.status(400).json({ message: 'Store ID and Rating are required' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        // Check if user already rated this store
        const [existing] = await pool.execute(
            'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already rated this store. Your previous rating was ' + existing[0].rating });
        }

        // Insert rating
        await pool.execute(
            'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, storeId, rating, comment]
        );

        // Update Store Average Rating
        const [allRatings] = await pool.execute('SELECT rating FROM ratings WHERE store_id = ?', [storeId]);
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        await pool.execute('UPDATE stores SET average_rating = ? WHERE id = ?', [avg, storeId]);

        res.status(201).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).json({ message: 'Database Error: ' + error.message });
    }
};

// Update an existing rating
const updateRating = async (req, res) => {
    const { storeId, rating, comment = '' } = req.body;
    const userId = req.user.id;

    try {
        const [existing] = await pool.execute(
            'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Rating not found.' });
        }

        // Update rating
        await pool.execute(
            'UPDATE ratings SET rating = ?, comment = ? WHERE user_id = ? AND store_id = ?',
            [rating, comment, userId, storeId]
        );

        // Update Store Average Rating
        const [allRatings] = await pool.execute('SELECT rating FROM ratings WHERE store_id = ?', [storeId]);
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        await pool.execute('UPDATE stores SET average_rating = ? WHERE id = ?', [avg, storeId]);

        res.json({ message: 'Rating updated successfully' });
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).json({ message: 'Database Error: ' + error.message });
    }
};

// Get ratings for a store (restored from previous)
const getStoreRatings = async (req, res) => {
    try {
        const [ratings] = await pool.execute(
            'SELECT r.*, u.name as user_name FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ? ORDER BY r.created_at DESC',
            [req.params.storeId]
        );
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ratings', error: error.message });
    }
};

module.exports = { submitRating, updateRating, getStoreRatings };
