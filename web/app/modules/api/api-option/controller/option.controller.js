'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Option = mongoose.model('Option');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Question = mongoose.model('Question');
const _ = require('lodash');
const regexp = require(BASE_PATH + '/app/utils/regexp');
exports.getAll = {
    pre: [{
        method: getOptions,
        assign: 'options'
    }],
    auth: {
        strategy: 'jwt',
        scope: ['user', 'guest']
    },
    handler: function(request, reply) {
       
        let options = request.pre.options;
        Option.find(options, function(err, items) {
            if (err) {
                request.log(['error'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }

            console.log(items)
            let dataRes = { status: 1, items: items };
            reply(dataRes);
        });


    },
    description: 'List Option',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}
exports.edit = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getById, assign: 'option' }
    ],
    handler: function(request, reply) {
        const option = request.pre.option;
        if (option) {
            return reply(option);
        } else {
            reply(Boom.notFound('Option is not found'));
        }
    },
    description: 'Edit Option',
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
        let option = new Option(request.payload);
            option.user_id = request.auth.credentials.uid;
            if(option.score !== 0) {
                option.is_correct = 1;
            }
        let promise = option.save();
        promise.then(function(option) {
            if(option.is_correct) {
                Question.findById(option.question_id, function(err, question) {
                    if(err) {
                         return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                    }
                    question.correct_option = option._id;
                    question.save(function (err, questionUpdate) {
                        if (err) return handleError(err);
                        // console.log(questionUpdate);
                        reply(option);
                    });
                });
            }else {
                reply(option);
            }
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Option',
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
            name_match: Joi.string().allow('').description('Name Match'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            score: Joi.number().allow('').description('Score'),
            is_correct: Joi.number().allow('').description('Is correct'),
            user_id: Joi.any().allow('').description('User'),
            question_id: Joi.any().allow('').description('Question'),
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
        { method: getById, assign: 'option' }
    ],
    handler: function(request, reply) {
        let option = request.pre.option;
        
        option = _.extend(option, request.payload);
        let promise = option.save();
        promise.then(function(option) {
            reply(option);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Updated Option',
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
            desc: Joi.string().allow('').description('Desc'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            user_id: Joi.any().allow('').description('User'),
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
        { method: getById, assign: 'option' }
    ],
    handler: function(request, reply) {
        const option = request.pre.option;
        option.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(option);
        });
    },
    description: 'Delete Option',
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
    let promise = Option.findOne({ '_id': id });
    promise.then(function(option) {
        reply(option);
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
        keyword,
        question_id,
    } = request.payload || request.query;

    let tmpKeyword = regexp.RegExp("", 'i');
    let idKeyword = null;
    if (keyword &&
        keyword.length > 0) {

        options.$or = [
        {
            name: regexp.RegExp(keyword, 'i')
        }
        ];

        if (mongoose.Types.ObjectId.isValid(keyword)) {
            options.$or.push({
                _id: keyword
            });
        }
    }

    if (question_id && mongoose.Types.ObjectId.isValid(question_id)) {
        options.question_id = new mongoose.mongo.ObjectId(question_id);
    }

    return reply(options);
}