'use strict';

const <%= controllerName %>Controller = require('./controller/<%= controllerFileName %>.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/<%= routePluralName %>',
        config: <%= controllerName %>Controller.list
    });
    server.route({
        method: 'GET',
        path: '/<%= routeName %>/{<% if(slug){ %>slug<% }else{ %>_id<% } %>}',
        config: <%= controllerName %>Controller.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-<%=moduleName %>'
};