require('dotenv').config({ path: '../../.env' });
const errorMessage = require('../helpers/errorMessages');
const Users = require('../models/userModel');
const Roles = require('../models/roleModel');
const jwt = require('jsonwebtoken');
require('../helpers/passport');

const protect = async (req, res, next) => {
    //1) Getting token and check if its exists or not
    let token;
    // if (req.headers.authorization) {
    //     token = req.headers.authorization;
    // }

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(400).send('You are not logged in! Please log in to get the access');
    }
 
    // 2) Token Verificationz
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    // 3) Check if user exist
    const currentUser = await Users.query().where({ id: decoded.id }).first();
 
    if (!currentUser) {
        res.status(400).send('The user belonging to this token does not exist!');
    }
    // 4) Get User Role detail
    const userRole = await Roles.query().where({ id: currentUser.role_id }).first();
 
 
    req.user = {
        ...currentUser,
        role: userRole.id
    }
 
    //GRANT ACCESS TO PROTECTED ROUTE

    if (req.user.role !== 1) {
        return res.status(403).send(errorMessage.forbidden);
    }
    next();
}

module.exports = protect;