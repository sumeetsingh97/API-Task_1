const Roles = require('./../models/roleModel');
const errorMessage = require('../helpers/errorMessages');
const { response, catchFailure } = require('../helpers/logger');

exports.createRole = async (req, res) => {
    const { name } = req.body;
    // if(!name){
    //     res.status(400).send(errorMessage.insufficientData);
    // }

    try {
        const existingRole = await Roles.query().findOne({name});
        if(existingRole) {
            throw new Error(errorMessage.invalidRole);
        }

        const newRole = await Roles.query().insert({ name: name });
        return response(200, res, { message: "success", data: newRole });
    } catch (error) {
        return catchFailure(res, error);
    }
}; 

exports.updateRole = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    try {
        const existingRole = await Roles.query().where({ id: id }).first();
        if(!existingRole)
            throw new Error(errorMessage.whileUpdatingRole);

        const updateRole = {
            name
        };
        
        const updatedRole = await Roles.query().where({ id: id }).update(updateRole);
        return response(200, res, { message: "success", data: updatedRole });;
    } catch(error) {
        return catchFailure(res, error);
    }
};

exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        
        const existingRole = await Roles.query().where({ id: id }).first();
        if(!existingRole)
            throw new Error(errorMessage.whileUpdatingRole);

        await Roles.query().deleteById(id);
        return response(200, res, { message: "success", data: null });
    } catch (error) {
        return catchFailure(res, error);
    }
};