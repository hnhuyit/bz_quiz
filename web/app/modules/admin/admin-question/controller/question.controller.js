'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const _ = require('lodash');
exports.getAll = {
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = {};
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        Question.find(options).populate('subject_id').populate('chapter_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    }
}
exports.edit = {
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
    description: 'Get Question',
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
        let question = new Question(request.payload);
        let promise = question.save();
        promise.then(function(question) {
            reply(question);
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
            description: Joi.string().allow('').description('Description'),
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
    pre: [
        { method: getById, assign: 'question' }
    ],
    handler: function(request, reply) {
        let question = request.pre.question;
        
        question = _.extend(question, request.payload);
        let promise = question.save();
        promise.then(function(question) {
            reply(question);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update Question',
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
