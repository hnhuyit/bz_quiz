'use strict';

const UserController = require('./controller/user.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/login',
        config: UserController.login
        
    });
    server.route({
        method: 'GET',
        path: '/register',
        config: UserController.register
        
    });
    server.route({
        method: 'GET',
        path: '/account',
        config: UserController.account
        
    });
    server.route({
        method: 'GET',
        path: '/changepassword',
        config: UserController.changepassword
        
    });
    server.route({
        method: 'GET',
        path: '/forgot',
        config: UserController.forgot
        
    });
    server.route({
        method: 'GET',
        path: '/reset',
        config: UserController.reset
    });

    next();
};

exports.register.attributes = {
    name: 'web-user'
};
