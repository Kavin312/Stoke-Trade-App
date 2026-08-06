require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Stock = require('./models/Stock');

const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Simple request logger (centralized logging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;

const startMarketSimulator = () => {
  // Simulates live market price movement every 5 seconds for all 80 stocks
  setInterval(async () => {
    try {
      const stocks = await Stock.find();
      if (!stocks || stocks.length === 0) return;

      const now = new Date();
      const bulkOps = stocks.map((stock) => {
        const changePct = (Math.random() - 0.5) * 0.02; // +/-1%
        const newPrice = Math.max(0.5, +(stock.price * (1 + changePct)).toFixed(2));
        const dayHigh = Math.max(stock.dayHigh || newPrice, newPrice);
        const dayLow = stock.dayLow ? Math.min(stock.dayLow, newPrice) : newPrice;

        const history = (stock.history && stock.history.length > 0) ? stock.history : [{ date: now, price: stock.price }];
        history.push({ date: now, price: newPrice });
        if (history.length > 200) history.shift();

        return {
          updateOne: {
            filter: { _id: stock._id },
            update: {
              $set: {
                previousClose: stock.price,
                dayHigh: dayHigh,
                dayLow: dayLow,
                price: newPrice,
                history: history
              }
            }
          }
        };
      });

      if (bulkOps.length > 0) {
        await Stock.bulkWrite(bulkOps);
      }
    } catch (err) {
      console.error('Market simulator error:', err.message);
    }
  }, 5000);
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startMarketSimulator();
  });
});

module.exports = app;
