const express = require('express');
const app = express();

const AUTH_TOKEN = 'a1iOjACwaXNo690iBNW0bdIq';

// Middleware to validate token
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.split(' ')[1] !== AUTH_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
});

app.use(express.json());

// Your routes here
app.post('/shorten', (req, res) => {
    res.json({ message: 'Shorten endpoint works!' });
});

app.get('/list', (req, res) => {
    res.json({ message: 'List endpoint works!' });
});

app.get('/:shortCode', (req, res) => {
    res.json({ message: `Shortcode endpoint works for: ${req.params.shortCode}` });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
