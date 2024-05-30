const Project = require('../models/projectModel');
const errorMessage = require('../helpers/errorMessages');

exports.createProject = async (req, res) => {
    const { name, description, deadline, under_user } = req.body;
    try {
        const existingProject = await Project.query().where({ name });
        if(!existingProject) {
            res.status(400).send(errorMessage.invalidProject);
        }

        const newProject = await Project.query().insert(
            { 
                name,
                description,
                deadline,
                under_user
            }
        );
        res.status(201).json(newProject);
    } catch (error) {
        res.status(501).send(errorMessage.projectCreationIssue);
    }
}

exports.getProjectDetails = async (req, res) => {
    const { id } = req.user;
    try {
        const existingProject = await Project.query().where({ under_user: id });
        if(!existingProject) {
            res.status(400).send(errorMessage.projectDoNotExist);
        } 

        res.status(202).json(existingProject);
    } catch (error) {
        res.status(404).send(errorMessage.projectFetchingErr);
    }
}

exports.getAllProjects = async (req, res) => {
    // const { id } = req.user;
    try {
        const existingProject = await Project.query();
        if(!existingProject) {
            res.status(400).send(errorMessage.noProjects);
        } 

        res.status(202).json(existingProject);
    } catch (error) {
        res.status(404).send(errorMessage.projectsFetchingErr);
    }
}

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description, deadline, under_user } = req.body;
    try {
        const existingProject = await Project.query().where({ id: id });
        if(!existingProject) {
            res.status(400).send(errorMessage.projectDoNotExist);
        }

        const updateProject = {
            name,
            description,
            deadline,
            under_user
        };

        const updatedProject = await Project.query().where({ id: id }).update(updateProject)
        res.status(201).send("Project updated successfully !");
    } catch (error) {
        res.status(404).send(errorMessage.projectUpdationIssue);
    }
}

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const existingProject = await Project.query().where({ id: id });
        if(!existingProject) {
            res.status(400).send(errorMessage.projectDoNotExist);
        }

        await Project.query().deleteById(id);
        res.status(200).send("Project deleted successfully!");
    } catch (error) {
        res.status(400).send(errorMessage.projectDeletionIssue);
    }
}