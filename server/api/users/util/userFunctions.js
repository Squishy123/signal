//http error objects
const Boom = require('boom');

//user model
const User = require('../model/user');

//verifies if a user object is unique 
async function verifyUniqueUser(req, h) {
    try {
        //find an entry in the database that matches either email or username
        let user = await User.findOne({
            $or: [
                { email: req.payload.email },
                { username: req.payload.username }
            ]
        });
        //if username or email are taken send an error
        if (user) {
            if (user.username === req.payload.username)
                return Boom.badRequest('Username already taken');
            if (user.email === req.payload.email)
                return Boom.badRequest('Email already taken');
        }
        //if user is unique send the payload through the route handler
        return req.payload;
    } catch (err) {
        return err;
    }
}

//check if a user's credentials are correct
async function validateUserCreds(user) {
    try {
        let userQuery = await User.findOne({
            $and: [
                { email: user.email },
                { username: user.username },
                { password: user.password }
            ]
        });
        //return null if the user does not exist or if credentials are wrong
        if (!userQuery)
            return null;
        //return the user if the user credentials are correct
        else
            return user;
    } catch (err) {
        //return err if something goes wrong
        return err;
    }
}

module.exports = {
    verifyUniqueUser: verifyUniqueUser,
    validateUserCreds: validateUserCreds
}