'use strict';

const SettingController = require('./controller/setting.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/setting',
        config: SettingController.getAll
    });
    server.route({
        method: ['GET'],
        path: '/setting/{id}',
        config: SettingController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/setting/{id}',
        config: SettingController.delete

    });
    server.route({
        method: 'POST',
        path: '/setting',
        config: SettingController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/setting/{id}',
        config: SettingController.update,

    });
    server.route({
        method: 'POST',
        path: '/setting/download',
        config: SettingController.download,
    });
    next();
};

exports.register.attributes = {
    name: 'admin-setting'
};