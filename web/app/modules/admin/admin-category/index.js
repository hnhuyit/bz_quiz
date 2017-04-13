'use strict';

const CategoryController = require('./controller/category.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/category',
        config: CategoryController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/category/{id}',
        config: CategoryController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/category/{id}',
        config: CategoryController.delete

    });
    server.route({
        method: 'POST',
        path: '/category',
        config: CategoryController.save,

    });
    server.route({
        method: ['PUT'],
        path: '/category/{id}',
        config: CategoryController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-category'
};