const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        // Total revenue
        const revenueRows = await db.query('SELECT SUM(total_amount) as total FROM bills');
        const totalRevenue = revenueRows[0].total || 0;

        // Total bills count
        const countRows = await db.query('SELECT COUNT(*) as count FROM bills');
        const totalBills = countRows[0].count || 0;

        // Revenue this month
        // SQLite syntax for current month
        const monthlyRows = await db.query(`
            SELECT SUM(total_amount) as total 
            FROM bills 
            WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        `);
        const monthlyRevenue = monthlyRows[0].total || 0;

        res.json({
            totalRevenue,
            totalBills,
            monthlyRevenue
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
