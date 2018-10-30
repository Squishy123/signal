//http error objects
const Boom = require('boom');

//user model
const User = require('../model/user');

const verifyAdmin = require('../util/userFunctions').verifyAdmin;

module.exports = {
    method: 'GET',
    path: '/api/users',
    config: {
        pre: [{method: verifyAdmin, assign: 'admin'}],
        //find all the users, deselect password and version and return it
        handler: async (req, h) => {
        if(req.pre.admin)
            try {
                users = await User.find().select('-password -__v');
                if(!users.length)
                    return Boom.notFound('No users found!');
                
                return users;
            } catch (err) {
                return Boom.badRequest(err);
            }
        else 
            return Boom.badRequest("User not an admin!");
        }
    }
}