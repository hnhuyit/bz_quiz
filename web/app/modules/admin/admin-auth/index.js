'use strict';

const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const util = require('util');

const AuthController = require('./controller/auth.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/signin',
        config: AuthController.viewLogin
    });
    next();
};

exports.register.attributes = {
    name: 'admin-auth'
};