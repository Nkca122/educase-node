const express = require('express');
const router = express.Router();
const pool = require("../db/connect");

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6400;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Add School
router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        await pool.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, parseFloat(latitude), parseFloat(longitude)]
        );
        res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// List Schools
router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid coordinates' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM schools');
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        const sorted = rows.map(school => ({
            ...school,
            distance: haversine(userLat, userLon, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sorted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
