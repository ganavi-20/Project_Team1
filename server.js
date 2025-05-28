const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passwordRoutes = require('./routes/passwordRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100,
	message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);
// Routes
app.use('/api', passwordRoutes);
// Error handling middleware
app.use(errorHandler);
// 404 handler
app.use('*', notFoundHandler);
