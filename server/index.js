const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Smart List Calculator API is running');
});

// Import Routes
const billRoutes = require('./routes/bills');
const noteRoutes = require('./routes/notes');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
