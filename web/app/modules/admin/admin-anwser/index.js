'use strict';

const AnwsersController = require('./controller/anwsers.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/anwser',
        config: AnwsersController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/anwser/{id}',
        config: AnwsersController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/anwser/{id}',
        config: AnwsersController.delete

    });
    server.route({
        method: 'POST',
        path: '/anwser',
        config: AnwsersController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/anwser/{id}',
        config: AnwsersController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-anwser'
};
