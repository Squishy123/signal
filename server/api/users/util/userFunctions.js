//http error objects
const Boom = require('boom');

//user model
const User = require('../model/user');

//verifies if a user object is unique 
function verifyUniqueUser(req, res) {
    //find an entry in the database that matches either email or username
    User.findOne({
        $or: [
            {email: req.payload.email},
            {username: req.payload.username}
        ]
    }, (err, user) => {
        //if username or email are taken send an error
        if(user)
            if(user.username === req.payload.username)
                res(Boom.badRequest('Username already taken'));
            if(user.email === req.payload.email)
                res(Boom.badRequest('Email already taken'));

        //if user is unique send the payload through the route handler
        res(req.payload);
    });
}

module.exports = {
    verifyUniqueUser: verifyUniqueUser
}