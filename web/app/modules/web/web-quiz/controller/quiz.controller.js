'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Quiz = mongoose.model('Quiz');
const Subject = mongoose.model('Subject');
const Question = mongoose.model('Question');
const QuizQuestion = mongoose.model('QuizQuestion');
const _ = require('lodash');
exports.list = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        let meta = {
            context: 'quiz',
            controller: 'Đề thi',
            action: 'Danh sách đề thi',
            title : 'Danh sách đề thi',
            description: 'Danh sách đề thi',
        };
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = {};
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        options = {
            user_id: request.auth.credentials.uid,
            status: 1,
        };
        Quiz.find(options).populate('subject_id').populate('group_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta };
            reply.view('web/html/web-quiz/list',dataRes);
        });


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
                let promiseQuiz = Quiz.find({subject_id: subjects[index].id}).exec();
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
        scope: ['user', 'admin']
    },
    pre: [
        { method: getItem, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        let quiz = request.pre.quiz;
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

        let qqPromise = QuizQuestion.find({quiz_id: request.params.id, user_id: request.auth.credentials.uid}).populate('question_id').exec();

        qqPromise.then(qq => {
            console.log(qq.question_id);
            let questions = [];
            for(let i=0; i<qq.length; i++) {
                questions[i] = qq[i].question_id;
            }
            console.log(questions);
            return reply.view('web/html/web-quiz/view', { quiz: quiz, questionsByQuiz: questions,  meta: meta });
        });

        //return reply.view('web/html/web-quiz/view', { quiz: quiz, meta: meta });
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
            // console.log(subject);
            let questionPromise = Question.find({subject_id: subject._id, user_id: request.auth.credentials.uid}).exec();
                ///Lay nhung cau hoi thuoc mon hoc do: questions
                questionPromise.then(questions => {
                    //Lay danh sach cac cau hoi da duoc them vao de thi
                    //let qqPromise = QuizQuestion.find({quiz_id: request.params.id, user_id: request.auth.credentials.uid}).exec();

                    // console.log('questions', questions);
                    // qqPromise.then(qq => {
                    //     console.log('qq', qq);
                    //     let qIdsByQuiz = [];
                    //     for(let i=0; i<questions.length; i++) {
                    //         qIdsByQuiz[i] = questions[i]._id;
                    //     }

                    //     console.log('qIdsByQuiz', qIdsByQuiz);

                    //     let qIdsByQQ = [];
                    //     for(let i=0; i<qq.length; i++) {

                    //         qIdsByQQ[i] = qq[i].question_id;
                    //         // if(qIds.includes(qq[i].question_id)) {

                    //         // }
                    //     }
                    //     console.log('qIdsByQQ', qIdsByQQ);

                    //     for(let i=0; i<qIdsByQQ.length; i++) {
                    //         if(qIdsByQuiz.includes(qIdsByQQ[i])) {
                    //             return reply.view('web/html/web-quiz/add-question', { quiz: quiz, status: 1, questions: questions, meta: meta });
                    //         } else {
                    //             return reply.view('web/html/web-quiz/add-question', { quiz: quiz, status: 0, questions: questions, meta: meta });
                    //         }
                    //     }
                    //     reply.view('web/html/web-quiz/add-question', { quiz: quiz, status: 1, questions: questions, meta: meta });
                        
                    // });
                    reply.view('web/html/web-quiz/add-question', { quiz: quiz, questions: questions, meta: meta });
                });
        }).catch(function(err) {
            request.log(['error'], err);
            return reply(err);
        });

    }
}
exports.createQuestion = {
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
        let qq = new QuizQuestion();
            qq.question_id = [];
            qq.question_id = [request.payload.question_id];
            qq.quiz_id     = quiz.id;
            qq.user_id     =  request.auth.credentials.uid;

            console.log(qq);
        
        let promiseQQ = qq.save();
        promiseQQ.then(function(qq) {
            return reply.redirect('quiz/'+ qq.quiz_id +'/view');
        })

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
            controller: 'Quiz',
            action: 'Add Quiz',
            title : 'Add Quiz',
            description: 'Add Quiz',
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

            quiz.start_date = request.payload.date.slice(0, 10);
            quiz.end_date = request.payload.date.slice(14, 24);

            console.log(quiz);

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
    let promise = Quiz.findOne(options).exec();
    promise.then(function(quiz) {
        reply(quiz);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}