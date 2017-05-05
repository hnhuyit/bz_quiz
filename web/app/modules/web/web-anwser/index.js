'use strict';

const AnwsersController = require('./controller/anwsers.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/anwsers',
        config: AnwsersController.list
    });
    server.route({
        method: 'GET',
        path: '/anwser/{_id}',
        config: AnwsersController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-anwser'
};