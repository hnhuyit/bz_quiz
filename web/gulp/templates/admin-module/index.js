'use strict';

const <%= controllerName %>Controller = require('./controller/<%= controllerFileName %>.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/<%= routeName %>',
        config: <%= controllerName %>Controller.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/<%=routeName %>/{id}',
        config: <%= controllerName %>Controller.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/<%=routeName %>/{id}',
        config: <%= controllerName %>Controller.delete

    });
    server.route({
        method: 'POST',
        path: '/<%=routeName %>',
        config: <%= controllerName %>Controller.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/<%=routeName %>/{id}',
        config: <%= controllerName %>Controller.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-<%=moduleName %>'
};
