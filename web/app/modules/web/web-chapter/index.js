'use strict';

const ChaptersController = require('./controller/chapters.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/chapters',
        config: ChaptersController.list
    });
    server.route({
        method: 'GET',
        path: '/chapter/{id}/view',
        config: ChaptersController.view
    });
    server.route({
        method: 'GET',
        path: '/chapter/add',
        config: ChaptersController.add,
    });
    server.route({
        method: 'POST',
        path: '/chapter',
        config: ChaptersController.create,

    });
    server.route({
        method: ['GET'],
        path: '/chapter/{id}/edit',
        config: ChaptersController.edit,
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/chapter/{id}/edit',
        config: ChaptersController.update,

    });
    server.route({
        method: ['GET'],
        path: '/chapter/{id}',
        config: ChaptersController.delete

    });
    next();
};

exports.register.attributes = {
    name: 'web-chapter'
};