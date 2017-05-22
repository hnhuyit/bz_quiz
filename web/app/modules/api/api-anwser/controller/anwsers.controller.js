'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Anwser = mongoose.model('Anwser');
const Result = mongoose.model('Result');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
exports.getAll = {
    pre: [{
        method: getOptions,
        assign: 'options'
    }],
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = request.pre.options;
            options.teacher_id =  request.auth.credentials.uid;
        Anwser.find(options).populate(['quiz_id', 'quiz_id.subject_id']).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    },
    description: 'List Anwsers By Teacher',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}
exports.getAnwsersByStudent = {
    pre: [{
        method: getOptions,
        assign: 'options'
    }],
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = request.pre.options;
            options.student_id =  request.auth.credentials.uid;
        Anwser.find(options).populate(['quiz_id', 'quiz_id.subject_id']).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    },
    description: 'List Anwsers By Student',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}
exports.edit = {
    pre: [
        { method: getById, assign: 'anwser' }
    ],
    handler: function(request, reply) {
        const anwser = request.pre.anwser;
        if (anwser) {
            return reply(anwser);
        } else {
            reply(Boom.notFound('Anwser is not found'));
        }
    },
    description: 'Edit Anwser',
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
    handler: function(request, reply) {
        let anwser = new Anwser(request.payload);
            anwser.student_id = request.auth.credentials.uid;
            // console.log('anwser', anwser);
        
        let result = new Result();
            result.student_id = request.auth.credentials.uid;
            result.teacher_id = anwser.teacher_id;
            result.score_obtained = 0;
            result.percentage_obtained = 0;
        let no_correct = 0;
            anwser.user_answer.forEach(function(anw) {
                result.score_obtained += anw.option_score;
                if(anw.option_score === 1) {
                    no_correct++;
                }
            });
            result.percentage_obtained = no_correct/anwser.user_answer.length;
            result.result_status = (result.percentage_obtained >= 0.5) ? "PASS" : "FAIED";
            
            // console.log('result', result);

        let promise = anwser.save();
        promise.then(function(anwser) {
            result.anwser_id = anwser._id;
            result.save(function(err, result) {
                if(err) console.log(err);

                // console.log('result', result);
                reply(result);
            });
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Anwser',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    // validate: {
    //     payload: {
    //         status: Joi.number().description('Status'),
    //         created: Joi.date().description('Created'),
    //         modified: Joi.date().description('Modified'),
            
    //     }
    // }
}
// exports.update = {
//     pre: [
//         { method: getById, assign: 'anwser' }
//     ],
//     handler: function(request, reply) {
//         let anwser = request.pre.anwser;
       
//         anwser = _.extend(anwser, request.payload);
//         let promise = anwser.save();
//         promise.then(function(anwser) {
//             reply(anwser);
//         }).catch(function(err) {
//             reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
//         });
//     },
//     description: 'Updated Anwser',
//     tags: ['api'],
//     plugins: {
//         'hapi-swagger': {
//             responses: { '400': { 'description': 'Bad Request' } },
//             payloadType: 'form'
//         }
//     },
//     validate: {
//         payload: {
//             status: Joi.number().description('Status'),
//             created: Joi.date().description('Created'),
//             modified: Joi.date().description('Modified'),
            
//             __v: Joi.any().optional().description('Version Key'),
//             _id: Joi.string().required().description('MongoID')
//         }
//     }
// }
// exports.delete = {
//     pre: [
//         { method: getById, assign: 'anwser' }
//     ],
//     handler: function(request, reply) {
//         const anwser = request.pre.anwser;
//         anwser.remove((err) => {
//             if (err) {
//                 reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
//             }
//             return reply(anwser);
//         });
//     },
//     description: 'Delete Anwser',
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

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Anwser.findOne({ '_id': id });
    promise.then(function(anwser) {
        reply(anwser);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}

function getOptions(request, reply) {
    let options = {
        status: 1
    };
    let {
        quiz_id,
        // subject_id
    } = request.payload || request.query;

    // if (subject_id && mongoose.Types.ObjectId.isValid(subject_id)) {
    //     options.subject_id = new mongoose.mongo.ObjectId(subject_id);
    // }
    if (quiz_id && mongoose.Types.ObjectId.isValid(quiz_id)) {
        options.quiz_id = new mongoose.mongo.ObjectId(quiz_id);
    }

    return reply(options);
}