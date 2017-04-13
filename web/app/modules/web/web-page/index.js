'use strict';

const PageController = require('./controller/page.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/about',
        config: PageController.about
    });
    server.route({
        method: 'GET',
        path: '/faq',
        config: PageController.faq
    });
    server.route({
        method: 'GET',
        path: '/term',
        config: PageController.term
    });

    server.route({
        method: 'GET',
        path: '/help',
        config: PageController.help
    });
    server.route({
        method: 'GET',
        path: '/support',
        config: PageController.support
    });

    server.route({
        method: 'GET',
        path: '/error404',
        config: PageController.error404
    });

    server.route({
        method: 'GET',
        path: '/html/{slug}',
        config: PageController.html
    });
    next();
};

exports.register.attributes = {
    name: 'web-page'
};