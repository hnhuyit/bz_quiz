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
    next();
};

exports.register.attributes = {
    name: 'admin-quiz-question'
};
