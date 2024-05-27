const { Model } = require('objection');
const jwt_decode = require('jwt-decode');

class Users extends Model {
    static get tableName(){
        return 'users';
    }

    static getUserByToken(token){
        return jwt_decode(token);
    }
}

module.exports = Users;