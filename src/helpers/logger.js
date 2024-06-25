const { createLogger, transports } = require('winston');

const log = createLogger ({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'src/logs/system.log'})
    ]
});
exports.log = log;

exports.response = (code, res, { message, data = {} }) => {
    const resModel = {
        meta: {
            message: message ? message : "",
            code: code ? code : 200 
        },
        data: data ? data : {}
    };
    return res.status(code ? code : 200).json(resModel);
};

exports.catchFailure = (res, error) => {
    const resModel = {
        meta: {
            message: error.message,
            code: 400
        },
        data: error
    };
    log.error(error.message, 'error');
    return res.status(400).send(resModel);
};