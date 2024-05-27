const express = require('express');
const passport = require('passport');
require('../helpers/passport');
const { login, logoutUser, getAllUsers, getUserById, updateUserById, deleteUser, getProfile, logoutAdmin } = require('../controllers/adminController');

const validator = require('express-joi-validation').createValidator({
    passError: true,
});
const { createRole, updateRole, deleteRole } = require('../controllers/roleController');
const AdminRequestValidator = require('../middlewares/adminRequestValidator');
// const {authenticateJWT} = require('../middlewares/authMiddleware');

const protect = require('../middlewares/protectAdmin');
// const checkRole = require('../middlewares/checkRole');

const router = express.Router();


router.post('/login',
    // passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('login')),
    // protect,
    // checkRole,
    login
);

router.post('users/logout/:id',
    passport.authenticate('jwt', { session: false }),
    protect,
    // checkRole,
    logoutUser
);

router.get('/users',
    passport.authenticate('jwt', { session: false }),
    protect,
    // checkRole,
    getAllUsers
);

router.get('/users/:id',
    passport.authenticate('jwt', { session: false }),
    protect,
    // checkRole,
    getUserById
);

router.patch('/users/:id/update',
    passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('updateUserById')),
    protect,
    // checkRole,
    updateUserById
);

router.delete('/users/:id/delete',
    passport.authenticate('jwt', { session: false }),
    protect,
    // checkRole,
    deleteUser
);

router.get('/users/:id/profile',
    passport.authenticate('jwt', { session: false }),
    protect,
    // checkRole,
    getProfile
);

router.post('/roles/create',
    passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('createRole')),
    protect,
    // checkRole,
    createRole
);

router.patch('/roles/:id/update',
    passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('updateRole')),
    protect,
    // checkRole,
    updateRole
);

router.delete('/roles/:id/delete',
    passport.authenticate('jwt', { session: false }),
    protect,
    // checkRole,
    deleteRole
);

router.post('/logout',
    passport.authenticate('jwt', { session: false }),
    protect,
    // checkRole,
    logoutAdmin
)

module.exports = router;