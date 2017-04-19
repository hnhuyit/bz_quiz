'use strict';

const GroupsController = require('./controller/group.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/group',
        config: GroupsController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/group/{id}',
        config: GroupsController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/group/{id}',
        config: GroupsController.delete

    });
    server.route({
        method: 'POST',
        path: '/group',
        config: GroupsController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/group/{id}',
        config: GroupsController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-group'
};
