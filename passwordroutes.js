const express = require('express');
const {
  generateSecurePassword,
  generateBatchPasswords,
  generatePassphrase,
  analyzePassword,
  calculateEntropy,
  getCharacterSets
} = require('../services/passwordService');


