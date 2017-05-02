'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Quiz = mongoose.model('Quiz');
const Subject = mongoose.model('Subject');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
// const QuizQuesiton = mongoose.model('QuizQuesiton');
const _ = require('lodash');
const arrays = require('async-arrays').proto();

exports.getAll = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin', 'guest']
    },
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = {status: 1, user_id: request.auth.credentials.uid};

        let {keyword} = request.payload || request.query;
        // if(quiz_id) {
        //     options._id = quiz_id;
        // }
        if (keyword && keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        Quiz.find(options).populate('group_id').populate('user_id').populate('subject_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    },
    description: 'List Quiz',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}
exports.getQuizzesBySubject = {
    auth: {
        strategy: 'jwt',
        scope: ['guest']
    },
    handler: function(request, reply) {
       
        let options = {status: 1};

        let {keyword, subject_id} = request.payload || request.query;
        if(subject_id) {
            options.subject_id = subject_id;
        }
        if (keyword && keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        Quiz.find(options, function(err, items) {
            if (err) {
                request.log(['error'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let dataRes = { status: '1', items: items };
            reply(dataRes);
        });


    }
}
exports.getQuizzesByStudent = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin', 'guest']
    },
    handler: function(request, reply) {
       
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
                let dataRes = { status: '1', items: quizzes };
                return reply(dataRes);
            });
        }).catch(function(err) {
            if (err) {
                request.log(['error'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
        });

    },
    description: 'List Quizzes By Student',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}

exports.edit = {
    auth: {
        strategy: 'jwt',
        scope: ['guest', 'user', 'admin']
    },
    pre: [
        { method: getById, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        const quiz = request.pre.quiz;
        if (quiz) {
            return reply(quiz);
        } else {
            reply(Boom.notFound('Quiz is not found'));
        }
    },
    description: 'Get Quiz',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        params: {
            id: Joi.string().required().description('ID'),
        }
    }
}

exports.save = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        let quiz = new Quiz(request.payload);
        let promise = quiz.save();
        promise.then(function(quiz) {
            reply(quiz);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Quiz',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        name: Joi.string().required().description('Name'),
            description: Joi.string().allow('').description('Description'),
            start_date: Joi.date().allow('').description('Start Date'),
            end_date: Joi.date().allow('').description('End Date'),
            duration: Joi.number().allow('').description('Duration'),
            maximum_attempts: Joi.number().allow('').description('Maximum Attempts'),
            pass_percentage: Joi.number().allow('').description('Pass Percentage'),
            group_id: Joi.any().allow('').description('Group'),
            user_id: Joi.any().allow('').description('User'),
            view_answer: Joi.number().allow('').description('View Answer'),
            with_login: Joi.number().allow('').description('With Login'),
            number_of_question: Joi.number().required().description('Number Of Question'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
        }
    }
}
exports.update = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getById, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        let quiz = request.pre.quiz;
        
        quiz = _.extend(quiz, request.payload);
        let promise = quiz.save();
        promise.then(function(quiz) {
            reply(quiz);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Updated Quiz',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        name: Joi.string().required().description('Name'),
            description: Joi.string().allow('').description('Description'),
            start_date: Joi.date().allow('').description('Start Date'),
            end_date: Joi.date().allow('').description('End Date'),
            duration: Joi.number().allow('').description('Duration'),
            maximum_attempts: Joi.number().allow('').description('Maximum Attempts'),
            pass_percentage: Joi.number().allow('').description('Pass Percentage'),
            group_id: Joi.any().allow('').description('Group'),
            user_id: Joi.any().allow('').description('User'),
            view_answer: Joi.number().allow('').description('View Answer'),
            with_login: Joi.number().allow('').description('With Login'),
            number_of_question: Joi.number().required().description('Number Of Question'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
            __v: Joi.any().optional().description('Version Key'),
            _id: Joi.string().required().description('MongoID')
        }
    }
}
exports.delete = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getById, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        const quiz = request.pre.quiz;
        quiz.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(quiz);
        });
    },
    description: 'Delete Quiz',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        params: {
            id: Joi.string().required().description('ID'),
        }
    }
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Quiz.findOne({ '_id': id }).populate('subject_id').populate('group_id').populate('user_id');
    promise.then(function(quiz) {
        reply(quiz);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
