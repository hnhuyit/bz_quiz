'use strict';
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Quiz = mongoose.model('Quiz');
const Subject = mongoose.model('Subject');
const _ = require('lodash');


exports.home = {
    handler: function (request, reply) {
    	// console.log('request', request.auth)
        if (request.auth.credentials && request.auth.credentials.uid !== '') {
            let scope = [];
            scope = request.auth.credentials.scope;
            if(scope.includes('guest')) {
                return reply.view('web/html/web-home/index', {scope: 'student'});
            } else {
                // let options = {status: 1};
                // options.user_id = { $in: [request.auth.credentials.uid]};

                // Subject.count(options, function(err, total) {
                //     if (err) {
                //         request.log(['error'], err);
                //         return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                //     }
                //     let data = { status: '1', total: total };
                //     return reply.view('web/html/web-home/index', {scope: 'teacher', data: data});
                // });
                return reply.view('web/html/web-home/index', {scope: 'teacher'});
            }   
        } else {
            Quiz.find({with_login: 1}).populate('user_id').populate('subject_id').exec(function(err, quizzes) {
                if(err) {
                    request.log(['error'], err);
                    return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                }
                // console.log('quizzes', quizzes);
                return reply.view('web/html/web-home/home', {quizzes: quizzes});

            });
        }
    },
}

    