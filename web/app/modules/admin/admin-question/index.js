'use strict';

const QuestionsController = require('./controller/question.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/question',
        config: QuestionsController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/question/{id}',
        config: QuestionsController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/question/{id}',
        config: QuestionsController.delete

    });
    server.route({
        method: 'POST',
        path: '/question',
        config: QuestionsController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/question/{id}',
        config: QuestionsController.update,

    });
    server.route({
        method: ['GET'],
        path: '/question/change-status/{id}/{status}',
        config: QuestionsController.changeStatus

    });
    server.route({
        method: 'PUT',
        path: '/question/changeStatus',
        config: QuestionsController.changeStatus,
    });
    next();
};

exports.register.attributes = {
    name: 'admin-question'
};
