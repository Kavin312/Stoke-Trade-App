const express = require('express');
const mongoose = require('mongoose');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const findStock = async (idOrSymbol) => {
  if (!idOrSymbol) return null;
  if (mongoose.Types.ObjectId.isValid(idOrSymbol)) {
    const s = await Stock.findById(idOrSymbol);
    if (s) return s;
  }
  return await Stock.findOne({ symbol: String(idOrSymbol).toUpperCase() });
};

// @route POST /api/trade/buy
router.post('/buy', protect, asyncHandler(async (req, res) => {
  const { stockId, quantity } = req.body;
  if (!stockId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'stockId and a positive quantity are required' });
  }

  const stock = await findStock(stockId);
  if (!stock) return res.status(404).json({ message: 'Stock not found' });

  const cost = stock.price * quantity;
  const user = await User.findById(req.user._id);
  if (user.balance < cost) {
    return res.status(400).json({ message: 'Insufficient balance for this trade' });
  }

  user.balance -= cost;
  await user.save();

  let portfolio = await Portfolio.findOne({ user: user._id });
  if (!portfolio) portfolio = await Portfolio.create({ user: user._id, holdings: [] });

  const holding = portfolio.holdings.find((h) => h.symbol === stock.symbol);
  if (holding) {
    const newQty = holding.quantity + quantity;
    holding.avgBuyPrice = (holding.avgBuyPrice * holding.quantity + cost) / newQty;
    holding.quantity = newQty;
  } else {
    portfolio.holdings.push({
      stock: stock._id,
      symbol: stock.symbol,
      quantity,
      avgBuyPrice: stock.price
    });
  }
  await portfolio.save();

  const tx = await Transaction.create({
    user: user._id,
    stock: stock._id,
    symbol: stock.symbol,
    type: 'BUY',
    quantity,
    price: stock.price,
    total: cost
  });

  res.status(201).json({ transaction: tx, balance: user.balance, portfolio });
}));

// @route POST /api/trade/sell
router.post('/sell', protect, asyncHandler(async (req, res) => {
  const { stockId, quantity } = req.body;
  if (!stockId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'stockId and a positive quantity are required' });
  }

  const stock = await findStock(stockId);
  if (!stock) return res.status(404).json({ message: 'Stock not found' });

  const portfolio = await Portfolio.findOne({ user: req.user._id });
  const holding = portfolio && portfolio.holdings.find((h) => h.symbol === stock.symbol);
  if (!holding || holding.quantity < quantity) {
    return res.status(400).json({ message: 'Not enough shares to sell' });
  }

  const proceeds = stock.price * quantity;
  const user = await User.findById(req.user._id);
  user.balance += proceeds;
  await user.save();

  holding.quantity -= quantity;
  if (holding.quantity === 0) {
    portfolio.holdings = portfolio.holdings.filter((h) => h.symbol !== stock.symbol);
  }
  await portfolio.save();

  const tx = await Transaction.create({
    user: user._id,
    stock: stock._id,
    symbol: stock.symbol,
    type: 'SELL',
    quantity,
    price: stock.price,
    total: proceeds
  });

  res.status(201).json({ transaction: tx, balance: user.balance, portfolio });
}));

// @route GET /api/trade/history
router.get('/history', protect, asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(transactions);
}));

module.exports = router;
