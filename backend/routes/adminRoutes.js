const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
router.use(protect, adminOnly);

// @route GET /api/admin/users
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
}));

// @route PUT /api/admin/users/:id/role
router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['USER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}));

// @route GET /api/admin/transactions  (monitor all trading activity)
router.get('/transactions', asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(transactions);
}));

// @route GET /api/admin/stats  (dashboard summary)
router.get('/stats', asyncHandler(async (req, res) => {
  const [userCount, stockCount, txCount] = await Promise.all([
    User.countDocuments(),
    Stock.countDocuments(),
    Transaction.countDocuments()
  ]);
  res.json({ userCount, stockCount, txCount });
}));

module.exports = router;
