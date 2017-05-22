'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Anwser = mongoose.model('Anwser');
const _ = require('lodash');
exports.list = {
    handler: function(request, reply) {

        let meta = {
            controller: 'Bài thi',
            action: ' Danh sách bài thi',
            title : ' Danh sách bài thi',
            description: ' Danh sách bài thi',
        };
        // let page = request.query.page || 1;
        // let config = request.server.configManager;
        // let itemsPerPage =  config.get('web.paging.itemsPerPage');
        // let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        // let options = {};
        // if (request.query.keyword && request.query.keyword.length > 0) {
        //     let re = new RegExp(request.query.keyword, 'i');
        //     options.title = re;
        // }
        // options = {
        //     user_id: request.auth.credentials.uid,
        //     status: 1,
        // };
        // Question.find(options).populate('subject_id').populate('chapter_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
        //     if (err) {
        //         request.log(['error', 'list'], err);
        //         reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        //     }
        //     let totalPage = Math.ceil(total / itemsPerPage);
        //     let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta };
        //     reply.view('web/html/web-question/list',dataRes);
        // });
        

        if(request.auth.credentials && request.auth.credentials.scope.includes('user')) {
            reply.view('web/html/web-anwser/list', {meta:meta});
        } else {
            reply.view('web/html/web-anwser/anwsers-by-student', {meta:meta});
        }

    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'anwser' }
    ],
    handler: function(request, reply) {
        let anwser = request.pre.anwser;
        if (!anwser) {
            return reply(Boom.notFound('anwser is not be found'));
        }
        let meta = {}
        if(anwser.attrs && anwser.attrs.title){
            meta.title = anwser.attrs.title || anwser.title
            meta.description = anwser.attrs.description || anwser.title
        }
        return reply.view('web/html/web-anwser/view', { anwser: anwser, meta: meta });
    },
}

/**
 * Middleware
 */
function getItem(request, reply) {
    const _id = request.params._id;
    let options = {
        _id: request.params._id,
        status: 1
    };
    let promise = Anwser.findOne(options).exec();
    promise.then(function(anwser) {
        reply(anwser);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
