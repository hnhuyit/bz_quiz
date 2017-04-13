'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const mongoose = require('mongoose');
const Message = mongoose.model('Message');

exports.getAll = {
    handler: function(request, reply) {
        let promise = Message.find({});
        promise.then(function(items) {
            console.log(items);
            return reply.view('web/html/web-message/list', { items: items });
        }).catch(function(err) {
            request.log(['error'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        })
    }
}

exports.add = {
    handler: function(request, reply) {
        return reply.view('web/html/web-message/add');
    },
}

exports.edit = {
    pre: [
        { method: getById, assign: 'message' }
    ],
    handler: function(request, reply) {
        const message = request.pre.message;
        if (message) {
            return reply.view('web/html/web-message/edit', { message: message });
        } else {
            reply(Boom.notFound('Message is not found'));
        }
    }
}

exports.save = {
    handler: function(request, reply) {
        let message = new Message(request.payload);
        let promise = message.save();
        promise.then(function(message) {
            var io = request.server.plugins['hapi-io'].io;
            if (io) {
                let socketio = io.sockets;
                if (message.channel !== 'global') {
                    socketio = socketio.in(message.channel);
                }
                socketio.emit('message/created', message);
            }
            request.log(['info', 'message'], message);
            reply.redirect('/message');
        }).catch(function(err) {
            request.log(['error', 'message'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created message',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            title: Joi.string().required().description('Title'),
            message: Joi.string().required().description('Message'),
            channel: Joi.any().optional().description('Channel'),
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'message' }
    ],
    handler: function(request, reply) {
        let message = request.pre.message;
        message = _.extend(message, request.payload);
        let promise = message.save();
        promise.then(function(message) {
            var io = request.server.plugins['hapi-io'].io;
            if (io) {
                let socketio = io.sockets;
                if (message.channel !== 'global') {
                    socketio = socketio.in(message.channel);
                }
                socketio.emit('message/updated', message);
            }
            reply.redirect('/message');
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update message',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            title: Joi.string().required().description('Title'),
            message: Joi.string().required().description('Message'),
            channel: Joi.any().description('Channel'),
            id: Joi.string().description('MongoID')

        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'message' }
    ],
    handler: function(request, reply) {
        const message = request.pre.message;
        message.remove((err) => {
            var io = request.server.plugins['hapi-io'].io;
            if (io) {
                let socketio = io.sockets;
                if (message.channel !== 'global') {
                    socketio = socketio.in(message.channel);
                }
                socketio.emit('message/deleted', message);
            }
            return reply.redirect('/message');
        });
    }
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Message.findOne({ '_id': id });
    promise.then(function(message) {
        return reply(message);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    });

}
/**
 * End middleware
 */