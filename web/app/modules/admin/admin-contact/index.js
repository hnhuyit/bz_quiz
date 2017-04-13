'use strict';

const ContactController = require('./controller/contact.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/contact',
        config: ContactController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/contact/{id}',
        config: ContactController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/contact/{id}',
        config: ContactController.delete

    });
    server.route({
        method: 'POST',
        path: '/contact',
        config: ContactController.save,

    });
    server.route({
        method: 'PUT',
        path: '/contact/{id}',
        config: ContactController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-contact'
};