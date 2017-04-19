'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');

exports.list = {
    handler: function(request, reply) {
        let config = request.server.configManager;
        let itemsPerPage = config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
        let page = request.query.page || 1;

        let meta = {
            title: 'Subjects',
            description: 'Subjects description',
            context: 'subject',
            controller: 'Subjects',
            action: 'List Subject',
        }

        let options = { status: 1, user_id: request.auth.credentials.uid };

        // if (request.query.keyword && request.query.keyword.length > 0) {
        //     let re = new RegExp(request.query.keyword, 'i');
        //     options.title = re;
        // }

        Subject.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta };
            reply.view('web/html/web-subject/list',dataRes);
        });

        // async.parallel({
        //     subjects: function(callback) {
        //         Subject
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
        //         url: '/subjects' + getPrelink(request)
        //     });
        //     let meta = {
        //         title: 'Subjects',
        //         description: 'Subjects description'
        //     }

        //     let dataRes = { posts: items, meta: meta, paginator: pagination.render() };
        //     return reply.view('web/html/web-subject/list',dataRes);
        // }

    }
}
exports.view = {
    auth: {
        strategy: 'jwt',
        scope: ['user']
    },
    pre: [
        { method: getItem, assign: 'subject' }
    ],
    handler: function(request, reply) {
        let subject = request.pre.subject;
        if (!subject) {
            return reply(Boom.notFound('subject is not be found'));
        }
        let meta = {};
            meta = {
                context: 'subject',
                controller: 'Subjects',
                action: 'View Subject',
                title : 'View Subject',
                description: 'View Subject',
            };
        return reply.view('web/html/web-subject/view', { subject: subject, meta: meta });
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
            context: 'subject',
            controller: 'Subjects',
            action: 'Add Subject',
            title : 'Add Subject',
            description: 'Add Subject',
        };
            
        return reply.view('web/html/web-subject/add', {meta: meta});
    }
}
exports.create = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['teacher', 'admin'],
    // },
    handler: (request, reply) => {
        let subject = new Subject(request.payload);
            subject.user_id = request.auth.credentials.uid;

            
            console.log(subject);

        let promise = subject.save();
        promise.then(function() {
            return reply.redirect('/subjects');
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
        {method: getItem, assign: 'subject'}
    ],
    handler: function(request, reply) {
        let subject = request.pre.subject;
        console.log(subject);
        if(!subject) {
            return reply(Boom.notFound('subject is not be found'));
        }
        let meta = {
            controller: 'Subjects',
            action: 'Edit Subject',
            context: 'subject',
            title : 'Edit Subject',
            description : 'Edit Subject'
        };
        return reply.view('web/html/web-subject/edit', {meta: meta, subject: subject});
    }
}
exports.update = {
    pre: [
        { method: getItem, assign: 'subject' }
    ],
    handler: function(request, reply) {
        let subject = request.pre.subject;
        
        subject = _.extend(subject, request.payload);

        console.log(subject);
        let promise = subject.save();
        promise.then(function() {
            return reply.redirect('/subjects');
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
        { method: getItem, assign: 'subject' }
    ],
    handler: function(request, reply) {
        const subject = request.pre.subject;
        console.log(subject);
        subject.remove((err) => {
            if (err) {
                return reply.redirect('/error404');
            }
            return reply.redirect('/subjects');
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
    let promise = Subject.findOne(options).exec();
    promise.then(function(subject) {
        reply(subject);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
