'use strict';

const NotifyController = require('./controller/notify.controller.js');

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/notify',
        config: NotifyController.home
    });
    next();
};

exports.register.attributes = {
    name: 'web-notify'
};
