import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import { applyStrategyForMultipleStocks } from './niftyStrategy.mjs';

const app = express();

// Serve static files from the node_modules directory
const nodeModulesPath = join(dirname(fileURLToPath(import.meta.url)), '../node_modules');
const srcFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../src');
app.use('/node_modules', express.static(nodeModulesPath));
app.use('./niftyStrategy.mjs', express.static(srcFolderPath))
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
    const indexPath = join(dirname(fileURLToPath(import.meta.url)), '../src/index.html');
    res.sendFile(indexPath);
});

// Route to serve the CSS file
app.get('/styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../public/styles.css');
    const cssStream = createReadStream(cssPath);
    cssStream.pipe(res);
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});