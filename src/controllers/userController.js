require('dotenv').config({ path: './../../.env' });
const jwt = require('./../helpers/jwt');
const bcrypt = require('bcrypt');
const Users = require('../models/userModel');
const errorMessage = require('../helpers/errorMessages');
const { response, catchFailure } = require('../helpers/logger');

exports.register = async (req, res) => {
    const { name, email, password, role_id } = req.body;
    // if( !(name || email || password || role_id)){
    //     res.status(400).json({ message: errorMessage.insufficientData });
    // }
    
    try {
        const existingUser = await Users.query().findOne({ email });
        if(existingUser)
            throw new Error(errorMessage.emailInUse);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.query().insert({
            name,
            email,
            password: hashedPassword,
            role_id
        });
        return response(200, res, { message: "success", data: newUser });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Users.query().findOne({ email });
        if(!existingUser)
            throw new Error(errorMessage.invalidLogin);

        if(!existingUser.is_active)
            throw new Error(errorMessage.userIsBlocked);
        
        const validUser = await bcrypt.compare(password, existingUser.password);
        if(!validUser) 
            throw new Error(errorMessage.passwordNotMatched);
        
        const token = await jwt.sign(
            { 
                id: existingUser.id,
                role_id: existingUser.role_id 
            });
        return response(200, res, { message: "success", data: token });

    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.updateData = async (req, res) => {
    const { name, email, role_id } = req.body;
    const { id } = req.user;
    try {
        const existingUser = await Users.query().where({ id: id }).first();
        if(!existingUser)
            throw new Error(errorMessage.userDoNotExist);

        const updateUser = {
            name,
            email,
            role_id
        };
        
        const updatedUser = await Users.query().where({ id: id }).update(updateUser);
        return response(200, res, { message: "success", data: updatedUser });
    } catch(error) {
        return catchFailure(res, error);
    }
}

exports.logout = async (req, res) => {
    // const { id } = req.user;
    try {
        // req.logout();
        return response(200, res, { message: "success", data: null });
    } catch (error) {
        return catchFailure(res, error);
    }
}