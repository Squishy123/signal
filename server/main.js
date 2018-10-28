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
require('dotenv')();


//init server
const server = Hapi.Server({
    host: 'localhost',
    port: 3000
});

//init database
const dbUrl = 'mongodb://localhost:27017/signal';

server.register(require('hapi-auth-jwt'), (err) => {

    //jwt security scheme
    server.auth.strategy('jwt', 'jwt', {
        key: process.env.KEY,
        verifyOptions: { algorithms: ['HS256'] }
    });

    //generate routes in API directory
    glob.sync('api/**/routes/*.js', {
        root: __dirname
    }).forEach((file) => {
        const route = require(path.join(__dirname, file));
        server.route(route);
    });
});

//start server
server.start((err) => {
    if (err) throw err;

    //connect to mongodb
    mongoose.connect(dbUrl, {}, (err)=>{
        if(err) throw err;
    });

    console.log('Server running at:', server.info.uri);
})