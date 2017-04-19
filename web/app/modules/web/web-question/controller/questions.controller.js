'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Option = mongoose.model('Option');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
exports.list = {
    handler: function(request, reply) {
        let meta = {
            context: 'question',
            controller: 'Câu hỏi',
            action: 'Danh sách câu hỏi',
            title : 'Danh sách câu hỏi',
            description: 'Danh sách câu hỏi',
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
        Question.find(options).populate('subject_id').populate('chapter_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta };
            reply.view('web/html/web-question/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'question' }
    ],
    handler: function(request, reply) {
        let question = request.pre.question;
        if (!question) {
            return reply(Boom.notFound('question is not be found'));
        }
        let meta = {};
            meta = {
            context: 'question',
            controller: 'Câu hỏi',
            action: 'Xem thông tin câu hỏi',
            title : 'Xem thông tin câu hỏi',
            description: 'Xem thông tin câu hỏi',
        };
        let promise = Option.find({question_id: question._id});
        promise.then(function(options) {
            return reply.view('web/html/web-question/view', { question: question, options: options, meta: meta });
        }).catch(function() {
            //
        });

    },
}
exports.add = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['user', 'admin'],
    // },
    handler: function(request, reply) {

        // console.log(request.auth);
        let meta = {
            context: 'question',
            controller: 'Câu hỏi',
            action: 'Thêm câu hỏi',
            title : 'Thêm câu hỏi',
            description: 'Thêm câu hỏi',
        };

        reply.view('web/html/web-question/add', {meta: meta});
    }
}
exports.create = {
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['teacher', 'admin'],
    // },
    handler: (request, reply) => {
        let question = new Question(request.payload);
            question.user_id = request.auth.credentials.uid;

            console.log(question)

        let promise = question.save();
        promise.then(function() {
            return reply.redirect('/questions');
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
        {method: getItem, assign: 'question'}
    ],
    handler: function(request, reply) {
        let question = request.pre.question;
        // console.log(question);
        if(!question) {
            return reply(Boom.notFound('question is not be found'));
        }
        let meta = {
            controller: 'Câu hỏi',
            action: 'Sửa câu hỏi',
            context: 'question',
            title : 'Sửa câu hỏi',
            description : 'Sửa câu hỏi'
        };


        reply.view('web/html/web-question/edit', {meta: meta, question: question});

    }
}
exports.update = {
    pre: [
        { method: getItem, assign: 'question' }
    ],
    handler: function(request, reply) {
        let question = request.pre.question;
        
        question = _.extend(question, request.payload);

        console.log(question);
        let promise = question.save();
        promise.then(function() {
            return reply.redirect('/questions');
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
    // auth: {
    //     strategy: 'jwt',
    //     scope: ['teacher', 'admin'],
    // },
    pre: [
        { method: getItem, assign: 'question' }
    ],
    handler: function(request, reply) {
        const question = request.pre.question;
        console.log(question);
        question.remove((err) => {
            if (err) {
                return reply.redirect('/error404');
            }
            return reply.redirect('/questions');
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
    let promise = Question.findOne(options).populate('chapter_id').populate('subject_id').exec();
    promise.then(function(question) {
        reply(question);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}