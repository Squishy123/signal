//http error objects
const Boom = require('boom');

//default createUser schema
const authenticateUserSchema = require('../schemas/authenticateUser');

//unique user verification
const verifyCredentials = require('../util/userFunctions').verifyCredentials;

//access token
const createToken = require('../util/token');

//authenticate a user
//reqs: username: required, email: required, password: required
module.exports = {
    method: 'POST',
    path: '/api/users/authenticate',
    config: {
        //verify user credentials
        pre: [{ method: verifyCredentials, assign: 'user'}],
        handler: (req, h) => {
            console.log("Creating token")
           return {id_token: createToken(req.pre.user)};
        }
    }
}