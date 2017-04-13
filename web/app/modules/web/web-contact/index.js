'use strict';

const ContactController = require('./controller/contact.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/contact',
        config: ContactController.contact
    });
    next();
};

exports.register.attributes = {
    name: 'web-contact'
};
