const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SHORT_DOMAIN = process.env.NODE_ENV === 'production' 
  ? "https://1REC.com"
  : `http://localhost:${PORT}`;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create URL schema
const UrlSchema = new mongoose.Schema({
  shortCode: String,
  originalUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', UrlSchema);

// Generate a shorter code (4 characters instead of 6)
const generateShortCode = () => Math.random().toString(36).substring(2, 6);

app.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    // Check if URL is valid
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Check if URL already exists
    const existingUrl = await Url.findOne({ originalUrl: url });
    if (existingUrl) {
      return res.json({ short_url: `${SHORT_DOMAIN}/${existingUrl.shortCode}` });
    }
    
    const shortCode = generateShortCode();
    await Url.create({ shortCode, originalUrl: url });
    
    return res.json({ short_url: `${SHORT_DOMAIN}/${shortCode}` });
  } catch (error) {
    console.error('Shortening error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    
    if (!url) return res.status(404).json({ error: 'URL not found' });
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
