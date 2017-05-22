'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Result = mongoose.model('Result');
const _ = require('lodash');
exports.list = {
    handler: function(request, reply) {
        // let page = request.query.page || 1;
        // let config = request.server.configManager;
        // let itemsPerPage =  config.get('web.paging.itemsPerPage');
        // let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        // let options = {};
        // if (request.query.keyword && request.query.keyword.length > 0) {
        //     let re = new RegExp(request.query.keyword, 'i');
        //     options.title = re;
        // }
        // Result.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
        //     if (err) {
        //         request.log(['error', 'list'], err);
        //         reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        //     }
        //     let totalPage = Math.ceil(total / itemsPerPage);
        //     let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        //     reply.view('web/html/web-result/list',dataRes);
        // });


        let meta = {
            controller: 'Kết quả',
            action: ' Danh sách kết quả',
            title : ' Danh sách kết quả',
            description: ' Danh sách kết quả',
        };
        reply.view('web/html/web-result/list', {meta:meta});

    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'result' }
    ],
    handler: function(request, reply) {
        let result = request.pre.result;
        if (!result) {
            return reply(Boom.notFound('result is not be found'));
        }
        let meta = {}
        if(result.attrs && result.attrs.title){
            meta.title = result.attrs.title || result.title
            meta.description = result.attrs.description || result.title
        }
        return reply.view('web/html/web-result/view', { result: result, meta: meta });
    },
}

/**
 * Middleware
 */
function getItem(request, reply) {
    const _id = request.params._id;
    let options = {
        _id: request.params._id,
        
    };
    let promise = Result.findOne(options).exec();
    promise.then(function(result) {
        reply(result);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
