'use strict'

var amqplib = require('amqplib');

exports.register = function (server, options, next) {

    const config = server.configManager;
    
    var amqp = amqplib.connect('amqp://localhost');
    server.decorate('server', 'amqp', amqp);
    server.decorate('request', 'amqp', amqp);
    server.expose('amqp', amqp);
    
    next();

}
exports.register.attributes = {
    name: 'hapi-amqp'
};
