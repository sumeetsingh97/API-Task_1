const Project = require('../models/projectModel');
const errorMessage = require('../helpers/errorMessages');
const { response, catchFailure } = require('../helpers/logger');

exports.createProject = async (req, res) => {
    const { name, description, deadline, under_user } = req.body;
    try {
        const existingProject = await Project.query().where({ name });
        if(!existingProject) {
            throw new Error(errorMessage.invalidProject);
        }

        const newProject = await Project.query().insert(
            { 
                name,
                description,
                deadline,
                under_user
            }
        );
        return response(200, res, { message: "success", data: newProject });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.getProjectDetails = async (req, res) => {
    const { id } = req.user;
    try {
        const existingProject = await Project.query().where({ under_user: id });
        if(!existingProject) {
            throw new Error(errorMessage.projectDoNotExist);
        } 

        return response(200, res, { message: "success", data: existingProject });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.getAllProjects = async (req, res) => {
    // const { id } = req.user;
    try {
        const existingProject = await Project.query();
        if(!existingProject) {
            throw new Error(errorMessage.noProjects);
        } 

        return response(200, res, { message: "success", data: existingProject });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description, deadline, under_user } = req.body;
    try {
        const existingProject = await Project.query().where({ id: id });
        if(!existingProject) {
            throw new Error(errorMessage.projectDoNotExist);
        }

        const updateProject = {
            name,
            description,
            deadline,
            under_user
        };

        const updatedProject = await Project.query().where({ id: id }).update(updateProject)
        return response(200, res, { message: "success", data: updatedProject });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const existingProject = await Project.query().where({ id: id });
        if(!existingProject) {
            throw new Error(errorMessage.projectDoNotExist);
        }

        await Project.query().deleteById(id);
        return response(200, res, { message: "success", data: null });
    } catch (error) {
        return catchFailure(res, error);
    }
}