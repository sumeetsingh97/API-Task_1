const Task = require('../models/taskModel');
const errorMessage = require('../helpers/errorMessages');

exports.createTask = async (req, res) => {
    const project_id = req.project.id;
    const { title, description, assigned_to, due_date } = req.body;
    try {
        const existingTask = await Task.query().where({ project_id: project_id });
        if(!existingTask) {
            res.status(400).send(errorMessage.invalidTask);
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
        res.status(201).json(newTask);
    } catch (error) {
        res.status(501).send(errorMessage.taskCreationIssue);
    }
}


// only admin should do this
exports.createTaskByAdmin = async (req, res) => {
    const {id} = req.params;
    const { title, description, assigned_to, due_date } = req.body;
    try {
        const existingTask = await Task.query().where({ project_id: id });
        if(!existingTask) {
            res.status(400).send(errorMessage.invalidTask);
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
        res.status(201).json(newTask);
    } catch (error) {
        res.status(501).send(errorMessage.taskCreationIssue);
    }
}


// protectTask middleware wont be used in this
exports.getTaskDetails = async (req, res) => {
    const { id } = req.user;
    try {
        const existingTask = await Task.query().where({ assigned_to: id });
        if(existingTask.length === 0) {
            res.status(400).send(errorMessage.taskDoNotExist);
        }

        return res.status(202).json(existingTask);
    } catch (error) {
        res.status(404).send(errorMessage.taskFetchingErr);
    }
}


exports.showTasksByProjectId = async (req, res) => {
    const project_id = req.project.id;
    try {
        const existingTask = await Task.query().where({ project_id: project_id });
        if(existingTask.length === 0) {
            res.status(400).send(errorMessage.noTasks);
        } 

        res.status(202).json(existingTask);
    } catch (error) {
        res.status(404).send(errorMessage.taskFetchingErr);
    }
}


// only admin should do this
exports.getTasksByProjectId = async (req, res) => {
    const { id } = req.params;
    try {
        const existingTask = await Task.query().where({ project_id: id });
        if(existingTask.length === 0) {
            res.status(400).send(errorMessage.noTasks);
        } 

        res.status(202).json(existingTask);
    } catch (error) {
        res.status(404).send(errorMessage.taskFetchingErr);
    }
}

exports.updateTaskDetails = async (req, res) =>{
    const project_id = req.project.id;
    const {id} = req.params;
    const { title, description, assigned_to, status, due_date } = req.body;
    try {
        const existingTask = await Task.query().where({ id: id });
        if(existingTask.length === 0) {
            res.status(400).send(errorMessage.taskDoNotExist);
        }

        if(existingTask.project_id !== project_id) {
            res.status(404).send(errorMessage.forbidden)
        }

        const updateTask = {
            title,
            description,
            assigned_to,
            status,
            due_date
        };

        const updatedTask = await Task.query().where({ id: id, project_id: project_id }).update(updateTask)
        res.status(201).send("Task details updated successfully !");
    } catch (error) {
        res.status(404).send(errorMessage.taskUpdationIssue);
    }
}


// protectTask middleware wont be used in this
exports.updateTaskByUser = async (req, res) =>{
    const { id } = req.user;
    const { status } = req.body;
    try {
        const existingTask = await Task.query().where({ assigned_to: id });
        if(existingTask.length === 0) {
            res.status(400).send(errorMessage.taskDoNotExist);
        }

        const updateTask = {
            status
        };

        const updatedTask = await Task.query().where({ assigned_to: id }).update(updateTask)
        if (updatedTask) {
            res.status(201).send("Task status updated successfully !");
        }
    } catch (error) {
        res.status(404).send(errorMessage.taskUpdationIssue);
    }
}


exports.deleteTask = async (req, res) => {
    const project_id = req.project.id
    const {id} = req.params;
    try {
        const existingTask = await Task.query().where({ id: id });
        if(existingTask.length === 0) {
            res.status(400).send(errorMessage.taskDoNotExist);
        }

        if(existingTask.project_id !== project_id) {
            res.status(404).send(errorMessage.forbidden)
        }

        await Task.query().where({ project_id: project_id }).deleteById(id);
        res.status(200).send("Task deleted successfully!");
    } catch (error) {
        res.status(400).send(errorMessage.taskDeletionIssue);
    }
}

// admin
exports.deleteTaskByAdmin = async (req, res) => {
    const {id} = req.params;
    try {
        const existingTask = await Task.query().where({ id: id });
        if(existingTask.length === 0) {
            res.status(400).send(errorMessage.taskDoNotExist);
        }

        await Task.query().deleteById(id);
        res.status(200).send("Task deleted successfully!");
    } catch (error) {
        res.status(400).send(errorMessage.taskDeletionIssue);
    }
}