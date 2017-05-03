'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Group = mongoose.model('Group');
const _ = require('lodash');
const regexp = require(BASE_PATH + '/app/utils/regexp');
exports.getAll = {
    pre: [{
        method: getOptions,
        assign: 'options'
    }],
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = request.pre.options;
            options.user_id =  request.auth.credentials.uid;
        Group.find(options).populate('user_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    },
    description: 'List Group',
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
        { method: getById, assign: 'group' }
    ],
    handler: function(request, reply) {
        const group = request.pre.group;
        if (group) {
            return reply(group);
        } else {
            reply(Boom.notFound('Group is not found'));
        }
    },
    description: 'Edit Group',
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
        let group = new Group(request.payload);
        let promise = group.save();
        promise.then(function(group) {
            reply(group);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Group',
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
            status: Joi.number().allow('').description('Status'),
            valid_for_days: Joi.number().allow('').description('Valid For Days'),
            price: Joi.number().allow('').description('Price'),
            description: Joi.string().allow('').description('Description'),
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
        { method: getById, assign: 'group' }
    ],
    handler: function(request, reply) {
        let group = request.pre.group;
        
        group = _.extend(group, request.payload);
        let promise = group.save();
        promise.then(function(group) {
            reply(group);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Updated Group',
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
            status: Joi.number().allow('').description('Status'),
            valid_for_days: Joi.number().allow('').description('Valid For Days'),
            price: Joi.number().allow('').description('Price'),
            description: Joi.string().allow('').description('Description'),
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
        { method: getById, assign: 'group' }
    ],
    handler: function(request, reply) {
        const group = request.pre.group;
        group.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(group);
        });
    },
    description: 'Delete Group',
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
    let promise = Group.findOne({ '_id': id });
    promise.then(function(group) {
        reply(group);
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

    return reply(options);
}