//http error objects
const Boom = require('boom');

//user model
const User = require('../model/user');

//default createUser schema
const authenticateUserSchema = require('../schemas/authenticateUser');

//unique user verification
const verifyCredentials = require('../util/userFunctions').verifyCredentials;

//access token
const createToken = require('../util/token');

//authenticate a user
module.exports = {
    method: 'POST',
    path: '/api/users/authenticate',
    config: {
        //verify user credentials
        pre: [{ method: verifyCredentials, assign: 'user'}],
        handler: (req, h) => {
            console.log("Creating token")
           return {idToken: createToken(req.pre.user)};
        }
    }
}