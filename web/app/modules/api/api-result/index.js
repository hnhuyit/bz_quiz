'use strict';

const ResultsController = require('./controller/results.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/result',
        config: ResultsController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/result/{id}',
        config: ResultsController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/result/{id}',
        config: ResultsController.delete

    });
    server.route({
        method: 'POST',
        path: '/result',
        config: ResultsController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/result/{id}',
        config: ResultsController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-result'
};
