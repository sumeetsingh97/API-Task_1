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

    }
    return Joi.object(obj);
};