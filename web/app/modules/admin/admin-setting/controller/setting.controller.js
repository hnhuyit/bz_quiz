'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Setting = mongoose.model('Setting');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
const fs = require("fs");


exports.getAll = {
    handler: function(request, reply) {
        let credentials = request.auth.credentials;
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage = config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
        let options = {};
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.key = re;
        }
        Setting
            .find(options)
            .sort('id')
            .paginate(page, itemsPerPage, function(err, items, total) {
                if (err) {
                    request.log(['error', 'list', 'setting'], err);
                    reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                }
                let totalPage = Math.ceil(total / itemsPerPage);
                let dataRes = {
                    status: 1,
                    totalItems: total,
                    totalPage: totalPage,
                    currentPage: page,
                    itemsPerPage: itemsPerPage,
                    numberVisiblePages: numberVisiblePages,
                    items: items
                };
                reply(dataRes);
            });
    },
    description: 'List Setting',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
};

exports.edit = {
    pre: [{
        method: getById,
        assign: 'setting'
    }],
    handler: function(request, reply) {
        const setting = request.pre.setting;
        if (setting) {
            return reply(setting);
        } else {
            reply(Boom.notFound('Setting is not found'));
        }
    }
};

exports.save = {
    handler: function(request, reply) {
        let credentials = request.auth.credentials;
        let setting = new Setting(request.payload);
        let promise = setting.save();
        promise.then(function(setting) {
            reply(setting);
        }).catch(function(err) {
            request.log(['error', 'setting'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));

        });
    },
    description: 'Create setting',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: {
                '400': {
                    'description': 'Bad Request'
                }
            },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            key: Joi.string().required().description('Title'),
            value: Joi.any().description('subtitle'),
            value_type: Joi.any().description('subtitle'),
            description: Joi.any().description('Description'),
            status: Joi.any().description('Status'),
        }
    }
};


exports.update = {
    pre: [{
        method: getById,
        assign: 'setting'
    }],
    handler: function(request, reply) {
        // var {
        //     mongoCache
        // } = request.server.plugins['admin-core'];
        let credentials = request.auth.credentials;
        // if (credentials.scopes.indexOf('superadmin') > -1) {
        let setting = request.pre.setting;
        setting = _.extend(setting, request.payload);
        let promise = setting.save();
        promise.then(function(setting) {
            // mongoCache.directDelete(`Setting:${setting.key},${setting.status}`);
            reply(setting);
        }).catch(function(err) {
            console.log("Err", err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
        // }
    },
    description: 'Update setting',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: {
                '400': {
                    'description': 'Bad Request'
                }
            },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            key: Joi.string().required().description('Title'),
            value: Joi.any().description('subtitle'),
            value_type: Joi.any().description('subtitle'),
            description: Joi.any().description('Description'),
            status: Joi.any().description('Status'),
            _id: Joi.string().description('MongoID')
        }
    }
};

exports.download = {
    handler: function(request, reply) {
        Setting.find().lean().then(function(settings) {
            var result = {};
            settings.forEach(function(setting) {
                result[setting.key] = {
                    type: setting.value_type,
                    value: setting.value
                };
            });
            // console.log("Result: ", result);
            fs.writeFileSync('settings.json', JSON.stringify(result), null, 4);
            return reply.file('settings.json');
        });
    },
    description: 'Download setting',
    // tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: {
                '400': {
                    'description': 'Bad Request'
                }
            },
            payloadType: 'form'
        }
    },
    // validate: {
    //     payload: {}
    // }
};


exports.delete = {
    pre: [{
        method: getById,
        assign: 'setting'
    }],
    handler: function(request, reply) {
        const setting = request.pre.setting;
        setting.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            reply(setting);
        });
    }
};

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Setting.findOne({
        '_id': id
    });
    promise.then(function(setting) {
        reply(setting);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}