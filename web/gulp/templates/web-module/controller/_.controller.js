'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const <%= modelName %> = mongoose.model('<%= modelName %>');
const _ = require('lodash');
exports.list = {
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
        <%= modelName %>.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply.view('web-<%= moduleName %>/view/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: '<%= modelItemName %>' }
    ],
    handler: function(request, reply) {
        let <%= modelItemName %> = request.pre.<%= modelItemName %>;
        if (!<%= modelItemName %>) {
            return reply(Boom.notFound('<%= modelItemName %> is not be found'));
        }
        let meta = {}
        if(<%= modelItemName %>.attrs && <%= modelItemName %>.attrs.title){
            meta.title = <%= modelItemName %>.attrs.title || <%= modelItemName %>.title
            meta.description = <%= modelItemName %>.attrs.description || <%= modelItemName %>.title
        }
        return reply.view('web-<%= moduleName %>/view/view', { <%= modelItemName %>: <%= modelItemName %>, meta: meta });
    },
}

/**
 * Middleware
 */
function getItem(request, reply) {
    const <% if(slug){ %>slug<% }else{ %>_id<% } %> = request.params.<% if(slug){ %>slug<% }else{ %>_id<% } %>;
    let options = {
        <% if(slug){ %>slug<% }else{ %>_id<% } %>: request.params.<% if(slug){ %>slug<% }else{ %>_id<% } %>,
        <% if(status){%>status: 1<% } %>
    };
    let promise = <%= modelName %>.findOne(options).exec();
    promise.then(function(<%= modelItemName %>) {
        reply(<%= modelItemName %>);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
