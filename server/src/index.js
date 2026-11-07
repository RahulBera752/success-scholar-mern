
require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env'),
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

if (!process.env.JWT_SECRET) {
  console.error(
    'Missing JWT_SECRET. Copy server/.env.example to server/.env and set values.'
  );
  process.exit(1);
}

const app = express();

// CORS configuration
const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');

      // Allow configured frontend URLs
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Allow localhost development environments
      if (/^http:\/\/localhost:\d+$/.test(normalizedOrigin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments of Success Scholar
      if (
        /^https:\/\/success-scholar-mern-[a-z0-9-]+\.vercel\.app$/i.test(
          normalizedOrigin
        )
      ) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '100kb' }));

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// AI website chatbot
app.use('/api/chatbot', require('./routes/chatbot'));

// Admin routes
app.use('/api/admin', require('./routes/admin'));

// Feedback routes
app.use('/api/feedback', require('./routes/feedback'));

// Payment routes — REQUIRED for Book Demo and course payments
app.use('/api/payment', require('./routes/payment'));

// Public routes
app.use('/api', require('./routes/public'));

// Visitor analytics route
app.use('/api/analytics', require('./routes/analytics'));

// Error handling — keep these after all routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('\nCould not connect to MongoDB:', err.message);
    console.error(
      'Check that MongoDB is running and MONGODB_URI in server/.env is correct (see README).'
    );
    process.exit(1);
  });
