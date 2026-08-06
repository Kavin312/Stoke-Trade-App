require('dotenv').config();
const connectDB = require('./config/db');
const Stock = require('./models/Stock');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');

const stocksSeed = [
  // Technology
  { symbol: 'AAPL', name: 'Apple Inc.', price: 190.5, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 152.3, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.6, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 125.8, sector: 'Technology' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 160.2, sector: 'Technology' },
  { symbol: 'INTC', name: 'Intel Corp.', price: 30.5, sector: 'Technology' },
  { symbol: 'ORCL', name: 'Oracle Corp.', price: 138.4, sector: 'Technology' },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 240.1, sector: 'Technology' },
  { symbol: 'CSCO', name: 'Cisco Systems', price: 48.3, sector: 'Technology' },
  { symbol: 'IBM', name: 'IBM Corp.', price: 175.9, sector: 'Technology' },
  { symbol: 'ADBE', name: 'Adobe Inc.', price: 520.4, sector: 'Technology' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', price: 205.1, sector: 'Technology' },
  { symbol: 'TXN', name: 'Texas Instruments', price: 195.6, sector: 'Technology' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', price: 1350.0, sector: 'Technology' },
  { symbol: 'NOW', name: 'ServiceNow Inc.', price: 780.2, sector: 'Technology' },
  { symbol: 'PLTR', name: 'Palantir Technologies', price: 25.4, sector: 'Technology' },
  { symbol: 'UBER', name: 'Uber Technologies', price: 72.3, sector: 'Technology' },

  // Automotive
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.8, sector: 'Automotive' },
  { symbol: 'TATA', name: 'Tata Motors Ltd.', price: 34.2, sector: 'Automotive' },
  { symbol: 'F', name: 'Ford Motor Co.', price: 12.1, sector: 'Automotive' },
  { symbol: 'GM', name: 'General Motors', price: 45.6, sector: 'Automotive' },
  { symbol: 'RIVN', name: 'Rivian Automotive', price: 14.8, sector: 'Automotive' },
  { symbol: 'LCID', name: 'Lucid Group', price: 3.25, sector: 'Automotive' },
  { symbol: 'RACE', name: 'Ferrari N.V.', price: 410.5, sector: 'Automotive' },

  // E-Commerce & Retail
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.2, sector: 'E-Commerce' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 68.4, sector: 'Retail' },
  { symbol: 'TGT', name: 'Target Corp.', price: 145.2, sector: 'Retail' },
  { symbol: 'SHOP', name: 'Shopify Inc.', price: 65.8, sector: 'E-Commerce' },
  { symbol: 'EBAY', name: 'eBay Inc.', price: 54.1, sector: 'E-Commerce' },
  { symbol: 'COST', name: 'Costco Wholesale', price: 850.3, sector: 'Retail' },
  { symbol: 'BABA', name: 'Alibaba Group', price: 76.4, sector: 'E-Commerce' },
  { symbol: 'HD', name: 'The Home Depot', price: 360.7, sector: 'Retail' },

  // Media & Entertainment
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 632.1, sector: 'Media' },
  { symbol: 'DIS', name: 'The Walt Disney Co.', price: 98.5, sector: 'Media' },
  { symbol: 'SPOT', name: 'Spotify Technology', price: 315.4, sector: 'Media' },
  { symbol: 'WBD', name: 'Warner Bros. Discovery', price: 8.2, sector: 'Media' },
  { symbol: 'PARA', name: 'Paramount Global', price: 11.5, sector: 'Media' },
  { symbol: 'SONY', name: 'Sony Group Corp.', price: 85.3, sector: 'Media' },
  { symbol: 'RBLX', name: 'Roblox Corp.', price: 36.9, sector: 'Gaming' },

  // Finance & Banking
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.4, sector: 'Finance' },
  { symbol: 'BAC', name: 'Bank of America', price: 39.8, sector: 'Finance' },
  { symbol: 'WFC', name: 'Wells Fargo & Co.', price: 58.1, sector: 'Finance' },
  { symbol: 'C', name: 'Citigroup Inc.', price: 63.2, sector: 'Finance' },
  { symbol: 'GS', name: 'Goldman Sachs', price: 460.5, sector: 'Finance' },
  { symbol: 'MS', name: 'Morgan Stanley', price: 96.8, sector: 'Finance' },
  { symbol: 'V', name: 'Visa Inc.', price: 275.4, sector: 'Finance' },
  { symbol: 'MA', name: 'Mastercard Inc.', price: 450.2, sector: 'Finance' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: 64.3, sector: 'Finance' },
  { symbol: 'SQ', name: 'Block Inc.', price: 62.8, sector: 'Finance' },

  // Healthcare & Pharmaceuticals
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 155.6, sector: 'Healthcare' },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.4, sector: 'Healthcare' },
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 520.1, sector: 'Healthcare' },
  { symbol: 'LLY', name: 'Eli Lilly & Co.', price: 810.5, sector: 'Healthcare' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', price: 172.3, sector: 'Healthcare' },
  { symbol: 'MRK', name: 'Merck & Co.', price: 128.4, sector: 'Healthcare' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific', price: 560.2, sector: 'Healthcare' },
  { symbol: 'ABT', name: 'Abbott Laboratories', price: 105.8, sector: 'Healthcare' },
  { symbol: 'AMGN', name: 'Amgen Inc.', price: 310.4, sector: 'Healthcare' },
  { symbol: 'CVS', name: 'CVS Health Corp.', price: 61.2, sector: 'Healthcare' },

  // Energy & Industrials
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', price: 118.5, sector: 'Energy' },
  { symbol: 'CVX', name: 'Chevron Corp.', price: 156.2, sector: 'Energy' },
  { symbol: 'SHEL', name: 'Shell plc', price: 71.4, sector: 'Energy' },
  { symbol: 'TTE', name: 'TotalEnergies SE', price: 67.8, sector: 'Energy' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', price: 340.5, sector: 'Industrials' },
  { symbol: 'DE', name: 'Deere & Company', price: 380.2, sector: 'Industrials' },
  { symbol: 'BA', name: 'The Boeing Company', price: 182.4, sector: 'Aerospace' },
  { symbol: 'GE', name: 'GE Aerospace', price: 162.1, sector: 'Industrials' },
  { symbol: 'HON', name: 'Honeywell Intl', price: 210.3, sector: 'Industrials' },

  // Consumer Goods & Telecom
  { symbol: 'KO', name: 'The Coca-Cola Co.', price: 63.8, sector: 'Consumer Goods' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', price: 168.4, sector: 'Consumer Goods' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 165.2, sector: 'Consumer Goods' },
  { symbol: 'NKE', name: 'NIKE Inc.', price: 75.6, sector: 'Consumer Goods' },
  { symbol: 'MCD', name: "McDonald's Corp.", price: 258.9, sector: 'Consumer Goods' },
  { symbol: 'SBUX', name: 'Starbucks Corp.', price: 77.4, sector: 'Consumer Goods' },
  { symbol: 'T', name: 'AT&T Inc.', price: 18.6, sector: 'Telecom' },
  { symbol: 'VZ', name: 'Verizon Communications', price: 41.2, sector: 'Telecom' },

  // Aerospace & Defense
  { symbol: 'LMT', name: 'Lockheed Martin', price: 475.2, sector: 'Aerospace' },
  { symbol: 'RTX', name: 'RTX Corporation', price: 102.5, sector: 'Aerospace' },
  { symbol: 'NOC', name: 'Northrop Grumman', price: 445.8, sector: 'Aerospace' },
  { symbol: 'GD', name: 'General Dynamics', price: 290.1, sector: 'Aerospace' }
];

const run = async () => {
  await connectDB();

  for (const s of stocksSeed) {
    const exists = await Stock.findOne({ symbol: s.symbol });
    if (!exists) {
      await Stock.create({
        ...s,
        previousClose: s.price,
        dayHigh: s.price,
        dayLow: s.price,
        history: [{ date: new Date(), price: s.price }]
      });
      console.log('Seeded stock:', s.symbol);
    } else {
      exists.name = s.name;
      exists.sector = s.sector;
      await exists.save();
    }
  }

  const adminEmail = 'admin@stocktrader.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'ADMIN',
      balance: 1000000
    });
    await admin.save();
    let port = await Portfolio.findOne({ user: admin._id });
    if (!port) await Portfolio.create({ user: admin._id, holdings: [] });
    console.log('Seeded admin user: admin@stocktrader.com / admin123');
  } else {
    admin.password = 'admin123';
    admin.role = 'ADMIN';
    await admin.save();
    console.log('Reset admin user password to admin123');
  }

  console.log(`Seeding complete. Total stocks configured: ${stocksSeed.length}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

