'use strict';

const QuizQuestionController = require('./controller/quiz-question.controller.js');

exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/quiz-question',
        config: QuizQuestionController.getAll,
    });
    server.route({
        method: 'POST',
        path: '/quiz-question',
        config: QuizQuestionController.save,

    });
    // server.route({
    //     method: ['PUT', 'POST'],
    //     path: '/quiz-question/{id}',
    //     config: QuizQuestionController.update,

    // });
    next();
};

exports.register.attributes = {
    name: 'admin-quiz-question'
};
