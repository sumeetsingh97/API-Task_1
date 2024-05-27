const express = require('express');
const userRoutes = require('./routes/api');
const authRoutes = require('./routes/admin');
const passport = require('passport');
require('./helpers/passport');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api/v1', userRoutes);
app.use('/auth/api/v1', authRoutes);

module.exports = app;