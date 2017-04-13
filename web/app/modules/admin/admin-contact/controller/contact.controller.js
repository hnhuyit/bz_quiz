'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
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
            options.name = re;
        }
        Contact.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'contact'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    }
}

exports.edit = {
    pre: [
        { method: getById, assign: 'contact' }
    ],
    handler: function(request, reply) {
        const contact = request.pre.contact;
        if (contact) {
            return reply(contact);
        } else {
            reply(Boom.notFound('Contact is not found'));
        }
    }
}

exports.save = {
    handler: function(request, reply) {
        let contact = new Contact(request.payload);
        let promise = contact.save();
        promise.then(function(contact) {
            reply(contact);
        }).catch(function(err) {
            request.log(['error', 'contact'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created contact',
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
            email: Joi.string().required().description('Email'),
            address: Joi.string().required().description('Address'),
            phone: Joi.any().description('Phone'),
            messages: Joi.string().required().description('Messages')
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'contact' }
    ],
    handler: function(request, reply) {
        let contact = request.pre.contact;
        contact = _.extend(contact, request.payload);
        let promise = contact.save();
        promise.then(function(contact) {
            reply(contact);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update contact',
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
            email: Joi.string().required().description('Email'),
            address: Joi.any().description('Address'),
            phone: Joi.string().required().description('Phone'),
            messages: Joi.string().required().description('Messages'),
            modified: Joi.any().description('Modified'),
            _id: Joi.string().description('MongoID')

        }
    }
}
exports.delete = {
        pre: [
            { method: getById, assign: 'contact' }
        ],
        handler: function(request, reply) {
            const contact = request.pre.contact;
            contact.remove((err) => {
                if (err) {
                    reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                }
                return reply(contact);
            });
        }
    }
    /**
     * Middleware
     */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Contact.findOne({ '_id': id });
    promise.then(function(contact) {

        reply(contact);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })


}
