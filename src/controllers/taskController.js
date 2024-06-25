const Task = require('../models/taskModel');
const errorMessage = require('../helpers/errorMessages');
const { response, catchFailure } = require('../helpers/logger');

exports.createTask = async (req, res) => {
    const project_id = req.project.id;
    const { title, description, assigned_to, due_date } = req.body;
    try {
        const existingTask = await Task.query().where({ project_id: project_id });
        if(!existingTask) {
            throw new Error(errorMessage.invalidTask);
        }

        const newTask = await Task.query().insert(
            { 
                title,
                description,
                project_id: req.project.id,
                assigned_to,
                due_date
            }
        );
        return response(201, res, { message: "success", data: newTask });
    } catch (error) {
        return catchFailure(res, error);
    }
}


// only admin should do this
exports.createTaskByAdmin = async (req, res) => {
    const {id} = req.params;
    const { title, description, assigned_to, due_date } = req.body;
    try {
        const existingTask = await Task.query().where({ project_id: id });
        if(!existingTask) {
            throw new Error(errorMessage.invalidTask);
        }

        const newTask = await Task.query().insert(
            { 
                title,
                description,
                project_id: id,
                assigned_to,
                due_date
            }
        );
        return response(200, res, { message: "success", data: newTask });
    } catch (error) {
        return catchFailure(res, error);
    }
}


// protectTask middleware wont be used in this
exports.getTaskDetails = async (req, res) => {
    const { id } = req.user;
    try {
        const existingTask = await Task.query().where({ assigned_to: id });
        if(existingTask.length === 0) {
            throw new Error(errorMessage.taskDoNotExist);
        }

        return response(202, res, { message: "success", data: existingTask });
    } catch (error) {
        return catchFailure(res, error);
    }
}


exports.showTasksByProjectId = async (req, res) => {
    const project_id = req.project.id;
    try {
        const existingTask = await Task.query().where({ project_id: project_id });
        if(existingTask.length === 0) {
            throw new Error(errorMessage.noTasks);
        } 

        return response(202, res, { message: "success", data: existingTask });
    } catch (error) {
        return catchFailure(res, error);
    }
}


// only admin should do this
exports.getTasksByProjectId = async (req, res) => {
    const { id } = req.params;
    try {
        const existingTask = await Task.query().where({ project_id: id });
        if(existingTask.length === 0) {
            throw new Error(errorMessage.noTasks);
        } 

        return response(202, res, { message: "success", data: existingTask });
    } catch (error) {
        return catchFailure(res, error);
    }
}

exports.updateTaskDetails = async (req, res) =>{
    const project_id = req.project.id;
    const {id} = req.params;
    const { title, description, assigned_to, status, due_date } = req.body;
    try {
        const existingTask = await Task.query().where({ id: id });
        if(existingTask.length === 0) {
            throw new Error(errorMessage.taskDoNotExist);
        }

        if(existingTask.project_id !== project_id) {
            throw new Error(errorMessage.forbidden)
        }

        const updateTask = {
            title,
            description,
            assigned_to,
            status,
            due_date
        };

        const updatedTask = await Task.query().where({ id: id, project_id: project_id }).update(updateTask)
        return response(200, res, { message: "success", data: updatedTask });
    } catch (error) {
        return catchFailure(res, error);
    }
}


// protectTask middleware wont be used in this
exports.updateTaskByUser = async (req, res) =>{
    const { id } = req.user;
    const { status } = req.body;
    try {
        const existingTask = await Task.query().where({ assigned_to: id });
        if(existingTask.length === 0) {
            throw new Error(errorMessage.taskDoNotExist);
        }

        const updateTask = {
            status
        };

        const updatedTask = await Task.query().where({ assigned_to: id }).update(updateTask)
        if (updatedTask) {
            return response(200, res, { message: "success", data: updatedTask });
        }
    } catch (error) {
        return catchFailure(res, error);
    }
}


exports.deleteTask = async (req, res) => {
    const project_id = req.project.id
    const {id} = req.params;
    try {
        const existingTask = await Task.query().where({ id: id });
        if(existingTask.length === 0) {
            throw new Error(errorMessage.taskDoNotExist);
        }

        if(existingTask.project_id !== project_id) {
            throw new Error(errorMessage.forbidden)
        }

        await Task.query().where({ project_id: project_id }).deleteById(id);
        return response(200, res, { message: "success", data: null });
    } catch (error) {
        return catchFailure(res, error);
    }
}

// only admin should do this
exports.deleteTaskByAdmin = async (req, res) => {
    const {id} = req.params;
    try {
        const existingTask = await Task.query().where({ id: id });
        if(existingTask.length === 0) {
            throw new Error(errorMessage.taskDoNotExist);
        }

        await Task.query().deleteById(id);
        return response(200, res, { message: "success", data: null });
    } catch (error) {
        return catchFailure(res, error);
    }
}