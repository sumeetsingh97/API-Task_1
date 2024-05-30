const Joi = require('joi');

module.exports.Validators = (method) => {
    var obj = [];
    switch (method) {
        case 'register':
            obj = {
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                role_id: Joi.number().required()
            };
            break;

        case 'login':
            obj = {
                email: Joi.string().required(),
                password: Joi.string().required()
            };
            break; 

        case 'updateData':
            obj = {
                name: Joi.string().allow(null),
                email: Joi.string().allow(null),
                role_id: Joi.number().allow(null)
            };
            break;  

        case 'createTask':
            obj = {
                title: Joi.string().required(),
                description: Joi.string().required(),
                assigned_to: Joi.number().required(),
                due_date: Joi.date().required()
            };
            break;

        case 'updateTaskDetails':
            obj = {
                title: Joi.string().allow(null),
                description: Joi.string().allow(null),
                assigned_to: Joi.number().allow(null),
                status: Joi.string().allow(null),
                due_date: Joi.date().allow(null)
            };
            break;

        case 'updateTaskByUser':
            obj = {
                status: Joi.string().allow(null),
            };
            break;
    }
    return Joi.object(obj);
};