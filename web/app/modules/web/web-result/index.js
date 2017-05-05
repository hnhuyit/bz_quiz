'use strict';

const ResultsController = require('./controller/results.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/results',
        config: ResultsController.list
    });
    server.route({
        method: 'GET',
        path: '/result/{_id}',
        config: ResultsController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-result'
};