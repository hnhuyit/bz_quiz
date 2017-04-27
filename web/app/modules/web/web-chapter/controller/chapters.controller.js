'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Chapter = mongoose.model('Chapter');
const Subject = mongoose.model('Subject');
const _ = require('lodash');
exports.list = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        let meta = {
            context: 'chapter',
            controller: 'Chapter',
            action: 'List Chapters',
            title : 'List Chapters',
            description: 'List Chapters',
        };
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = {};
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        options = {
            user_id: request.auth.credentials.uid,
            status: 1,
        };
        Chapter.find(options).populate('subject_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta };
            reply.view('web/html/web-chapter/list',dataRes);
        });


    }
}
exports.view = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getItem, assign: 'chapter' }
    ],
    handler: function(request, reply) {
        let chapter = request.pre.chapter;
        if (!chapter) {
            return reply(Boom.notFound('chapter is not be found'));
        }
        let meta = {};
            meta = {
            context: 'chapter',
            controller: 'Chapter',
            action: 'View chapter',
            title : 'View chapter',
            description: 'View chapter',
        };
        return reply.view('web/html/web-chapter/view', { chapter: chapter, meta: meta });
    },
}
exports.add = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {

        // console.log(request.auth);
        let meta = {
            context: 'chapter',
            controller: 'Chapters',
            action: 'Add Chapter',
            title : 'Add Chapter',
            description: 'Add Chapter',
        };

        reply.view('web/html/web-chapter/add', {meta: meta});
    }
}
exports.create = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: (request, reply) => {
        let chapter = new Chapter(request.payload);
            chapter.user_id = request.auth.credentials.uid;

            console.log(chapter);

        let promise = chapter.save();
        promise.then(function() {
            return reply.redirect('/chapters');
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
        {method: getItem, assign: 'chapter'}
    ],
    handler: function(request, reply) {
        let chapter = request.pre.chapter;
        // console.log(chapter);
        if(!chapter) {
            return reply(Boom.notFound('chapter is not be found'));
        }
        let meta = {
            controller: 'Chapters',
            action: 'Edit Chapter',
            context: 'chapter',
            title : 'Edit Chapter',
            description : 'Edit Chapter'
        };


        reply.view('web/html/web-chapter/edit', {meta: meta, chapter: chapter});

    }
}
exports.update = {
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    pre: [
        { method: getItem, assign: 'chapter' }
    ],
    handler: function(request, reply) {
        let chapter = request.pre.chapter;
        
        chapter = _.extend(chapter, request.payload);

        console.log(chapter);
        let promise = chapter.save();
        promise.then(function() {
            return reply.redirect('/chapters');
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
    //         subject_id: Joi.any().allow('').description('Subject'),
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
        { method: getItem, assign: 'chapter' }
    ],
    handler: function(request, reply) {
        const chapter = request.pre.chapter;
        console.log(chapter);
        chapter.remove((err) => {
            if (err) {
                return reply.redirect('/error404');
            }
            return reply.redirect('/chapters');
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
    let promise = Chapter.findOne(options).populate('subject_id').exec();
    promise.then(function(chapter) {
        reply(chapter);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}