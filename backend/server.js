require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Route imports - Ecommerce
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');

// Route imports - Newsletter
const articleRoutes = require('./routes/articleRoutes');
const mailArticleRoutes = require('./routes/mailArticleRoutes');
const fastFashionRoutes = require('./routes/fastFashionRoutes');
const luxuryFashionRoutes = require('./routes/luxuryFashionRoutes');
const sustainableFashionRoutes = require('./routes/sustainableFashionRoutes');
const sneakerWorldRoutes = require('./routes/sneakerWorldRoutes');

// Error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this for production
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Ecommerce API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

// Newsletter API Routes
app.use('/api/articles', articleRoutes);
app.use('/api/mail-articles', mailArticleRoutes);
app.use('/api/fast-fashion', fastFashionRoutes);
app.use('/api/luxury-fashion', luxuryFashionRoutes);
app.use('/api/sustainable-fashion', sustainableFashionRoutes);
app.use('/api/sneaker-world', sneakerWorldRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 Unified API for Ecommerce + Newsletter is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
