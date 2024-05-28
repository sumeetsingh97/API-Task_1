require('dotenv').config({ path: '../../.env' });
const bcrypt = require('bcrypt');
const Users = require('../models/userModel');
const jwt = require('./../helpers/jwt');
require('../helpers/passport');
// const jwt = require('jsonwebtoken');
const errorMessage = require('../helpers/errorMessages');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Users.query().findOne({ email });
        if(!existingUser)
            return res.status(400).send(errorMessage.invalidLogin);

        if (existingUser.role_id !== 1)
            return res.status(400).send(errorMessage.forbidden);

        if(!existingUser.is_active)
            return res.status(400).send(errorMessage.userIsBlocked);
        
        const validUser = await bcrypt.compare(password, existingUser.password);
        if(!validUser) 
            return res.status(400).send(errorMessage.passwordNotMatched);
        
        const token = await jwt.sign(
            {
                id: existingUser.id,
                role_id: existingUser.role_id
            }
        );
        res.status(200).json({token});

    } catch (error) {
        res.status(500).send(errorMessage.loginIssue);
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const user = await Users.query().where({is_active: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(errorMessage.noUsers);
    }
}

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.query().findById(id);
        if(user && user.is_active){
            res.status(202).json(user);
        }
    } catch (error) {
        res.status(404).send(errorMessage.userDoNotExist);
    }
}

exports.updateUserById = async (req, res) => {
    const { name, email, role_id } = req.body;
    const { id } = req.params;
    try {
        const existingUser = await Users.query().where({ id: id }).first();
        if(!existingUser)
            res.status(404).send(errorMessage.userDoNotExist);

        const updateUser = {
            name,
            email,
            role_id
        };
        
        await Users.query().where({ id: id }).update(updateUser);
        res.status(202).send("User updated successfully!");
    } catch(error) {
        res.status(400).send(errorMessage.updationFailed);
    }
}

exports.getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.query().findById(id);
        if (!user) {
            return res.status(404).send(errorMessage.noUsers);
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(errorMessage.profileFetchingErr);
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await Users.query().where({ id: id }).first();
        if(!existingUser)
            res.status(404).send(errorMessage.userDoNotExist);

        const user = await Users.query().patchAndFetchById(id, {is_active: false});
        res.status(200).json({ message: "User deleted successfully!", user });
    } catch (error) {
        res.status(400).send(errorMessage.logoutIssue);
    }
}

exports.logoutAdmin = async (req, res) => {
    try {
        // req.logout();
        res.status(200).send("Admin Logged out successfully!");
    } catch (error) {
        res.status(400).send(errorMessage.logoutIssue);
    }
}