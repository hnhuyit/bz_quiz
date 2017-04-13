'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
global.BASE_PATH = __dirname;
server.register({
    register: require('hapi-kea-config'),
    options: {
        confPath: BASE_PATH + '/app/config',
        decorateServer: true
    }
});

const config = server.plugins['hapi-kea-config'];

let connections = config.get('web.connections');
connections.forEach(function(config) {
    server.connection(config);
}, this);
//registering hapi plugins and bootstrap app
require('./app/bootstrap/bootstrap.js')(server);
//start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    server.log('info', 'Server ENV: ' + process.env.NODE_ENV);
    server.connections.forEach(function (connectionSetting) {
        server.log('info', 'Server running at: ' + connectionSetting.info.uri);
    });
    
});

module.exports = server;