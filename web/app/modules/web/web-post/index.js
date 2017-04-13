'use strict';

const PostController = require('./controller/post.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/posts/{category?}',
        config: PostController.list
    });
    server.route({
        method: 'GET',
        path: '/post/{slug}',
        config: PostController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-post'
};