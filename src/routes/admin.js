const express = require('express');
const passport = require('passport');
require('../helpers/passport');
const { login, getAllUsers, getUserById, deleteUser, getProfile, logoutAdmin, updateAdminData } = require('../controllers/adminController');
const { createProject, getAllProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { createTaskByAdmin, getTasksByProjectId, deleteTaskByAdmin } = require('../controllers/taskController');
const validator = require('express-joi-validation').createValidator({
    passError: true,
});
const { createRole, updateRole, deleteRole } = require('../controllers/roleController');
const AdminRequestValidator = require('../middlewares/adminRequestValidator');

const protect = require('../middlewares/protectAdmin');
// const protectTask = require('../middlewares/protectTask');
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

router.patch('/admin/update',
    passport.authenticate('jwt', { session: false }),
    validator.body(AdminRequestValidator.Validators('updateAdminData')),
    protect,
    updateAdminData
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
);

router.post('/projects/create',
    passport.authenticate('jwt', { session: false }),
    protect,
    createProject
);

router.get('/projects',
    passport.authenticate('jwt', { session: false }),
    protect,
    getAllProjects
);

router.patch('/projects/:id/update',
    passport.authenticate('jwt', { session: false }),
    protect,
    updateProject
);

router.delete('/projects/:id/delete',
    passport.authenticate('jwt', { session: false }),
    protect,
    deleteProject
);

router.post('/projects/:id/tasks/create',
    validator.body(AdminRequestValidator.Validators('createTaskByAdmin')),
    passport.authenticate('jwt', { session: false }),
    protect,
    createTaskByAdmin
);

router.get('/projects/:id/tasks',
    passport.authenticate('jwt', { session: false }),
    protect,
    getTasksByProjectId
);

router.delete('/projects/tasks/:id/delete',
    passport.authenticate('jwt', { session: false }),
    protect,
    deleteTaskByAdmin
);

module.exports = router;