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

