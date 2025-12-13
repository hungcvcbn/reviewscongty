const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import config
const config = require('./config');

// Import database
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// Import routes
const routes = require('./routes');

// Import middleware
const { notFound, errorHandler } = require('./middleware');

// Initialize Express app
const app = express();

// ========== Security Middleware ==========

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Quá nhiều request. Vui lòng thử lại sau.',
  },
});
app.use('/api', limiter);

// ========== Body Parsers ==========

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== Logging ==========

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ========== Static Files ==========

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', config.upload.path)));

// ========== API Routes ==========

app.use('/api', routes);

// ========== Root Route ==========

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Review Company API v1.0',
    documentation: '/api/health',
  });
});

// ========== Error Handling ==========

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ========== Server Startup ==========

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    // Use { force: true } only in development to recreate tables
    // Use { alter: true } to update table structure
    await syncDatabase({ alter: config.nodeEnv === 'development' });

    // Start server
    app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Review Company API Server                             ║
║                                                            ║
║   Server:      http://localhost:${config.port}                   ║
║   Environment: ${config.nodeEnv.padEnd(39)}║
║   Database:    Connected ✅                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
