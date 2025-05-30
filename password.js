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

 // Validate options
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
// Get character sets information
router.get('/character-sets', (req, res) => {
  try {
    const characterSets = getCharacterSets();

    res.json({
      success: true,
      characterSets,
      totalPossibleCombinations: {
        withoutSymbols: Math.pow(62, 12), // Upper + Lower + Numbers for 12 chars
        withSymbols: Math.pow(94, 12), // All characters for 12 chars
        note: 'Calculations shown for 12-character passwords'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve character sets'
    });
  }
});
// Generate passphrase
router.post('/generate-passphrase', (req, res) => {
  try {
    const options = req.body;

    const result = generatePassphrase(options);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
const results = passwords.map((password, index) => {
      try {
        const analysis = analyzePassword(password, options);
        return {
          index,
          password: password.substring(0, 20) + (password.length > 20 ? '...' : ''), // Truncate for privacy
          ...analysis
        };
      } catch (error) {
        return {
          index,
          error: error.message
        };
      }
    });
// Calculate summary statistics
    const validResults = results.filter(r => !r.error);
    const avgScore = validResults.length > 0 ? 
      validResults.reduce((sum, r) => sum + r.score, 0) / validResults.length : 0;
    
    const strengthDistribution = validResults.reduce((acc, r) => {
      acc[r.strength] = (acc[r.strength] || 0) + 1;
      return acc;
    }, {});
res.json({
      success: true,
      results,
      summary: {
        total: passwords.length,
        analyzed: validResults.length,
        errors: passwords.length - validResults.length,
        averageScore: Math.round(avgScore * 100) / 100,
        strengthDistribution
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
// Get password generation statistics
router.get('/stats', (req, res) => {
  try {
    res.json({
      success: true,
      statistics: {
        supportedLengths: { min: 4, max: 128 },
   characterSets: {
          uppercase: 26,
          lowercase: 26,
          numbers: 10,
          symbols: 29,
          total: 91
        },
        strengthLevels: ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'],
        recommendations: [
          'Use at least 12 characters',
          'Include uppercase and lowercase letters',
          'Include numbers and symbols',
          'Avoid common words or patterns',
          'Use unique passwords for each account'
		 securityFeatures: [
          'Cryptographically secure random generation',
          'Entropy calculation',
          'Strength analysis with feedback',
          'Character type enforcement',
          'Similar character exclusion option'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});
Changes made 
next line changes
module.exports = router;
