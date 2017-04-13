'use strict';

const BannerController = require('./controller/banner.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/banner',
        config: BannerController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/banner/{id}',
        config: BannerController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/banner/{id}',
        config: BannerController.delete

    });
    server.route({
        method: 'POST',
        path: '/banner',
        config: BannerController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/banner/{id}',
        config: BannerController.update,

    });
    // server.route({
    //     method: ['POST'],
    //     path: cmsprefix+'/banner/upload',
    //     config: BannerController.upload,

    // });
    next();
};

exports.register.attributes = {
    name: 'admin-banner'
};