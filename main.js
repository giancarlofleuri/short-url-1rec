const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const urlMap = {};

app.use(express.json());

// Route: Shorten URL
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url;
  if (!originalUrl) {
    return res.status(400).json({ error: "URL is required" });
  }
  
  const shortCode = Math.random().toString(36).substring(2, 8);
  urlMap[shortCode] = originalUrl;

  res.json({ short_url: `https://1REC.com/${shortCode}` });
});

// Route: Redirect Short URL
app.get('/:shortCode', (req, res) => {
  const originalUrl = urlMap[req.params.shortCode];
  if (!originalUrl) {
    return res.status(404).json({ error: "URL not found" });
  }
  res.redirect(originalUrl);
});

// Route: List URLs
app.get('/list', (req, res) => {
  res.json(urlMap);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
