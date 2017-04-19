'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Option = mongoose.model('Option');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');

exports.list = {
    handler: function(request, reply) {
        let config = request.server.configManager;
        let itemsPerPage = config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
        let page = request.query.page || 1;

        let meta = {
            title: 'Options',
            description: 'Options description',
            context: 'option',
            controller: 'Options',
            action: 'List Option',
        }

        let options = { status: 1, user_id: request.auth.credentials.uid };

        // if (request.query.keyword && request.query.keyword.length > 0) {
        //     let re = new RegExp(request.query.keyword, 'i');
        //     options.title = re;
        // }

        Option.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta };
            reply.view('web/html/web-option/list',dataRes);
        });

        // async.parallel({
        //     options: function(callback) {
        //         Option
        //             .find(options)
        //             .sort('-created')
        //             .lean()
        //             .paginate(page, itemsPerPage, callback);
        //     }
        // }), function(err, result) {
        //     if(err) {
        //         console.log(err);
        //         throw err;
        //     }
        //     let items = result;
        //     let totalPage = Math.ceil(total / itemsPerPage);
        //     let pagination = new paginator().set({
        //         per_page: itemsPerPage,
        //         current_page: page,
        //         total: total,
        //         number_of_pages: totalPage,
        //         show_empty: false,
        //         url: '/options' + getPrelink(request)
        //     });
        //     let meta = {
        //         title: 'Options',
        //         description: 'Options description'
        //     }

        //     let dataRes = { posts: items, meta: meta, paginator: pagination.render() };
        //     return reply.view('web/html/web-option/list',dataRes);
        // }

    }
}
exports.view = {
    auth: {
        strategy: 'jwt',
        scope: ['user']
    },
    pre: [
        { method: getItem, assign: 'option' }
    ],
    handler: function(request, reply) {
        let option = request.pre.option;
        if (!option) {
            return reply(Boom.notFound('option is not be found'));
        }
        let meta = {};
            meta = {
                context: 'option',
                controller: 'Options',
                action: 'View Option',
                title : 'View Option',
                description: 'View Option',
            };
        return reply.view('web/html/web-option/view', { option: option, meta: meta });
    },
}
exports.add = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin'],
    },
    handler: function(request, reply) {

        console.log(request.auth);
        let meta = {
            context: 'option',
            controller: 'Options',
            action: 'Add Option',
            title : 'Add Option',
            description: 'Add Option',
        };
            
        return reply.view('web/html/web-option/add', {meta: meta});
    }
}
exports.create = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['teacher', 'admin'],
    // },
    handler: (request, reply) => {
        let option = new Option(request.payload);
            option.user_id = request.auth.credentials.uid;

        let promise = option.save();
        promise.then(function() {
            return reply.redirect('/options');
        }).catch(function(err) {
            return reply.redirect('/error404');
        });
    }
}
exports.edit = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['teacher', 'admin'],
    // },
    pre: [
        {method: getItem, assign: 'option'}
    ],
    handler: function(request, reply) {
        let option = request.pre.option;
        console.log(option);
        if(!option) {
            return reply(Boom.notFound('option is not be found'));
        }
        let meta = {
            controller: 'Options',
            action: 'Edit Option',
            context: 'option',
            title : 'Edit Option',
            description : 'Edit Option'
        };
        return reply.view('web/html/web-option/edit', {meta: meta, option: option});
    }
}
exports.update = {
    pre: [
        { method: getItem, assign: 'option' }
    ],
    handler: function(request, reply) {
        let option = request.pre.option;
        
        option = _.extend(option, request.payload);

        console.log(option);
        let promise = option.save();
        promise.then(function() {
            return reply.redirect('/options');
        }).catch(function(err) {
            return reply.redirect('/error404');
        });
    }
    // ,
    // validate: {
    //     payload: {
    //     name: Joi.string().required().description('Name'),
    //         desc: Joi.string().allow('').description('Desc'),
    //         slug: Joi.string().allow('').description('Slug'),
    //         status: Joi.number().allow('').description('Status'),
    //         created: Joi.date().allow('').description('Created'),
    //         modified: Joi.date().allow('').description('Modified'),
            
    //         __v: Joi.any().optional().description('Version Key'),
    //         _id: Joi.string().required().description('MongoID')
    //     }
    // }
}
exports.delete = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['teacher', 'admin'],
    // },
    pre: [
        { method: getItem, assign: 'option' }
    ],
    handler: function(request, reply) {
        const option = request.pre.option;
        console.log(option);
        option.remove((err) => {
            if (err) {
                return reply.redirect('/error404');
            }
            return reply.redirect('/options');
        });
        

    }
}
/**
 * Middleware
 */
function getItem(request, reply) {
    const id = request.params.id;
    let options = {
        _id: id,
        status: 1
    };
    let promise = Option.findOne(options).exec();
    promise.then(function(option) {
        reply(option);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
