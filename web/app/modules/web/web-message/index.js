'use strict';

const MessageController = require('./controller/message.controller.js');

exports.register = function (server, options, next) {
    
    server.route({
        method: 'GET',
        path: '/message',
        config: MessageController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/message/add',
        config: MessageController.add,
    });
    server.route({
        method: ['GET'],
        path: '/message/edit/{id}',
        config: MessageController.edit,
        
    });
    server.route({
        method: ['DELETE','GET'],
        path: '/message/delete/{id}',
        config: MessageController.delete
        
    });
    server.route({
        method: 'POST',
        path: '/message/save',
        config: MessageController.save,
        
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/message/update',
        config: MessageController.update,
        
    });
    next();
};

exports.register.attributes = {
    name: 'web-message'
};
