'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const <%= modelName %> = mongoose.model('<%= modelName %>');
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
        <%= modelName %>.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    }
}
exports.edit = {
    pre: [
        { method: getById, assign: '<%= modelItemName %>' }
    ],
    handler: function(request, reply) {
        const <%= modelItemName %> = request.pre.<%= modelItemName %>;
        if (<%= modelItemName %>) {
            return reply(<%= modelItemName %>);
        } else {
            reply(Boom.notFound('<%= modelName %> is not found'));
        }
    },
    description: 'Get <%= modelName %>',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        params: {
            id: Joi.string().required().description('ID'),
        }
    }
}

exports.save = {
    handler: function(request, reply) {
        let <%= modelItemName %> = new <%= modelName %>(request.payload);
        let promise = <%= modelItemName %>.save();
        promise.then(function(<%= modelItemName %>) {
            reply(<%= modelItemName %>);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created <%= modelName %>',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        <% _.forEach(genericObject, function(fieldSetting, field) { 
            if(fieldSetting.type.toLowerCase()=='string' || fieldSetting.type.toLowerCase()=='number' || fieldSetting.type.toLowerCase()=='date'){ 
            %><%= field %>: Joi.<%= fieldSetting.type %>()<% if(fieldSetting.required){%>.required()<% }else{%>.allow('')<%}%>.description('<%= _.startCase(field) %>'),
            <% }
            }); %>
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: '<%= modelItemName %>' }
    ],
    handler: function(request, reply) {
        let <%= modelItemName %> = request.pre.<%= modelItemName %>;
        
        <%= modelItemName %> = _.extend(<%= modelItemName %>, request.payload);
        let promise = <%= modelItemName %>.save();
        promise.then(function(<%= modelItemName %>) {
            reply(<%= modelItemName %>);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update <%= modelName %>',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        <% _.forEach(genericObject, function(fieldSetting, field) { 
            if(fieldSetting.type.toLowerCase()=='string' || fieldSetting.type.toLowerCase()=='number' || fieldSetting.type.toLowerCase()=='date'){
            %><%= field %>: Joi.<%= fieldSetting.type %>()<% if(fieldSetting.required){%>.required()<% }else{%>.allow('')<%}%>.description('<%= _.startCase(field) %>'),
            <% }
            }); %>
            __v: Joi.any().optional().description('Version Key'),
            _id: Joi.string().required().description('MongoID')
        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: '<%= modelItemName %>' }
    ],
    handler: function(request, reply) {
        const <%= modelItemName %> = request.pre.<%= modelItemName %>;
        <%= modelItemName %>.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(<%= modelItemName %>);
        });
    },
    description: 'Delete <%= modelName %>',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        params: {
            id: Joi.string().required().description('ID'),
        }
    }
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = <%= modelName %>.findOne({ '_id': id });
    promise.then(function(<%= modelItemName %>) {
        reply(<%= modelItemName %>);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
