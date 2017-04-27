'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const QuizQuestion = mongoose.model('QuizQuestion');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
exports.getAll = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = {status: 1, user_id: request.auth.credentials.uid};

        QuizQuestion.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    },
    description: 'List Questions Belong Quiz',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}
// exports.edit = {
//     pre: [
//         { method: getById, assign: 'quiz' }
//     ],
//     handler: function(request, reply) {
//         const quiz = request.pre.quiz;
//         if (quiz) {
//             return reply(quiz);
//         } else {
//             reply(Boom.notFound('Quiz is not found'));
//         }
//     },
//     description: 'Get Quiz',
//     tags: ['api'],
//     plugins: {
//         'hapi-swagger': {
//             responses: { '400': { 'description': 'Bad Request' } },
//             payloadType: 'form'
//         }
//     },
//     validate: {
//         params: {
//             id: Joi.string().required().description('ID'),
//         }
//     }
// }

exports.save = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        let qq = new QuizQuestion(request.payload);
            qq.user_id = request.auth.credentials.uid;

        let promise = qq.save();

        promise.then(function(qq) {
            reply({status: 1, data:qq, message: "Add successful"});
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created QuizQuestion',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}
// exports.update = {
//     // pre: [
//     //     { method: getById, assign: 'quiz' }
//         // let quiz = QuizQuestion.findById(request.payload.quiz_id)
//     // ],
//     handler: function(request, reply) {
//         let qq = new QuizQuestion(request.payload);

//         let promise = qq.save();
//         promise.then(function(quiz) {
//             reply(quiz);
//         }).catch(function(err) {
//             reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
//         });
//     }
// }
// exports.delete = {
//     pre: [
//         { method: getById, assign: 'quiz' }
//     ],
//     handler: function(request, reply) {
//         const quiz = request.pre.quiz;
//         quiz.remove((err) => {
//             if (err) {
//                 reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
//             }
//             return reply(quiz);
//         });
//     },
//     description: 'Delete Quiz',
//     tags: ['api'],
//     plugins: {
//         'hapi-swagger': {
//             responses: { '400': { 'description': 'Bad Request' } },
//             payloadType: 'form'
//         }
//     },
//     validate: {
//         params: {
//             id: Joi.string().required().description('ID'),
//         }
//     }
// }

// /**
//  * Middleware
//  */
// function getById(request, reply) {
//     const id = request.params.id || request.payload.id;
//     let promise = Quiz.findOne({ '_id': id }).populate('group_id').populate('user_id');
//     promise.then(function(quiz) {
//         reply(quiz);
//     }).catch(function(err) {
//         request.log(['error'], err);
//         return reply.continue();
//     })


// }
