const Hapi = require('hapi');

//init server
const server = Hapi.Server({
    host: 'localhost',
    port: 3000
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, h) {
        return "Server is online!"
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
})