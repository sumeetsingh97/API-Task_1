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

        case 'updateUserById':
            obj = {
                name: Joi.string().allow(null),
                email: Joi.string().allow(null),
                role_id: Joi.number().allow(null)
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
    }
    return Joi.object(obj);
};