require('dotenv').config({ path: '../../.env' });
const bcrypt = require('bcrypt');
const Users = require('../models/userModel');
const Roles = require('./../models/roleModel');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

const jwt = require('./../helpers/jwt');
const { response, catchFailure } = require('../helpers/logger');
require('../helpers/passport');
// const jwt = require('jsonwebtoken');
const errorMessage = require('../helpers/errorMessages');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Users.query().findOne({ email });
        if(!existingUser)
            throw new Error(errorMessage.invalidLogin);

        if (existingUser.role_id !== 1)
            throw new Error(errorMessage.forbidden);

        if(!existingUser.is_active)
            throw new Error(errorMessage.userIsBlocked);
        
        const validUser = await bcrypt.compare(password, existingUser.password);
        if(!validUser) 
            throw new Error(errorMessage.passwordNotMatched);
        
        const token = await jwt.sign(
            {
                id: existingUser.id,
                role_id: existingUser.role_id
            }
        );
        return response(200, res, { message: "success", data: token });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 8;
        
        if (page < 1) page = 1;
        let offset = (page - 1) * limit;
        const user = await Users.query()
        .select(
            'users.id as user_id',
            'users.name as user_name',
            'users.email as user_email',
            'users.is_active as user_is_active',
            'roles.name as role_name',
            'projects.id as project_id',
            'projects.name as project_name',
            'projects.deadline as project_deadline',
            'tasks.id as task_id',
            'tasks.title as task_title',
            'tasks.status as task_status',
            'tasks.due_date as task_due_date'
        )
        .leftJoin(`roles`, `users.role_id`, `roles.id`)
        .leftJoin(`projects`, `users.id`, `projects.under_user`)
        .leftJoin(`tasks`, `users.id`, `tasks.assigned_to`)
        .leftJoin(`tasks as user_tasks`, `projects.id`, `user_tasks.project_id`)
        .where({is_active: true})
        .offset(offset)
        .limit(limit).orderBy(`users.id`);
        const total = await Users.query().resultSize();
        return response(200, res, { message: "success", data: { user: user, page: page, limit: limit,  total: total } });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.query().findById(id);
        if(user && user.is_active){
            return response(200, res, { message: "success", data: user });
        }
    } catch (error) {
        return catchFailure(res, error);
    }
}

// CHECK THIS as admin should only update itself not the other users
exports.updateAdminData = async (req, res) => {
    const { name, email } = req.body;
    const { id } = req.user;
    try {
        const existingUser = await Users.query().where({ id: id }).first();
        if(!existingUser)
            throw new Error(errorMessage.adminDoNotExist);

        const updateUser = {
            name,
            email
        };
        
        await Users.query().where({ id: id }).update(updateUser);
        return response(200, res, { message: "success", data: null });
    } catch(error) {
        return catchFailure(res, error);
    }
}

exports.getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new Error(errorMessage.noUsers);
        }
        return response(200, res, { message: "success", data: user });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await Users.query().where({ id: id }).first();
        if(!existingUser)
            throw new Error(errorMessage.userDoNotExist);

        const user = await Users.query().patchAndFetchById(id, {is_active: false});
        return response(200, res, { message: "success", data: user });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.logoutAdmin = async (req, res) => {
    try {
        // req.logout();
        return response(200, res, { message: "success", data: null });
    } catch (error) {
        return catchFailure(res, error);
    }
}