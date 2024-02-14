import fetch from '../node_modules/node-fetch';

// Function to fetch data from Yahoo Finance API for a given stock symbol
async function fetchStockData(symbol) {
    try {
        // Constructing the URL for fetching data
        const startDate = Math.floor(new Date('2012-01-01').getTime() / 1000); // Example start date
        const endDate = Math.floor(new Date().getTime() / 1000); // Current date as end date
        const url = `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`;

        // Fetching data from the URL
        const response = await fetch(url);

        // Parsing the JSON response
        const data = await response.json();

        // Check if data is retrieved successfully
        if (response.ok) {
            // Returning the retrieved data
            return data;
        } else {
            // Handle error if data retrieval fails
            console.error(`Failed to fetch data for ${symbol}:`, data.error);
            return null;
        }
    } catch (error) {
        // Handling errors during data fetching
        console.error(`Error fetching data for ${symbol}:`, error);
        return null;
    }
}

// Function to map stock data into useful information
function mapStockData(stockData) {
    // Extracting relevant data from the fetched response
    const timestamps = stockData.chart.result[0].timestamp;
    const closePrices = stockData.chart.result[0].indicators.quote[0].close;

    // Array to store mapped data
    const mappedData = [];

    // Loop through the data to map it into useful information
    for (let i = 0; i < timestamps.length; i++) {
        const date = new Date(timestamps[i] * 1000).toISOString().split('T')[0]; // Convert timestamp to date
        const closingPrice = closePrices[i];
        const prevDayPrice = i > 0 ? closePrices[i - 1] : null;
        const prevWeekPrice = i > 6 ? closePrices[i - 7] : null;

        // Calculate percentage changes
        const percentChangeDay = prevDayPrice ? ((closingPrice - prevDayPrice) / prevDayPrice) * 100 : null;
        const percentChangeWeek = prevWeekPrice ? ((closingPrice - prevWeekPrice) / prevWeekPrice) * 100 : null;

        // Push mapped data into the array
        mappedData.push({
            date,
            closingPrice,
            percentChangeDay,
            percentChangeWeek
        });
    }

    return mappedData;
}

// Function to apply the trading strategy for multiple stocks in the watchlist
async function applyStrategyForMultipleStocks(watchlist) {
    const strategyResults = [];

    // Check if watchlist is an array
    if (Array.isArray(watchlist)) {
        // Loop through each symbol in the watchlist
        for (const symbol of watchlist) {
            const stockData = await fetchStockData(symbol);
            let mappedData;

            if (stockData) {
                mappedData = mapStockData(stockData);
                strategyResults.push({ symbol, data: mappedData });
            } else {
                console.error(`Failed to apply strategy for ${symbol} due to missing data.`);
            }
        }
    } else {
        // If watchlist is a single symbol
        const stockData = await fetchStockData(watchlist);
        let mappedData;

        if (stockData) {
            mappedData = mapStockData(stockData);
            strategyResults.push({ symbol: watchlist, data: mappedData });
        } else {
            console.error(`Failed to apply strategy for ${watchlist} due to missing data.`);
        }
    }

    return strategyResults;
}

// Exporting the applyStrategyForMultipleStocks function
export { applyStrategyForMultipleStocks };
