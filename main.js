const express = require('express');
const app = express();
const crypto = require('crypto');

// In-memory database for URL storage
const urlMap = {};

// Your short domain
const SHORT_DOMAIN = "https://1REC.com";

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to shorten a URL
app.post('/shorten', (req, res) => {
    const originalUrl = req.body.url;
    if (!originalUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    // Check if the URL is already shortened
    const existingCode = Object.keys(urlMap).find(
        (key) => urlMap[key] === originalUrl
    );
    if (existingCode) {
        return res.json({ short_url: `${SHORT_DOMAIN}/${existingCode}` });
    }

    // Generate a unique short code
