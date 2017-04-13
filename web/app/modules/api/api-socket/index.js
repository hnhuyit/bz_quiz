'use strict';

const SocketController = require('./controller/socket.controller.js');

exports.register = function (server, options, next) {

    var configManager = server.configManager;

    const ws = require('./util/ws.js');
    ws.listen(server);
    server.expose('ws', ws);

     server.route({
        method: 'GET',
        path: '/message',
        config: SocketController.getAllMessage
    });
    server.route({
        method: 'GET',
        path: '/rooms/{roomId}/join',
        config: SocketController.joinRoom
    });
    server.route({
        method: 'GET',
        path: '/rooms/{roomId}/leave',
        config: SocketController.leaveRoom
    });

    next();
};

exports.register.attributes = {
    name: 'api-socket',
    dependencies: 'hapi-io'
};
