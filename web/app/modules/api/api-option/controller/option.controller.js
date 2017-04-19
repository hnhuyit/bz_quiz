'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Option = mongoose.model('Option');
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
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        Option.find(options).populate('user_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
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
    description: 'Get Option',
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
        let option = new Option(request.payload);
            option.user_id = request.auth.credentials.uid;

        let promise = option.save();
        promise.then(function(option) {
            reply(option);
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
            user_id: Joi.any().allow('').description('User'),
            question_id: Joi.any().allow('').description('Question'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
        }
    }
}
exports.update = {
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
    description: 'Update Option',
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
