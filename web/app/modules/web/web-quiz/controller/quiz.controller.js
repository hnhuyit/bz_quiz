'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Quiz = mongoose.model('Quiz');
const Subject = mongoose.model('Subject');
const Question = mongoose.model('Question');
const User = mongoose.model('User');
const _ = require('lodash');
exports.list = {
    auth: {
        strategy: 'jwt',
        scope: ['user']
    },
    handler: function(request, reply) {
        let meta = {
            context: 'quiz',
            controller: 'Đề thi',
            action: 'Danh sách đề thi',
            title : 'Danh sách đề thi',
            description: 'Danh sách đề thi',
        };
        reply.view('web/html/web-quiz/list',{meta: meta});
    }
}
exports.listQuizzesByStudent = {
    auth: {
        strategy: 'jwt',
        scope: ['guest']
    },
    handler: function(request, reply) {
        let meta = {
            context: 'quiz',
            controller: 'Danh sách đề thi',
            title : 'Danh sách đề thi',
            description: 'Danh sách đề thi',
        };
        
        let options = {status: 1};
        options.students = { $in: [request.auth.credentials.uid] };
        
        let promiseSubject = Subject.find(options).exec();

        promiseSubject.then(function(subjects) {
            let quizzes = [];

            subjects.forEachEmission(function(subject, index, done){
                let promiseQuiz = Quiz.find({subject_id: subjects[index].id}).populate('subject_id').populate('user_id').exec();
                promiseQuiz.then(function(quiz) {
                    quizzes[index] = quiz;
                    done();
                });
                
            }, function(){
                let q = [];
                    quizzes.forEach(function(qzs){
                        qzs.forEach(function(qz){
                            q.push(qz);
                        })
                    });
                let dataRes = { status: '1', items: q, meta: meta};
                return reply.view('web/html/web-quiz/list-quizzes',dataRes);
            });
        }).catch(function(err) {
            if (err) {
                request.log(['error'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
        });
    }
}
exports.view = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'guest']
    },
    pre: [
        { method: getItem, assign: 'quiz' },
        { method: getUserLogin, assign: 'user' }
    ],
    handler: function(request, reply) {
        let quiz = request.pre.quiz;
        let user = request.pre.user;

        console.log('user', user)
        if (!quiz) {
            return reply(Boom.notFound('quiz is not be found'));
        }
        let meta = {};
            meta = {
            context: 'quiz',
            controller: 'Đề thi',
            action: 'Thông tin đề thi',
            title : 'Thông tin đề thi',
            description: 'Thông tin đề thi',
        };
        return reply.view('web/html/web-quiz/view', { quiz: quiz, user: user,  meta: meta });
    },
}
exports.attempt = {
    // auth: {
    //     strategy: 'jwt',
    // },
    pre: [
        {method: getItem, assign: 'quiz'},
        {method: getUserLogin, assign: 'user'}
    ],
    handler: function(request, reply) {
        let user = request.pre.user;
        let quiz = request.pre.quiz;
        if (!quiz) {
            return reply(Boom.notFound('quiz is not be found'));
        }
        let meta = {};
            meta = {
            context: 'quiz',
            controller: quiz.name,
            action: quiz.name,
            title : quiz.name,
            description: quiz.name,
        };
        return reply.view('web/html/web-quiz/attempt', { user: user, meta: meta });
    },
}
exports.addQuestion = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getItem, assign: 'quiz' }
    ],
    handler: (request, reply) => {
        let quiz = request.pre.quiz;
        if (!quiz) {
            return reply(Boom.notFound('quiz is not be found'));
        }
        let meta = {};
            meta = {
            context: 'quiz',
            controller: 'Đề thi và câu hỏi',
            action: 'Thêm câu hỏi vào đề thi',
            title : 'Thêm câu hỏi vào đề thi',
            description: 'Thêm câu hỏi vào đề thi',
        };

        let subjectPromise = Subject.findById(quiz.subject_id).exec();
        subjectPromise.then(function(subject) {
            let questions = Question.find({
                subject_id  : subject._id, 
                user_id     : request.auth.credentials.uid
            }).exec();
               
            return questions;
        }).then(function(questions){
            let questionsByQuiz = [];
            // console.log(quiz.question_ids);
            // quiz.question_ids.forEach(function(question) {
            //     questionsByQuiz.push(question);
            // });
            let data = { quiz: quiz, questionsByQuiz: questionsByQuiz, questions: questions, meta: meta };
            // console.log(questionsByQuiz);
            return reply.view('web/html/web-quiz/add-question', data);
        }).catch(function(err) {
            request.log(['error'], err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });

    }
}
exports.add = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {

        // console.log(request.auth);
        let meta = {
            context: 'quiz',
            controller: 'Đề thi',
            action: 'Thêm đề thi',
            title : 'Thêm đề thi',
            description: 'Thêm đề thi',
        };

        reply.view('web/html/web-quiz/add', {meta: meta});
    }
}
exports.create = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: (request, reply) => {
        let quiz = new Quiz(request.payload);
            quiz.user_id = request.auth.credentials.uid;

            quiz.start_date = request.payload.range_date.slice(0, 10);
            quiz.end_date = request.payload.range_date.slice(14, 24);
            quiz.estimated_time = request.payload.date + ' ' +  request.payload.time;
            quiz.with_login = request.payload.with_login ? 1 : 0; //1: cho phep thi || 0: Khong cho phep thi
            quiz.view_answer = request.payload.view_answer ? 1 : 0;

        let promise = quiz.save();
        promise.then(function() {
            return reply.redirect('/quizzes');
        }).catch(function(err) {
            return reply.redirect('/error404');
        });
    }
}
exports.edit = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        {method: getItem, assign: 'quiz'}
    ],
    handler: function(request, reply) {
        let quiz = request.pre.quiz;
        // console.log(quiz);
        if(!quiz) {
            return reply(Boom.notFound('quiz is not be found'));
        }
        let meta = {
            controller: 'Đề thi',
            action: 'Sửa đề thi',
            context: 'quiz',
            title : 'Sửa đề thi',
            description : 'Sửa đề thi'
        };


        reply.view('web/html/web-quiz/edit', {meta: meta, quiz: quiz});

    }
}
exports.update = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getItem, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        let quiz = request.pre.quiz;
        
        quiz = _.extend(quiz, request.payload);

        console.log(quiz);
        let promise = quiz.save();
        promise.then(function() {
            return reply.redirect('/quizzes');
        }).catch(function(err) {
            return reply.redirect('/error404');
        });
    }
    // ,
    // validate: {
    //     payload: {
    //     name: Joi.string().required().description('Name'),
    //         desc: Joi.string().allow('').description('Desc'),
    //         slug: Joi.string().allow('').description('Slug'),
    //         status: Joi.number().allow('').description('Status'),
    //         subject_id: Joi.any().allow('').description('Subject'),
    //         created: Joi.date().allow('').description('Created'),
    //         modified: Joi.date().allow('').description('Modified'),
            
    //         __v: Joi.any().optional().description('Version Key'),
    //         _id: Joi.string().required().description('MongoID')
    //     }
    // }
}
exports.delete = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getItem, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        const quiz = request.pre.quiz;
        console.log(quiz);
        quiz.remove((err) => {
            if (err) {
                return reply.redirect('/error404');
            }
            return reply.redirect('/quizzes');
        });
        

    }
}

/**
 * Middleware
 */
function getItem(request, reply) {
    const id = request.params.id;
    let options = {
        _id: id,
        status: 1
    };
    let promise = Quiz.findOne(options).populate(['subject_id', 'group_id', 'user_id', 'question_ids']).exec();
    promise.then(function(quiz) {
        reply(quiz);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
function getUserLogin(request, reply) {
    const id = request.auth.credentials.uid;
    let options = {
        _id: id,
        status: 1
    };
    let promise = User.findOne(options).exec();
    promise.then(function(user) {
        reply(user);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}