require('dotenv').config({ path: './../../.env' });
const jwt = require('./../helpers/jwt');
const bcrypt = require('bcrypt');
const Users = require('../models/userModel');
const errorMessage = require('../helpers/errorMessages');

exports.register = async (req, res) => {
    const { name, email, password, role_id } = req.body;
    // if( !(name || email || password || role_id)){
    //     res.status(400).json({ message: errorMessage.insufficientData });
    // }
    
    try {
        const existingUser = await Users.query().findOne({ email });
        if(existingUser)
            return res.status(400).send(errorMessage.emailInUse);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.query().insert({
            name,
            email,
            password: hashedPassword,
            role_id
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).send(errorMessage.registerIssue);
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Users.query().findOne({ email });
        if(!existingUser)
            return res.status(400).send(errorMessage.invalidLogin);

        if(!existingUser.is_active)
            return res.status(400).send(errorMessage.userIsBlocked);
        
        const validUser = await bcrypt.compare(password, existingUser.password);
        if(!validUser) 
            return res.status(400).send(errorMessage.passwordNotMatched);
        
        const token = await jwt.sign(
            { 
                id: existingUser.id,
                role_id: existingUser.role_id 
            });
        res.status(200).json({token});

    } catch (error) {
        res.status(500).send(errorMessage.loginIssue);
    }
}

exports.updateData = async (req, res) => {
    const { name, email, role_id } = req.body;
    const { id } = req.user;
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
        res.status(202).send("Your data updated successfully !");
    } catch(error) {
        res.status(400).send(errorMessage.updationFailed);
    }
}

exports.logout = async (req, res) => {
    // const { id } = req.user;
    try {
        // req.logout();
        res.status(200).send("User Logged out successfully!");
    } catch (error) {
        res.status(400).send(errorMessage.logoutIssue);
    }
}