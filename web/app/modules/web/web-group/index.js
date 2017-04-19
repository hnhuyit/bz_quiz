'use strict';

const GroupsController = require('./controller/group.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/groups',
        config: GroupsController.list
    });
    server.route({
        method: 'GET',
        path: '/group/{id}/view',
        config: GroupsController.view
    });
    server.route({
        method: 'GET',
        path: '/group/add',
        config: GroupsController.add,
    });
    server.route({
        method: 'POST',
        path: '/group',
        config: GroupsController.create,

    });
    server.route({
        method: ['GET'],
        path: '/group/{id}/edit',
        config: GroupsController.edit,
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/group/{id}/edit',
        config: GroupsController.update,

    });
    server.route({
        method: ['GET'],
        path: '/group/{id}',
        config: GroupsController.delete

    });
    next();
};

exports.register.attributes = {
    name: 'web-group'
};