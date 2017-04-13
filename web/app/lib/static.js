'use strict'

const asset = require('../utils/asset');
const path = require('path');
// Declare internals
const internals = {};

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/templates/{module}/{file}',
        handler: function (request, reply) {
            let file = internals.helpers.getClientPath(request, reply);
            // console.log(file);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });
    server.route({
        method: 'GET',
        path: '/app/templates/{modules}/html/{module}/client/{file*}',
        handler: function (request, reply) {
            let file = BASE_PATH + `/app/templates/${request.params.modules}/html/${request.params.module}/client/${request.params.file}`;
            // console.log('File: ' + file);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        },
        config: {
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/adminassets/{param*}',
        handler: {
            directory: {
                path: 'node_modules'
            }
        },
        config: {
            auth: false
        }
    });


    const config = server.configManager.get('web');

    var assetsJs = asset.getAssets(config.assets.include.js, 'public/');
    var assetsCss = asset.getAssets(config.assets.include.css, 'public/');

    // console.log(config.adminassets.js,"adminassets");

    var assetsAdminJs = asset.getAssets(config.adminassets.js, 'node_modules/');
    var assetsAdminCss = asset.getAssets(config.adminassets.css, 'node_modules/');

    server.ext('onPreResponse', function (request, reply) {
        if (request.response.variety === 'view') {
            request.response.source.context = request.response.source.context || {};
            request.response.source.context.assets = { css: assetsCss, js: assetsJs };
            request.response.source.context.adminassets = { css: assetsAdminCss, js: assetsAdminJs };
            request.response.source.context.cmsName = config.name;
        }

        reply.continue();
    });

    return next();
}

exports.register.attributes = {
    name: 'app-static',
    dependencies: 'inert'
};

internals.helpers = {
    getFileExt: function (fileName) {
        var fileExt = fileName.split(".");
        if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
            return "";
        }
        return fileExt.pop();
    },
    getClientPath: function (request, reply) {
        let clients = {
            css: 'style',
            js: 'js',
            html: 'template'
        };
        let file = request.params.file;
        let fileExt = this.getFileExt(file);
        let assetFolder = clients[fileExt];

        let filePath = path.join(BASE_PATH, '/app/templates', 'admin', 'html', request.params.module, 'client', assetFolder, file);
        // let filePath = path.join(BASE_PATH + '/app/template/admin/html', request.params.module, 'client', assetFolder, file);
        // console.log(filePath)
        return filePath;
    }
};