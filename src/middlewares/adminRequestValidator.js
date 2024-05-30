const Joi = require('joi');

module.exports.Validators = (method) => {
    var obj = [];
    switch (method) {
        case 'login':
            obj = {
                email: Joi.string().required(),
                password: Joi.string().required()
            };
            break;

        case 'updateAdminData':
            obj = {
                name: Joi.string().allow(null),
                email: Joi.string().allow(null)
            };
            break;   

        case 'createRole':
            obj = {
                name: Joi.string().required(),
            };
            break;  
            
        case 'updateRole':
            obj = {
                name: Joi.string().allow(null),
            };
            break; 
            
        case 'createProject':
            obj = {
                name: Joi.string().required(),
                description: Joi.string().required(),
                deadline: Joi.date().required(),
                under_user: Joi.number().required()
            };
            break;

        case 'updateProject':
            obj = {
                name: Joi.string().allow(null),
                description: Joi.string().allow(null),
                deadline: Joi.date().allow(null),
                under_user: Joi.number().allow(null)
            };
            break;

        case 'createTaskByAdmin':
            obj = {
                title: Joi.string().required(),
                description: Joi.string().required(),
                assigned_to: Joi.number().required(),
                due_date: Joi.date().required()
            };
            break;
    }
    return Joi.object(obj);
};