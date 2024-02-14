import express from 'express';
import { applyStrategyForMultipleStocks } from './niftyStrategy.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve niftyStrategy.mjs directly
app.get('/niftyStrategy.mjs', (req, res) => {
    const strategyPath = path.join(__dirname, '../src/niftyStrategy.mjs');
    res.sendFile(strategyPath);
});

app.get('/styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../src/styles.css');
    res.sendFile(cssPath);
});

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

app.get('/strategy-summary', async (req, res) => {
    try {
        let watchlist = req.query.symbol || ['^NSEI']; // Default to Nifty 50 index if no symbol provided
        if (!Array.isArray(watchlist)) {
            watchlist = [watchlist]; // Convert single symbol to array
        }
        const strategySummaryData = await applyStrategyForMultipleStocks(watchlist);
        console.log(strategySummaryData)
        res.json(strategySummaryData);
    } catch (error) {
        console.error('Error fetching strategy summary:', error);
        res.status(500).json({ error: 'Error fetching strategy summary' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
