const Roles = require('./../models/roleModel');
const errorMessage = require('../helpers/errorMessages');

exports.createRole = async (req, res) => {
    const { name } = req.body;
    // if(!name){
    //     res.status(400).send(errorMessage.insufficientData);
    // }

    try {
        const existingRole = await Roles.query().findOne({name});
        if(existingRole) {
            res.status(400).send(errorMessage.invalidRole);
        }

        const newRole = await Roles.query().insert({ name: name });
        res.status(202).json(newRole);
    } catch (error) {
        res.status(501).send(errorMessage.roleCreationIssue);
    }
}; 

exports.updateRole = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    try {
        const existingRole = await Roles.query().where({ id: id }).first();
        if(!existingRole)
            res.status(404).send(errorMessage.whileUpdatingRole);

        const updateRole = {
            name
        };
        
        const updatedRole = await Roles.query().where({ id: id }).update(updateRole);
        res.status(202).send("Role updated successfully !");
    } catch(error) {
        res.status(400).send(errorMessage.roleUpdationIssue);
    }
};

exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        
        const existingRole = await Roles.query().where({ id: id }).first();
        if(!existingRole)
            res.status(404).send(errorMessage.whileUpdatingRole);

        await Roles.query().deleteById(id);
        res.status(200).send("Role deleted successfully !");
    } catch (error) {
        res.status(400).send(errorMessage.roleDeletionIssue);
    }
};