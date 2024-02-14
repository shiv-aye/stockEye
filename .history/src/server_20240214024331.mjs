import express from 'express';
import path from 'path';
import { applyStrategyForMultipleStocks } from './niftyStrategy.mjs';

const app = express();

// Serve static files from the node_modules directory
const nodeModulesPath = path.resolve(path.join(__dirname, '../node_modules'));
app.use('/node_modules', express.static(nodeModulesPath));

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
app.get('*', (req, res) => {
    const indexPath = path.resolve(path.join(__dirname, '../src/index.html'));
    res.sendFile(indexPath);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});