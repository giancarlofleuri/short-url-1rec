const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// In-memory database for URL mapping
const urlMap = {};

// Short domain
const SHORT_DOMAIN = "https://short-url-1rec-pf4l.vercel.app";

// Generate a random short code
const generateShortCode = () => Math.random().toString(36).substring(2, 8);

// Shorten URL endpoint
app.post('/shorten', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = generateShortCode();
    urlMap[shortCode] = url;

    return res.json({ short_url: `${SHORT_DOMAIN}/${shortCode}` });
});

// Redirect endpoint
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;

    const originalUrl = urlMap[shortCode];
    if (!originalUrl) {
        return res.status(404).json({ error: 'URL not found' });
    }

    return res.redirect(originalUrl);
});

module.exports = app;
