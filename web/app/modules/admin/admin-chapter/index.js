'use strict';

const ChaptersController = require('./controller/chapter.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/chapter',
        config: ChaptersController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/chapter/{id}',
        config: ChaptersController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/chapter/{id}',
        config: ChaptersController.delete

    });
    server.route({
        method: 'POST',
        path: '/chapter',
        config: ChaptersController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/chapter/{id}',
        config: ChaptersController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-chapter'
};
