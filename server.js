const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Simulated Blockchain/Smart Contract Logic ---
// This section simulates a blockchain's state and smart contract functions.
// In a real project, this would be a smart contract deployed on a network.

const marketData = {
  oil: { price: 82.45, change: 2.4, isPositive: true, lastUpdate: Date.now() },
  gas: { price: 2.67, change: -1.2, isPositive: false, lastUpdate: Date.now() },
  bdag: { price: 0.42, change: 5.7, isPositive: true, lastUpdate: Date.now() }
};

const predictions = [
  { id: 1, name: "CRUDE OIL (WTI)", date: "Next Week", value: "$85.72", change: "+2.4%" },
  { id: 2, name: "BRENT CRUDE", date: "Next Week", value: "$89.45", change: "+1.8%" },
  { id: 3, name: "NATURAL GAS", date: "Next Month", value: "$2.85", change: "-0.9%" },
  { id: 4, name: "GASOLINE", date: "Next Quarter", value: "$2.68", change: "+0.5%" },
  { id: 5, name: "DUBAI/OMAN CRUDE", date: "Next Week", value: "$87.10", change: "+1.2%" },
  { id: 6, name: "HENRY HUB (US)", date: "Next Month", value: "$3.12", change: "+1.1%" },
  { id: 7, name: "TTF (EU)", date: "Next Month", value: "€25.60", change: "-1.5%" },
  { id: 8, name: "JKM (ASIA LNG)", date: "Next Quarter", value: "$14.50", change: "+2.2%" },
];

const userTransactions = {}; // Stores transactions by wallet address

// Helper function to simulate price changes
function simulatePriceChange(currentPrice) {
  const change = currentPrice * (0.01 * (Math.random() * 0.1 - 0.05)); // -0.5% to +0.5%
  return (currentPrice + change).toFixed(2);
}

// Function to simulate daily price updates (as you requested "changes after 2 days")
function updateMarketData() {
  for (const asset in marketData) {
    const item = marketData[asset];
    const numericValue = parseFloat(item.price);
    const change = (Math.random() * 3).toFixed(2);
    item.price = parseFloat(simulatePriceChange(numericValue));
    item.change = parseFloat(change);
    item.isPositive = Math.random() > 0.5;
    item.lastUpdate = Date.now();
  }
}

// Update every 2 days (simulated by checking time difference)
setInterval(() => {
  const now = Date.now();
  if (now - marketData.oil.lastUpdate > 1000 * 60 * 60 * 24 * 2) { // 2 days in milliseconds
    updateMarketData();
  }
}, 1000 * 60 * 60); // Check every hour

// --- API Endpoints ---
app.get('/api/market-data', (req, res) => {
  res.json(marketData);
});

app.get('/api/predictions', (req, res) => {
  res.json(predictions);
});

app.post('/api/trade', (req, res) => {
  const { walletAddress, asset, amount, leverage, orderType, side } = req.body;

  if (!walletAddress || !asset || !amount || !leverage || !orderType || !side) {
    return res.status(400).json({ status: 'error', message: 'Missing trade parameters.' });
  }

  // In a real scenario, this is where you'd interact with a smart contract.
  // Here, we just simulate the transaction.
  const transaction = {
    id: Date.now(),
    walletAddress,
    asset,
    amount,
    leverage,
    orderType,
    side,
    timestamp: new Date().toISOString()
  };

  if (!userTransactions[walletAddress]) {
    userTransactions[walletAddress] = [];
  }
  userTransactions[walletAddress].push(transaction);

  console.log(`New transaction:`, transaction);
  res.json({
    status: 'success',
    message: `${side.toUpperCase()} order for ${amount} ${asset} processed.`,
    transaction
  });
});

app.get('/api/transactions/:walletAddress', (req, res) => {
  const { walletAddress } = req.params;
  const transactions = userTransactions[walletAddress] || [];
  res.json({ transactions });
});

// Start the server
app.listen(PORT, () => {
  console.log(`DAGfuel backend demo server listening on port ${PORT}`);
});
