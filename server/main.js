const Hapi = require('hapi');

//http error objects
const Boom = require('boom');

//file pattern matching
const glob = require('glob');

//file and dir paths
const path = require('path');

//dotenv
require('dotenv').config();

//server conf
const server = Hapi.Server({
    host: 'localhost',
    port: 3000
});

const init = async () => {
    //register all files in server init
    plugins=[]
    glob.sync('init/*.js', {
        cwd: __dirname
    }).forEach((file) => {
        const plugin = require(path.join(__dirname, file));
        console.log(`Loaded: ${file}`)
         plugins.push(plugin);
    });

    await server.register(plugins);

    //start server
    await server.start();
    console.log(`Signal Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

//start the init process
init();