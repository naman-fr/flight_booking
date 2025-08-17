require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
//... other route imports

const app = express();

// Core Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Set various HTTP headers for security
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

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
  res.json({ message: 'Welcome to the ARIANO Flight Booking API.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
//... other route uses

// Global Error Handler (to be implemented)

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