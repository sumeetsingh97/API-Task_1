const errorMessage = require('../helpers/errorMessages');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

const protectTask = async (req, res, next) => {
    
    const id = req.user.id;
    // try {
        
    // } catch (error) {
    //     res.status(400).send("protectTask middleware issue!");
    // }
    const project = await Project.query().where({ under_user: id }).first();
    if(!project) {
        res.status(400).send(errorMessage.noProjectAssigned);
    }
    
    const user = await User.query().where({ id: project.under_user }).first();
    if(!user) {
        res.status(400).send("Issue while retriving project of this task.");
    }  
    
    if((req.user.role !== user.role_id) && (req.user.role !== 1)){
        return res.status(403).send(errorMessage.forbidden);
    }
    req.project = project;
    next();
}

module.exports = protectTask;