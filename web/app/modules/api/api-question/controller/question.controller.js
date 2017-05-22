'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Question = mongoose.model('Question');
const _ = require('lodash');
const pagination = require('pagination');
const regexp = require(BASE_PATH + '/app/utils/regexp');
exports.getAll = {
    pre: [{
        method: getOptions,
        assign: 'options'
    }],
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin', 'guest']
    },
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
        
        let options = request.pre.options;
        
        Question.find(options).populate('subject_id').populate('chapter_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    },
    description: 'List Question',
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
        { method: getById, assign: 'question' }
    ],
    handler: function(request, reply) {
        const question = request.pre.question;
        if (question) {
            return reply(question);
        } else {
            reply(Boom.notFound('Question is not found'));
        }
    },
    description: 'Edit Question',
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
        let question = new Question(request.payload);
            question.user_id = request.auth.credentials.uid;

        let promise = question.save();
        promise.then(function(question) {
            reply({question: question, status: 1, message: "Thêm thành công!!!"});
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Question',
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
            slug: Joi.string().allow('').description('Slug'),
            question_type: Joi.number().required().description('Question Type'),
            level: Joi.number().required().description('Level'),
            subject_id: Joi.any().allow('').description('Subject'),
            chapter_id: Joi.any().allow('').description('Chapter'),
            options: Joi.any().description('Options'),
            desc: Joi.string().allow('').description('Desc'),
            // no_time_corrected: Joi.number().allow('').description('No Time Corrected'),
            // no_time_incorrected: Joi.number().allow('').description('No Time Incorrected'),
            // no_time_unattempted: Joi.number().allow('').description('No Time Unattempted'),
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
    handler: function(request, reply) {
        let question = request.payload;
        
        let promise = question.save();
        promise.then(function(question) {
            reply(question);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Updated Question',
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
            slug: Joi.string().allow('').description('Slug'),
            question_type: Joi.number().required().description('Question Type'),
            level: Joi.number().required().description('Level'),
            subject_id: Joi.any().allow('').description('Subject'),
            chapter_id: Joi.any().allow('').description('Chapter'),
            correct_option: Joi.any().allow('').description('Option'),
            description: Joi.string().allow('').description('Description'),
            // no_time_corrected: Joi.number().allow('').description('No Time Corrected'),
            // no_time_incorrected: Joi.number().allow('').description('No Time Incorrected'),
            // no_time_unattempted: Joi.number().allow('').description('No Time Unattempted'),
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
        { method: getById, assign: 'question' }
    ],
    handler: function(request, reply) {
        const question = request.pre.question;
        question.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(question);
        });
    },
    description: 'Delete Question',
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
    let promise = Question.findOne({ '_id': id });
    promise.then(function(question) {
        reply(question);
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
        question_type,
        level
    } = request.payload || request.query;

    let tmpKeyword = regexp.RegExp("", 'i');
    let idKeyword = null;
    if (keyword &&
        keyword.length > 0) {

        options.$or = [{
            desc: regexp.RegExp(keyword, 'i')
        },
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

    if (question_type) {
        options.question_type = question_type;
    }

    if (level) {
        options.level = level;
    }
    return reply(options);
}