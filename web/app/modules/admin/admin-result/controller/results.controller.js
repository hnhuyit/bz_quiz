'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Result = mongoose.model('Result');
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
        Result.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
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
        { method: getById, assign: 'result' }
    ],
    handler: function(request, reply) {
        const result = request.pre.result;
        if (result) {
            return reply(result);
        } else {
            reply(Boom.notFound('Result is not found'));
        }
    },
    description: 'Get Result',
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
        let result = new Result(request.payload);
        let promise = result.save();
        promise.then(function(result) {
            reply(result);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Result',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        result_status: Joi.string().allow('').description('Result Status'),
            start: Joi.date().allow('').description('Start'),
            end: Joi.date().allow('').description('End'),
            score_obtained: Joi.number().allow('').description('Score Obtained'),
            percentage_obtained: Joi.number().allow('').description('Percentage Obtained'),
            total_time: Joi.number().allow('').description('Total Time'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'result' }
    ],
    handler: function(request, reply) {
        let result = request.pre.result;
        
        result = _.extend(result, request.payload);
        let promise = result.save();
        promise.then(function(result) {
            reply(result);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update Result',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        result_status: Joi.string().allow('').description('Result Status'),
            start: Joi.date().allow('').description('Start'),
            end: Joi.date().allow('').description('End'),
            score_obtained: Joi.number().allow('').description('Score Obtained'),
            percentage_obtained: Joi.number().allow('').description('Percentage Obtained'),
            total_time: Joi.number().allow('').description('Total Time'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
            __v: Joi.any().optional().description('Version Key'),
            _id: Joi.string().required().description('MongoID')
        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'result' }
    ],
    handler: function(request, reply) {
        const result = request.pre.result;
        result.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(result);
        });
    },
    description: 'Delete Result',
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
    let promise = Result.findOne({ '_id': id });
    promise.then(function(result) {
        reply(result);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
