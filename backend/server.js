// EN: Builds the Express API and connects shared middleware, route modules, and error handlers; SI: Express API එක සකසා middleware, routes සහ දෝෂ හසුරුවීම් සම්බන්ධ කරයි.
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// EN: Error middleware is registered after routes so it can process downstream failures; SI: පසුකාලීන දෝෂ හසුරුවීමට error middleware routes වලට පසුව ලියාපදිංචි කරයි.
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// EN: Each router groups endpoints and delegates work to its controller; SI: එක් එක් router endpoint එකතු කර කාර්යය controller වෙත යොමු කරයි.
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// EN: Load configuration before opening the database connection; SI: දත්ත සමුදා සම්බන්ධතාවය ආරම්භ කිරීමට පෙර පරිසර සැකසුම් පටවයි.
dotenv.config();

// EN: Start database setup; the connector selects MongoDB or the configured fallback; SI: MongoDB හෝ fallback තේරීමට දත්ත සමුදා සම්බන්ධකය ආරම්භ කරයි.
connectDB();

const app = express();

// EN: Parse JSON request bodies and allow cross-origin API calls; SI: JSON ඉල්ලීම් කියවා වෙනත් origin වලින් API ඇමතුම් ඉඩ දෙයි.
app.use(express.json());
app.use(cors());

// EN: Add request logging only during development; SI: development පරිසරයේදී පමණක් request log කිරීම සක්‍රිය කරයි.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// EN: Lightweight endpoint for checking whether the API is responding; SI: API ප්‍රතිචාර දක්වන්නේදැයි පරීක්ෂා කරන සරල endpoint එක.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ALoraLuxe REST API',
    tagline: 'Luxury Fashion & Everything, Simplified.',
    timestamp: new Date(),
  });
});

// EN: Root endpoint provides a basic server status message; SI: මූල endpoint එකෙන් server තත්ත්ව පණිවිඩයක් ලබා දෙයි.
app.get('/', (req, res) => {
  res.send('ALoraLuxe API Server Running Cleanly.');
});

// EN: Mount feature routers under their API prefixes; SI: feature routers අදාළ API prefix යටතේ සම්බන්ධ කරයි.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// EN: Convert unmatched paths and thrown errors into consistent responses; SI: නොගැළපෙන paths සහ දෝෂ ස්ථාවර ප්‍රතිචාර බවට පත් කරයි.
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  // EN: Start listening only when run directly, not when imported by tests/serverless; SI: tests හෝ serverless import සඳහා නොව සෘජුව ධාවනයේදී පමණක් listen කරයි.
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] NexCart backend server running on port ${PORT}`);
  });
}

module.exports = app;
