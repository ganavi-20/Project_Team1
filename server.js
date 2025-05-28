const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passwordRoutes = require('./routes/passwordRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
