import http from 'http';
import fs from 'fs';
import { applyStrategyForMultipleStocks } from './niftyStrategy.js';

let strategySummaryData = null;

async function fetchAndStoreStrategySummary() {
    try {
        const watchlist = ['^NSEI', 'TCS', 'AAPL']; // Example watchlist with multiple stocks
        strategySummaryData = await applyStrategyForMultipleStocks(watchlist);
        // Inside applyStrategyForMultipleStocks function in niftyStrategy.js
        console.log('Stock Data:', stockData);
    } catch (error) {
        console.error('Error fetching strategy summary:', error);
        strategySummaryData = JSON.stringify({ error: 'Error fetching strategy summary' });
    }
}

fetchAndStoreStrategySummary();

const server = http.createServer((req, res) => {
    if (req.url === '/strategy-summary') {
        if (strategySummaryData) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(strategySummaryData));
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Strategy summary not available' }));
        }
    } else if (req.url === '/' || req.url === '/index.html') { // Serve index.html for root and /index.html
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found!');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Page not found!');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
