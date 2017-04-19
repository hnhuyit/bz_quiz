'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
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
        Subject.find(options).populate('user_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
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
        { method: getById, assign: 'subject' }
    ],
    handler: function(request, reply) {
        const subject = request.pre.subject;
        if (subject) {
            return reply(subject);
        } else {
            reply(Boom.notFound('Subject is not found'));
        }
    },
    description: 'Get Subject',
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
        let subject = new Subject(request.payload);
        let promise = subject.save();
        promise.then(function(subject) {
            reply(subject);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Subject',
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
            
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'subject' }
    ],
    handler: function(request, reply) {
        let subject = request.pre.subject;
        
        subject = _.extend(subject, request.payload);
        let promise = subject.save();
        promise.then(function(subject) {
            reply(subject);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update Subject',
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
        { method: getById, assign: 'subject' }
    ],
    handler: function(request, reply) {
        const subject = request.pre.subject;
        subject.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(subject);
        });
    },
    description: 'Delete Subject',
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
    let promise = Subject.findOne({ '_id': id });
    promise.then(function(subject) {
        reply(subject);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
