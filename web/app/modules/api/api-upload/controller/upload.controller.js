'use strict';

const Boom = require('boom');
const Joi = require('joi');

exports.index = {
    auth: false,
    handler: function(request, reply) {
        return reply({ status: true, msg: 'It works' });
    },
    description: 'Service status',
    tags: ['api']
}

exports.uploadImage = {
    auth: false,
    handler: function(request, reply) {
        var configManager = request.server.configManager;
        var data = request.payload;
        var uploadSteam = data.file;

        var fileName = data.filename || data.file.hapi.filename;
        var uploadPath = configManager.get('web.upload.path');
        var subFolder = data.type;
        var uploadUtil = request.server.plugins['api-upload'];

        uploadUtil.upload(uploadSteam, fileName, uploadPath, subFolder, data.old_filename).then((fileInfo) => {
                return reply({ file: fileInfo });
            })
            .catch(err => {
                request.log(['error', 'upload'], err);
                return reply(Boom.badRequest(err));
            });
    },
    validate: {
        payload: {
            file: Joi.any().required().meta({ swaggerType: 'file' }).description('File'),
            type: Joi.string().description('Type'),
            filename: Joi.string().description('File name'),
            old_filename: Joi.any().description('Older file name'),
            //extension: Joi.string().description('Extension')

        }
    },
    payload: {
        maxBytes: 10048576,
        parse: true,
        allow: 'multipart/form-data',
        output: 'stream'
    },
    description: 'Handle Upload File',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
}