// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

// Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.message
    });
  }

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large'
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request format'
    });
  }
 // Handle rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: err.retryAfter
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/generate',
      'POST /api/generate-batch',
      'POST /api/check-strength',
      'GET /api/character-sets',
      'POST /api/generate-passphrase',
      'POST /api/analyze-bulk',
      'GET /api/stats'
    ],
    timestamp: new Date().toISOString()
  });
};
// Validation middleware for password generation
const validatePasswordRequest = (req, res, next) => {
  const { length, includeUpper, includeLower, includeNumbers, includeSymbols } = req.body;

  // Validate length
  if (length !== undefined) {
    if (typeof length !== 'number' || length < 4 || length > 128) {
      return res.status(400).json({
        success: false,
        error: 'Length must be a number between 4 and 128'
      });
    }
  }

