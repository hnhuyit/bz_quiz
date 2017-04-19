'use strict';

const QuestionsController = require('./controller/questions.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/questions',
        config: QuestionsController.list
    });
    server.route({
        method: 'GET',
        path: '/question/{id}/view',
        config: QuestionsController.view
    });
    server.route({
        method: 'GET',
        path: '/question/add',
        config: QuestionsController.add,
    });
    server.route({
        method: 'POST',
        path: '/question/create',
        config: QuestionsController.create,

    });
    server.route({
        method: ['GET'],
        path: '/question/{id}/edit',
        config: QuestionsController.edit,
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/question/{id}/update',
        config: QuestionsController.update,

    });
    server.route({
        method: ['GET'],
        path: '/question/{id}',
        config: QuestionsController.delete

    });
    next();
};

exports.register.attributes = {
    name: 'web-question'
};