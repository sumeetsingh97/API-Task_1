const { response, catchFailure } = require('../helpers/logger');

const notFound = async (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = async (err, req, res, next) => {
    if(err.error && err.error.isJoi) {
        let errDetail = [];
        let primaryMessage = '';
        if(err.error.details) {
            err.error.details.map((item) => {
                const temp = [];
                temp[item.context.key] = item.message;
                errDetail.push(temp);
                primaryMessage = item.message;
            });
        }
        response(400, res, {
            message: primaryMessage,
            data: errDetail
        });
    } else {
        response(500, res, {
            message: `Error occurred!`,
            data: err
        });
    }
};

module.exports = { notFound, errorHandler };