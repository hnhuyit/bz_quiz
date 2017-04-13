'use strict';

const PageController = require('./controller/page.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;
    var cmsprefix = configManager.get('web.context.cmsprefix');

    server.route({
        method: 'GET',
        path: '/page',
        config: PageController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/page/{id}',
        config: PageController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/page/{id}',
        config: PageController.delete

    });
    server.route({
        method: 'POST',
        path: '/page',
        config: PageController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/page/{id}',
        config: PageController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-page'
};