const express = require('express');
const playwright = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/render', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const content = await page.content();
    await browser.close();
    res.set('Content-Type', 'text/html');
    res.send(content);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

app.get('/', (req, res) => {
  res.send('Playwright Scraper is running');
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});