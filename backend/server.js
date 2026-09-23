const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body Parser & CORS
app.use(express.json());
app.use(cors());

// Logging in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'NexCart REST API',
    tagline: 'Smart Shopping, Simplified.',
    timestamp: new Date(),
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('NexCart API Server Running Cleanly.');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] NexCart backend server running on port ${PORT}`);
  });
}

module.exports = app;
