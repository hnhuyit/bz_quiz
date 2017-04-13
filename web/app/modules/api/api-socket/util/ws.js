'use strict';

const socketioJwt = require('socketio-jwt');
const _ = require('lodash');

exports.clients = [];

exports.container = [];

exports.socket = {};

exports.listen = function (server) {
    var io = server.plugins['hapi-io'].io;
    var onConnection = function(socket){
        console.log('onConnection');
        exports.addClient(socket);

    };
    var onDisconnect = function(){
        console.log('onDisconnect');
    };
    var onAuthenticated = function(socket){
        console.log('onAuthenticated');
    };

    io.on('connection', socketioJwt.authorize({
        secret: configManager.get('web.jwt.secret'),
        timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function (socket) {
        exports.socket = socket;
        onConnection(socket);
        socket.on('disconnect', onDisconnect);

    });
};

exports.addClient = function (socket) {
    console.log('add client');
    var id = socket.decoded_token.id;
    var name = socket.decoded_token.name;
    console.log(`ID=${id}  Name: ${name}`);
    if (exports.clients[id]) {
        exports.clients[id].push(socket);
    } else {
        exports.clients[id] = [socket];
    }
    // console.log('----Num Socket client---------');
    // console.log(require('util').inspect(exports.clients));
    // console.log(_.size(exports.clients.keys()));
    // console.log('---Num Socket client---');
}

exports.getClients = function () {
    return exports.clients;
}
exports.getSocket = function () {
    return socket;
}
