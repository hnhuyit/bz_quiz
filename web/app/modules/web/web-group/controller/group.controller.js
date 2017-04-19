'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Group = mongoose.model('Group');
const _ = require('lodash');
// const async = require('async');
// const paginator = require('super-pagination').paginator;
exports.list = {
    handler: function(request, reply) {
        let config = request.server.configManager;
        let itemsPerPage = config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
        let page = request.query.page || 1;

        let meta = {
            title: 'Groups',
            description: 'Groups description',
            context: 'group',
            controller: 'Groups',
            action: 'List Group',
        }

        let options = { status: 1, user_id: request.auth.credentials.uid };

        // if (request.query.keyword && request.query.keyword.length > 0) {
        //     let re = new RegExp(request.query.keyword, 'i');
        //     options.title = re;
        // }

        Group.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta };
            reply.view('web/html/web-group/list',dataRes);
        });

        // async.parallel({
        //     groups: function(callback) {
        //         Group
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
        //         url: '/groups' + getPrelink(request)
        //     });
        //     let meta = {
        //         title: 'Groups',
        //         description: 'Groups description'
        //     }

        //     let dataRes = { posts: items, meta: meta, paginator: pagination.render() };
        //     return reply.view('web/html/web-group/list',dataRes);
        // }

    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'group' }
    ],
    handler: function(request, reply) {
        let group = request.pre.group;
        if (!group) {
            return reply(Boom.notFound('group is not be found'));
        }
        let meta = {};
            meta = {
                context: 'group',
                controller: 'Groups',
                action: 'View Group',
                title : 'View Group',
                description: 'View Group',
            };
        return reply.view('web/html/web-group/view', { group: group, meta: meta });
    },
}
exports.add = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['user', 'admin'],
    // },
    handler: function(request, reply) {

        console.log(request.auth);
        let meta = {
            context: 'group',
            controller: 'Groups',
            action: 'Add Group',
            title : 'Add Group',
            description: 'Add Group',
        };
            
        return reply.view('web/html/web-group/add', {meta: meta});
    }
}
exports.create = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['teacher', 'admin'],
    // },
    handler: (request, reply) => {
        let group = new Group(request.payload);
            group.user_id = request.auth.credentials.uid;

        let promise = group.save();
        promise.then(function() {
            return reply.redirect('/groups');
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
        {method: getItem, assign: 'group'}
    ],
    handler: function(request, reply) {
        let group = request.pre.group;
        console.log(group);
        if(!group) {
            return reply(Boom.notFound('group is not be found'));
        }
        let meta = {
            controller: 'Groups',
            action: 'Edit Group',
            context: 'group',
            title : 'Edit Group',
            description : 'Edit Group'
        };
        return reply.view('web/html/web-group/edit', {meta: meta, group: group});
    }
}
exports.update = {
    pre: [
        { method: getItem, assign: 'group' }
    ],
    handler: function(request, reply) {
        let group = request.pre.group;
        
        group = _.extend(group, request.payload);

        console.log(group);
        let promise = group.save();
        promise.then(function() {
            return reply.redirect('/groups');
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
        { method: getItem, assign: 'group' }
    ],
    handler: function(request, reply) {
        const group = request.pre.group;
        console.log(group);
        group.remove((err) => {
            if (err) {
                return reply.redirect('/error404');
            }
            return reply.redirect('/groups');
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
    let promise = Group.findOne(options).exec();
    promise.then(function(group) {
        reply(group);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
