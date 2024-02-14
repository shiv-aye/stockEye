import express from 'express';
import { applyStrategyForMultipleStocks } from './niftyStrategy.mjs';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Route to serve the CSS file
app.get('/styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../src/styles.css');
    const cssStream = createReadStream(cssPath);
    cssStream.pipe(res);
});

// Serve static files from the src directory
app.get('/node_modules', (req, res) => {
    const cssPath = path.join(__dirname, '../node_modules');
    const cssStream = createReadStream(cssPath);
    cssStream.pipe(res);
});

// Route to fetch and serve the strategy summary data
app.get('/strategy-summary', async (req, res) => {
    try {
        const watchlist = ['^NSEI', 'TCS', 'AAPL']; // Example watchlist with multiple stocks
        const strategySummaryData = await applyStrategyForMultipleStocks(watchlist);
        res.json(strategySummaryData);
    } catch (error) {
        console.error('Error fetching strategy summary:', error);
        res.status(500).json({ error: 'Error fetching strategy summary' });
    }
});

// Serve index.html for all other routes
app.get('/src/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
