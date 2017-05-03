'use strict';

const QuizzesController = require('./controller/quiz.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/quiz',
        config: QuizzesController.getAll,
    });
    server.route({
        method: 'GET',
        path: '/quiz/get-quizzes-by-subject',
        config: QuizzesController.getQuizzesBySubject,
    });
    server.route({
        method: 'GET',
        path: '/quiz/get-quizzes-by-student',
        config: QuizzesController.getQuizzesByStudent,
    });
    server.route({
        method: 'GET',
        path: '/quiz/get-quizzes-by-no-login',
        config: QuizzesController.getQuizzesByNoLogin,
    });
    server.route({
        method: ['GET'],
        path: '/quiz/{id}',
        config: QuizzesController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/quiz/{id}',
        config: QuizzesController.delete

    });
    server.route({
        method: 'POST',
        path: '/quiz',
        config: QuizzesController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/quiz/{id}',
        config: QuizzesController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-quiz'
};

