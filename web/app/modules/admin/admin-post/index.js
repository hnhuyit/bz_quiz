'use strict';

const PostController = require('./controller/post.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    
    server.route({
        method: 'GET',
        path: '/post',
        config: PostController.getAll,
    });

    server.route({
        method: ['GET'],
        path: '/post/{id}',
        config: PostController.edit,

    });

    server.route({
        method: ['DELETE'],
        path: '/post/{id}',
        config: PostController.delete

    });

    server.route({
        method: 'POST',
        path: '/post',
        config: PostController.save,

    });

    server.route({
        method: ['PUT', 'POST'],
        path: '/post/{id}',
        config: PostController.update,

    });

    server.route({
        method: 'PUT',
        path: '/post/moveToTrash',
        config: PostController.moveToTrash,
    });

    server.route({
        method: 'PUT',
        path: '/post/changeStatus',
        config: PostController.changeStatus,
    });

    server.route({
        method: 'PUT',
        path: '/post/changeStatusMultiRows',
        config: PostController.changeStatusMultiRows,
    });

    server.route({
        method: 'PUT',
        path: '/post/deleteMultiRows',
        config: PostController.deleteMultiRows,
    });
    next();
};

exports.register.attributes = {
    name: 'admin-post'
};