const express = require('express');
const { register, login, updateData, logout} = require('../controllers/userController');
const validator = require('express-joi-validation').createValidator({
    passError: true,
});
const passport = require('passport');
require('../helpers/passport');
const RequestValidator = require('./../middlewares/requestValidator');
const protectUser = require('../middlewares/protectUser')

const router = express.Router();

router.post('/register',
    validator.body(RequestValidator.Validators('register')),
    register
);

router.post('/login',
    // passport.authenticate('jwt', { session: false }),
    validator.body(RequestValidator.Validators('login')),
    login
);

router.patch('/users/update',
    passport.authenticate('jwt', { session: false }), 
    validator.body(RequestValidator.Validators('updateData')),
    protectUser, 
    updateData
);

router.post('/logout',
    passport.authenticate('jwt', { session: false }),
    protectUser,
    logout
);

module.exports = router;