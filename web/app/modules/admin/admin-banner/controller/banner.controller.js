'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Banner = mongoose.model('Banner');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');


exports.getAll = {
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
        let options = {};
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        Banner.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'banner'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });

    }
}

exports.edit = {
    pre: [
        { method: getById, assign: 'banner' }
    ],
    handler: function(request, reply) {
        const banner = request.pre.banner;
        if (banner) {
            return reply(banner);
        } else {
            reply(Boom.notFound('Banner is not found'));
        }
    }
}

exports.save = {
    handler: function(request, reply) {
        let banner = new Banner(request.payload);
        let promise = banner.save();
        promise.then(function(banner) {
            reply(banner);
        }).catch(function(err) {
            request.log(['error', 'banner'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));

        });

    },
    description: 'Create banner',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            title: Joi.string().required().description('Title'),
            subtitle: Joi.any().description('subtitle'),
            link: Joi.any().description('link'),
            image: Joi.any().description('Image'),
            description: Joi.any().description('Description'),
            category: Joi.any().description('Category'),
            status: Joi.any().description('Status'),
            position: Joi.any().description('Position'),
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'banner' }
    ],
    handler: function(request, reply) {
        let banner = request.pre.banner;
        banner = _.extend(banner, request.payload);
        let promise = banner.save();
        promise.then(function(banner) {
            reply(banner);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update banner',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            title: Joi.string().required().description('Title'),
            subtitle: Joi.any().description('subtitle'),
            link: Joi.any().description('link'),
            image: Joi.any().description('Image'),
            description: Joi.any().description('Description'),
            product_id: Joi.string().required().description('ProductID'),
            category: Joi.any().description('Category'),
            status: Joi.any().description('Status'),
            position: Joi.any().description('Position'),
            _id: Joi.string().description('MongoID')

        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'banner' }
    ],
    handler: function(request, reply) {
        const banner = request.pre.banner;
        banner.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            reply(banner);
        });
    }
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Banner.findOne({ '_id': id });
    promise.then(function(banner) {
        reply(banner);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })


}
