//http error objects
const Boom = require('boom');

//bcrypt 
const bcrypt = require('bcrypt');

//user model
const User = require('../model/user');

//jwt
const jwt = require('jsonwebtoken');

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
async function verifyCredentials(req, h) {
    try {
        let user = await User.findOne({
            $or: [
                { email: req.payload.email },
                { username: req.payload.username }
            ]
        });
        if(!user) 
            return Boom.badRequest('Incorrect username or email!');
            
        let valid = await bcrypt.compare(req.payload.password, user.password);
        
        //return null if the user does not exist or if credentials are wrong
        if (!valid)
            return Boom.badRequest('Incorrect password!');
        //return the user if the user credentials are correct
        return user;
    } catch (err) {
        //return err if something goes wrong
        return Boom.badRequest(err);
    }
}

async function verifyAdmin(req, h) {
    try {
        let decoded = await jwt.verify(req.headers.access_token, process.env.SECRET);
        let user = await User.findOne(decoded._id);

        if(!user) 
            return Boom.badRequest('User does not exist!')
        
        if(user.admin == 'true')
            return true;
        else 
            return false;

    } catch(err) {
        return Boom.badRequest(err);
    }
}

module.exports = {
    verifyUniqueUser: verifyUniqueUser,
    verifyCredentials: verifyCredentials,
    verifyAdmin: verifyAdmin
}