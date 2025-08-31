require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const db = require('./models');

// Import all route files
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const flightRoutes = require('./routes/flight.routes');
const bookingRoutes = require('./routes/booking.routes');
const customerRoutes = require('./routes/customer.routes');

const app = express();

// Core Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Set various HTTP headers for security
app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Database Connection and Sync
db.sequelize.sync() // Use { force: true } during development to drop and re-sync tables
 .then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
 .catch((err) => {
    console.error("Failed to sync database: " + err.message);
  });

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the ARIANO Flight Booking API.',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      flights: '/api/flights',
      bookings: '/api/bookings',
      customer: '/api/customer'
    }
  });
});

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customer', customerRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client-app/build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-app', 'build', 'index.html'));
  });
}
