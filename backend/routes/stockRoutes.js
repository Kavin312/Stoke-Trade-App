const express = require('express');
const Stock = require('../models/Stock');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route GET /api/stocks  (list + search + sector filter)
router.get('/', async (req, res) => {
  try {
    const { search, sector, sort } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    if (sector) query.sector = sector;

    let cursor = Stock.find(query);
    if (sort === 'price_asc') cursor = cursor.sort({ price: 1 });
    if (sort === 'price_desc') cursor = cursor.sort({ price: -1 });

    const stocks = await cursor.exec();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stocks', error: err.message });
  }
});

// @route GET /api/stocks/:id (supports ObjectId or Symbol e.g. AAPL)
router.get('/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let stock;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      stock = await Stock.findById(req.params.id);
    }
    if (!stock) {
      stock = await Stock.findOne({ symbol: req.params.id.toUpperCase() });
    }
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stock', error: err.message });
  }
});

// @route POST /api/stocks (admin only - add new stock)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { symbol, name, price, sector } = req.body;
    if (!symbol || !name || price == null) {
      return res.status(400).json({ message: 'symbol, name and price are required' });
    }
    const exists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (exists) return res.status(409).json({ message: 'Stock symbol already exists' });

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name,
      price,
      previousClose: price,
      dayHigh: price,
      dayLow: price,
      sector: sector || 'General',
      history: [{ date: new Date(), price }]
    });
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create stock', error: err.message });
  }
});

// @route PUT /api/stocks/:id (admin only - update price/details)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const { price, name, sector } = req.body;
    if (price != null && price !== stock.price) {
      stock.previousClose = stock.price;
      stock.dayHigh = Math.max(stock.dayHigh, price);
      stock.dayLow = stock.dayLow ? Math.min(stock.dayLow, price) : price;
      stock.price = price;
      stock.history.push({ date: new Date(), price });
    }
    if (name) stock.name = name;
    if (sector) stock.sector = sector;

    await stock.save();
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update stock', error: err.message });
  }
});

// @route DELETE /api/stocks/:id (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete stock', error: err.message });
  }
});

module.exports = router;
