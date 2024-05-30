const express = require('express');
const { register, login, updateData, logout} = require('../controllers/userController');
const { getProjectDetails } = require('../controllers/projectController');
const { createTask, getTaskDetails, showTasksByProjectId, updateTaskDetails, updateTaskByUser, deleteTask } = require('../controllers/taskController');
const validator = require('express-joi-validation').createValidator({
    passError: true,
});
const passport = require('passport');
require('../helpers/passport');
const RequestValidator = require('./../middlewares/requestValidator');
const protectUser = require('../middlewares/protectUser');
const protectTask = require('../middlewares/protectTask');
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

router.get('/projects/detail',
    passport.authenticate('jwt', { session: false }),
    protectUser,
    getProjectDetails
);

router.post('/projects/tasks/create',
    validator.body(RequestValidator.Validators('createTask')),
    passport.authenticate('jwt', { session: false }),
    protectUser,
    protectTask,
    createTask
);

router.get('/projects/tasks/detail',
    passport.authenticate('jwt', { session: false }),
    protectUser,
    getTaskDetails
);

router.get('/projects/tasks',
    passport.authenticate('jwt', { session: false }),
    protectUser,
    protectTask,
    showTasksByProjectId
);

router.patch('/projects/tasks/:id/update',
    validator.body(RequestValidator.Validators('updateTaskDetails')),
    passport.authenticate('jwt', { session: false }),
    protectUser,
    protectTask,
    updateTaskDetails
);

router.patch('/projects/tasks/update/user',
    validator.body(RequestValidator.Validators('updateTaskByUser')),
    passport.authenticate('jwt', { session: false }),
    protectUser,
    updateTaskByUser
);

router.delete('/projects/tasks/:id/delete',
    passport.authenticate('jwt', { session: false }),
    protectUser,
    protectTask,
    deleteTask
);

module.exports = router;