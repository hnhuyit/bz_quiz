'use strict';

const UserController = require('./controller/user.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: ['GET'],
        path: '/user',
        config: UserController.getAll,
    });

    server.route({
        method: ['GET'],
        path: '/user/{id}',
        config: UserController.edit,

    });
    server.route({
        method: ['GET'],
        path: '/user/change-status/{id}/{status}',
        config: UserController.changeStatus

    });
    server.route({
        method: ['DELETE'],
        path: '/user/{id}',
        config: UserController.delete

    });
    server.route({
        method: 'POST',
        path: '/user',
        config: UserController.save,

    });
    server.route({
        method: 'PUT',
        path: '/user/{id}',
        config: UserController.update,

    });

    server.route({
        method: 'PUT',
        path: '/user/moveToTrash',
        config: UserController.moveToTrash,
    });

    server.route({
        method: 'PUT',
        path: '/user/changeStatus',
        config: UserController.changeStatus,
    });

    server.route({
        method: 'PUT',
        path: '/user/changeStatusMultiRows',
        config: UserController.changeStatusMultiRows,
    });

    server.route({
        method: 'PUT',
        path: '/user/deleteMultiRows',
        config: UserController.deleteMultiRows,
    });

    next();
};

exports.register.attributes = {
    name: 'admin-user'
};