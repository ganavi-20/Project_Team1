const express = require('express');
const {
  generateSecurePassword,
  generateBatchPasswords,
  generatePassphrase,
  analyzePassword,
  calculateEntropy,
  getCharacterSets
} = require('../services/passwordService');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Password Generator API',
    version: '1.0.0'
  });
});

// Generate single password
router.post('/generate', (req, res) => {
  try {
    const options = req.body;
 if (options.length && (options.length < 4 || options.length > 128)) {
      return res.status(400).json({
        success: false,
        error: 'Password length must be between 4 and 128 characters'
      });
    }

    const password = generateSecurePassword(options);
    const analysis = analyzePassword(password, options);
    
    res.json({
 success: true,
      password,
      strength: analysis.strength,
      score: analysis.score,
      feedback: analysis.feedback,
      length: analysis.length,
      entropy: analysis.entropy,
      characteristics: {
        hasUppercase: analysis.hasUppercase,
        hasLowercase: analysis.hasLowercase,
        hasNumbers: analysis.hasNumbers,
        hasSymbols: analysis.hasSymbols
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
// Generate multiple passwords
router.post('/generate-batch', (req, res) => {
  try {
    const { count = 5, ...options } = req.body;
    
    const passwords = generateBatchPasswords(count, options);

    res.json({
      success: true,
      passwords,
      count: passwords.length,
      options: options
    });
  } catch (error) {
res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Check password strength
router.post('/check-strength', (req, res) => {
  try {
    const { password, options = {} } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }
 if (typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Password must be a string'
      });
    }

    const analysis = analyzePassword(password, options);
    
    res.json({
      success: true,
      ...analysis
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

