const Hapi = require('hapi');

//http error objects
const Boom = require('boom');

//mongodb connector
const mongoose = require('mongoose');

//file pattern matching
const glob = require('glob');

//file and dir paths
const path = require('path');

//dotenv
require('dotenv').config();

//init database
const dbUrl = 'mongodb://localhost:27017/signal';

//init process
async function init() {
    //init server
    const server = Hapi.Server({
        host: 'localhost',
        port: 3000
    });

    //register jwt-auth plugin
    await server.register(require('hapi-auth-jwt'));

    //jwt security scheme
    server.auth.strategy('jwt', 'jwt',
    {
        key: process.env.KEY,
        verifyOptions: { algorithms: ['HS256'] }
    });

    //generate routes in API directory
    glob.sync('api/**/routes/*.js', {
        cwd: __dirname
    }).forEach((file) => {
        const route = require(path.join(__dirname, file));
        server.route(route);
    });

    //start the server
    await server.start();

    //connect to mongodb
    await mongoose.connect(dbUrl);

    return server;
}

//start the init process
init().then(server => {
    console.log(`Signal Server running at: ${server.info.uri}`);
})
.catch(err => {
    console.log(err);
})
