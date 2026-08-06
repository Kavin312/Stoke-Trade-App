const mongoose = require('mongoose');

const historicalPointSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    previousClose: { type: Number, default: 0 },
    dayHigh: { type: Number, default: 0 },
    dayLow: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    sector: { type: String, default: 'General' },
    history: { type: [historicalPointSchema], default: [] }
  },
  { timestamps: true }
);

stockSchema.virtual('changePercent').get(function () {
  if (!this.previousClose) return 0;
  return (((this.price - this.previousClose) / this.previousClose) * 100).toFixed(2);
});

stockSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Stock', stockSchema);
