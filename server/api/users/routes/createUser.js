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
function hashPassword(password, cb) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            return cb(err, hash);
        });
    });
}

//Create a new user route
module.exports = {
    method: 'POST',
    path: '/api/users',
    config: {
        auth: false,
        //verify user is unique before passing to handler
        pre: [{ method: verifyUniqueUser }],
        handler: (req, res) => {
            let user = new User();
            user.email = req.payload.email;
            user.username = req.payload.username;
            user.admin = false;

            hashPassword(req.payload.password, (err, hash) => {
                if (err) throw Boom.badRequest(err);

                user.password = hash;
                user.save((err, user) => {
                    if (err) throw Boom.badRequest(err);

                    //if user is saved successfully issue a JWT
                    res({ idToken: createToken(user) }).code(201);
                });
            });
        }
    },
    //validate the payload against the Joi schema
    validate: {
        payload: createUserSchema
    }
}