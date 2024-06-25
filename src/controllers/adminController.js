require('dotenv').config({ path: '../../.env' });
const bcrypt = require('bcrypt');
const Users = require('../models/userModel');
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
        const user = await Users.query().where({is_active: true});
        return response(200, res, { message: "success", data: user });
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