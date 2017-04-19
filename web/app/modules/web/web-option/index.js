'use strict';

const OptionsController = require('./controller/options.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/options',
        config: OptionsController.list
    });
    server.route({
        method: 'GET',
        path: '/option/{id}/view',
        config: OptionsController.view
    });
    server.route({
        method: 'GET',
        path: '/option/add',
        config: OptionsController.add,
    });
    server.route({
        method: 'POST',
        path: '/option',
        config: OptionsController.create,

    });
    server.route({
        method: ['GET'],
        path: '/option/{id}/edit',
        config: OptionsController.edit,
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/option/{id}/edit',
        config: OptionsController.update,

    });
    server.route({
        method: ['GET'],
        path: '/option/{id}',
        config: OptionsController.delete

    });
    next();
};

exports.register.attributes = {
    name: 'web-option'
};