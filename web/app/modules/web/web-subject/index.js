'use strict';

const SubjectsController = require('./controller/subjects.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/subjects',
        config: SubjectsController.list
    });
    server.route({
        method: 'GET',
        path: '/subject/{id}/view',
        config: SubjectsController.view
    });
    server.route({
        method: 'GET',
        path: '/subject/add',
        config: SubjectsController.add,
    });
    server.route({
        method: 'POST',
        path: '/subject',
        config: SubjectsController.create,

    });
    server.route({
        method: ['GET'],
        path: '/subject/{id}/edit',
        config: SubjectsController.edit,
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/subject/{id}/edit',
        config: SubjectsController.update,

    });
    server.route({
        method: ['GET'],
        path: '/subject/{id}',
        config: SubjectsController.delete

    });
    next();
};

exports.register.attributes = {
    name: 'web-subject'
};