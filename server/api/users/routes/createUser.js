//password hashing
const bcrypt = require('bcrypt');

//http error objects
const Boom = require('boom');

//user model
const User = require('../model/user');

//default createUser schema
const createUserSchema = require('../schemas/createUser');

//unique user verification
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;

//access token
const createToken = require('../util/token');

//Hashes a password with a level 10 salt
async function hashPassword(password) {
    hashed = await new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err)
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    });
    return hashed;
}

//Create a new user route
//req: username: required, email: required, password: required
module.exports = {
    method: 'POST',
    path: '/api/users',
    config: {
        auth: false,
        //verify user is unique before passing to handler
        pre: [{ method: verifyUniqueUser }],
        handler: async (req, h) => {
            let user = new User();
            user.email = req.payload.email;
            user.username = req.payload.username;
            user.scope = 'client';

            try {
                hash = await hashPassword(req.payload.password);
                user.password = hash;
                await user.save();
            } catch (err) {
                return Boom.badRequest(err);
            }
            //if user is saved successfully issue a JWT
            return { id_token: createToken(user) };
        },
        //validate the payload against the Joi schema
        validate: {
            payload: createUserSchema
        }
    }
}