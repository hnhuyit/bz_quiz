'use strict';

exports.register = function (server, options, next) {
    var configManager = server.configManager;
    var cmsprefix = configManager.get('web.context.cmsprefix');

    let setting = require('./util/setting');

    server.expose('getSetting', setting.getSetting);
    next();
};

exports.register.attributes = {
    name: 'api-setting'
};