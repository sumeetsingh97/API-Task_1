const express = require('express');
const userRoutes = require('./routes/api');
const authRoutes = require('./routes/admin');
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
require('./helpers/passport');

const app = express();

app.use(express.json());
app.use(passport.initialize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
  
app.use(limiter);
app.use(helmet());
app.use(morgan('tiny'));

app.use('/api/v1', userRoutes);
app.use('/auth/api/v1', authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;