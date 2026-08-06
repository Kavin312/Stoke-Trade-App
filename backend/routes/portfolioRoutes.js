const express = require('express');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// @route GET /api/portfolio  (current holdings + profit/loss)
router.get('/', protect, asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    return res.json({ 
      holdings: [], 
      totalValue: 0, 
      totalInvested: 0, 
      profitLoss: 0,
      balance: req.user.balance 
    });
  }

  const symbols = portfolio.holdings.map((h) => h.symbol);
  const stocks = await Stock.find({ symbol: { $in: symbols } });
  const stockMap = Object.fromEntries(stocks.map((s) => [s.symbol, s]));

  let totalValue = 0;
  let totalInvested = 0;

  const enriched = portfolio.holdings.map((h) => {
    const s = stockMap[h.symbol];
    const currentPrice = s ? s.price : 0;
    const marketValue = currentPrice * h.quantity;
    const invested = h.avgBuyPrice * h.quantity;
    totalValue += marketValue;
    totalInvested += invested;
    return {
      stock: s ? s._id : h.symbol,
      symbol: h.symbol,
      quantity: h.quantity,
      avgBuyPrice: h.avgBuyPrice,
      currentPrice,
      marketValue,
      profitLoss: marketValue - invested,
      profitLossPercent: invested ? (((marketValue - invested) / invested) * 100).toFixed(2) : '0.00'
    };
  });

  res.json({
    holdings: enriched,
    totalValue,
    totalInvested,
    profitLoss: totalValue - totalInvested,
    balance: req.user.balance
  });
}));

module.exports = router;
