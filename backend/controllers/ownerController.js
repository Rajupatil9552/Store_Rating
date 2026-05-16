const pool = require('../config/db');

// Get owner dashboard stats (OWNER/ADMIN only)
const getOwnerDashboard = async (req, res) => {
    const ownerId = req.user.id;

    try {
        // Fetch all stores owned by this owner
        const [stores] = await pool.execute(
            'SELECT id, name, address, average_rating FROM stores WHERE owner_id = ?',
            [ownerId]
        );

        if (stores.length === 0) {
            return res.json({ message: 'No stores found for this owner.', stores: [] });
        }

        // For each store, fetch the list of ratings with user details
        const results = await Promise.all(stores.map(async (store) => {
            const [ratings] = await pool.execute(`
                SELECT u.name, u.email, r.rating, r.comment, r.created_at
                FROM ratings r
                JOIN users u ON r.user_id = u.id
                WHERE r.store_id = ?
                ORDER BY r.created_at DESC
            `, [store.id]);

            return {
                ...store,
                ratings
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Dashboard error', error: error.message });
    }
};

module.exports = { getOwnerDashboard };
