'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');

exports.list = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'guest', 'admin']
    },
    handler: function(request, reply) {

        let meta = {
            title: 'Danh sách môn học',
            description: 'Mô tả môn học',
            context: 'subject',
            controller: 'Môn học',
            action: 'Danh sách môn học',
        }

        let options = { status: 1};

        if(request.auth.credentials && request.auth.credentials.scope.includes('user')) {
            options.user_id =  request.auth.credentials.uid;
            let promiseSubjects = Subject.find(options).populate('user_id');
            promiseSubjects.then(function(items) {
                
                let dataRes = { status: '1', items: items, meta:meta };
                reply.view('web/html/web-subject/list', dataRes);
            }).catch(function(err) {
                if (err) {
                    request.log(['error'], err);
                    // return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                    return reply.redirect('/error404');
                }
            });
        } else {
            options.students =  request.auth.credentials.uid;
            let promiseSubjects = Subject.find(options).populate('user_id');
            promiseSubjects.then(function(items) {
                
                let dataRes = { status: '1', items: items, meta:meta };
                reply.view('web/html/web-subject/subjects-by-student', dataRes);
            }).catch(function(err) {
                if (err) {
                    request.log(['error'], err);
                    // return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                    return reply.redirect('/error404');
                }
            });
        }
        

    }
}
exports.view = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
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
                controller: 'Môn học',
                action: 'Xem môn học',
                title : 'Xem môn học',
                description: 'Xem môn học',
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
                controller: 'Môn học',
            action: 'Thêm môn học',
            title : 'Thêm môn học',
            description: 'Thêm môn học',
        };
            
        return reply.view('web/html/web-subject/add', {meta: meta});
    }
}
exports.create = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: (request, reply) => {
        let subject = new Subject(request.payload);
            subject.user_id = request.auth.credentials.uid;

        let auth = request.server.plugins['api-user'].auth;
            subject.key = auth.getRandomString(3);

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
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
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
            controller: 'Môn học',
            action: 'Sửa môn học',
            context: 'subject',
            title : 'Sửa môn học',
            description : 'Sửa môn học'
        };
        return reply.view('web/html/web-subject/edit', {meta: meta, subject: subject});
    }
}
exports.update = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
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
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
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
