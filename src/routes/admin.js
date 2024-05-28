const express = require('express');
const passport = require('passport');
require('../helpers/passport');
const { login, getAllUsers, getUserById, updateUserById, deleteUser, getProfile, logoutAdmin } = require('../controllers/adminController');

const validator = require('express-joi-validation').createValidator({
    passError: true,
});
const { createRole, updateRole, deleteRole } = require('../controllers/roleController');
const AdminRequestValidator = require('../middlewares/adminRequestValidator');

const protect = require('../middlewares/protectAdmin');

const router = express.Router();


router.post('/login',
    // passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('login')),
    login
);

router.get('/users',
    passport.authenticate('jwt', { session: false }),
    protect,
    getAllUsers
);

router.get('/users/:id',
    passport.authenticate('jwt', { session: false }),
    protect,
    getUserById
);

router.patch('/users/:id/update',
    passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('updateUserById')),
    protect,
    updateUserById
);

router.delete('/users/:id/delete',
    passport.authenticate('jwt', { session: false }),
    protect,
    deleteUser
);

router.get('/users/:id/profile',
    passport.authenticate('jwt', { session: false }),
    protect,
    getProfile
);

router.post('/roles/create',
    passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('createRole')),
    protect,
    createRole
);

router.patch('/roles/:id/update',
    passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('updateRole')),
    protect,
    updateRole
);

router.delete('/roles/:id/delete',
    passport.authenticate('jwt', { session: false }),
    protect,
    deleteRole
);

router.post('/logout',
    passport.authenticate('jwt',  { session: false }),
    protect,
    logoutAdmin
)

module.exports = router;