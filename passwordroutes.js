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

