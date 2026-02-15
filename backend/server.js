const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const itemsRoutes = require('./src/routes/items');
const recipesRoutes = require('./src/routes/recipes');
const storesRoutes = require('./src/routes/stores');
const ordersRoutes = require('./src/routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/orders', ordersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Food Inventory API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
