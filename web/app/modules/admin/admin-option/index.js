'use strict';

const OptionsController = require('./controller/option.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/option',
        config: OptionsController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/option/{id}',
        config: OptionsController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/option/{id}',
        config: OptionsController.delete

    });
    server.route({
        method: 'POST',
        path: '/option',
        config: OptionsController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/option/{id}',
        config: OptionsController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-option'
};
