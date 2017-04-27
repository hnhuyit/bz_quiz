'use strict';

const QuizzesController = require('./controller/quiz.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/quizzes',
        config: QuizzesController.list
    });
    server.route({
        method: 'GET',
        path: '/quizzes/list-quizzes-by-student',
        config: QuizzesController.listQuizzesByStudent
    });
    server.route({
        method: 'GET',
        path: '/quiz/{id}/view',
        config: QuizzesController.view
    });
    server.route({
        method: 'GET',
        path: '/quiz/{id}/attempt',
        config: QuizzesController.attempt
    });
    server.route({
        method: 'GET',
        path: '/quiz/{id}/question/add',
        config: QuizzesController.addQuestion
    });
    server.route({
        method: 'POST',
        path: '/quiz/{id}/question/create',
        config: QuizzesController.createQuestion
    });
    server.route({
        method: 'GET',
        path: '/quiz/add',
        config: QuizzesController.add,
    });
    server.route({
        method: 'POST',
        path: '/quiz',
        config: QuizzesController.create,

    });
    server.route({
        method: ['GET'],
        path: '/quiz/{id}/edit',
        config: QuizzesController.edit,
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/quiz/{id}/edit',
        config: QuizzesController.update,

    });
    server.route({
        method: ['GET'],
        path: '/quiz/{id}',
        config: QuizzesController.delete

    });
    next();
};

exports.register.attributes = {
    name: 'web-quiz'
};