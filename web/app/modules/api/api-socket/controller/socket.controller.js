'use strict';

const Boom = require('boom');
const Joi = require('joi');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const mongoose = require('mongoose');
const Message = mongoose.model('Message');

exports.getAllMessage = {
    handler: function (request, reply) {
        console.log('handle get messages');
        let promise = Message.find({});
        promise.then(function(items) {
            return reply(items);
        }).catch(function(err){
            request.log(['error'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        })
    },
    plugins: {
        'hapi-io': 'messages/all'
    },
    description: 'Service status',
    tags: ['api']
}

exports.joinRoom = {
    handler: function (request, reply) {
        console.log('handle join joom');
        //@TODO validate room and user before join
        reply({message: 'OK', room: request.params.roomId});
    },
    plugins: {
      'hapi-io': {
        event: 'room/join',
        post: function(ctx, next) {
          //@TODO validate room and user before join
          
          var rooms = ctx.data.roomId.split(',');
          rooms.forEach(room=>{
              console.log('join room: ' + room);
              ctx.socket.join(room);
          });
          
          next();
        }
      }
    },
    description: 'Service status',
    tags: ['api']
}
exports.leaveRoom = {
    handler: function (request, reply) {
        console.log('handle leave joom');
        //@TODO validate room and user before join
        reply({message: 'OK', room: request.params.roomId});
    },
    plugins: {
      'hapi-io': {
        event: 'room/leave',
        post: function(ctx, next) {
          //@TODO validate room and user before join
          console.log('leave room: ' + ctx.data.roomId);
          var rooms = ctx.data.roomId.split(',');
          rooms.forEach(room=>{
              console.log('leave room: ' + room);
              ctx.socket.leave(room);
          });
          next();
        }
      }
    },
    description: 'Service status',
    tags: ['api']
}