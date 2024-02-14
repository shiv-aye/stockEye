import express from 'express';
import { applyStrategyForStock } from './niftyStrategy.mjs';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.get('/styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../src/styles.css');
    res.sendFile(cssPath);
});

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

app.get('/strategy-summary', async (req, res) => {
    try {
        const symbol = req.query.symbol || '^NSEI'; // Default to Nifty 50 index
        const strategySummaryData = await applyStrategyForStock(symbol);
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
