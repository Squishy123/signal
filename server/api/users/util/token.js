//json web tokens
const jwt = require('jsonwebtoken');

//create an access token for an authenticated user 
function createToken(user) {
    //check if the user is an admin, if so set scope to admin
    let scopes = (user.admin) ? 'admin' : null;
    
    //sign and create a jwt
    return jwt.sign({id: user._id, username: user.username, scope: scopes}, secret, {algorithm: 'HS256', expiresIn: "1h"});
}

module.exports = createToken;