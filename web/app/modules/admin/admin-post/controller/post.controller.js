'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const _ = require('lodash');
const regexp = require(BASE_PATH + '/app/utils/regexp');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.getAll = {
    pre: [{
        method: getOptions,
        assign: 'options'
    }],
    handler: function(request, reply) {
        let config = request.server.configManager;
        let page = request.query.page || 1;
        let itemsPerPage = config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');

        var options = request.pre.options;

        Post
            .find(options)
            .populate('category')
            .lean().sort('-created')
            .paginate(page, itemsPerPage, function(err, items, total) {
                if (err) {
                    request.log(['error', 'list', 'post'], err);
                    reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                }
                let totalPage = Math.ceil(total / itemsPerPage);
                let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
                reply(dataRes);
            });

    }
}

exports.edit = {
    pre: [
        { method: getById, assign: 'post' }
    ],
    handler: function(request, reply) {
        let post = request.pre.post;
        if (post) {
            return reply(post);
        } else {
            reply(Boom.notFound('Post is not found'));
        }
    }
}

exports.save = {
    handler: function(request, reply) {
        let post = new Post(request.payload);
        let promise = post.save();
        promise.then(function(post) {
            reply(post);
        }).catch(function(err) {
            request.log(['error', 'post'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));

        });
    },
    description: 'Created post',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            title: Joi.string().required().description('Title'),
            teaser: Joi.string().description('Teaser'),
            content: Joi.string().required().description('Content'),
            status: Joi.number().required().description('Status'),
            slug: Joi.string().description('Slug'),
            category: Joi.any().description('Category'),
            feature: Joi.any().description('Feature'),
            thumb: Joi.any().description('Thumms'),
            image: Joi.any().description('Image'),
            attrs: Joi.any().description('Meta')

        }
    }
}

exports.update = {
    pre: [
        { method: getById, assign: 'post' },
    ],
    handler: function(request, reply) {
        let post = request.pre.post;
        post = _.extend(post, request.payload);
        let promise = post.save();
        promise.then(function(post) {
            reply(post);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update post',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            title: Joi.string().required().description('Title'),
            teaser: Joi.string().description('Teaser'),
            content: Joi.string().required().description('Content'),
            status: Joi.number().required().description('Status'),
            slug: Joi.string().description('Slug'),
            modified: Joi.date().required().description('Modified'),
            _id: Joi.string().required().description('MongoID'),
            category: Joi.any().description('Category'),
            feature: Joi.any().description('Feature'),
            thumb: Joi.any().description('Thumms'),
            image: Joi.any().description('Image'),
            attrs: Joi.any().description('Meta'),
            created: Joi.any().description('created'),
        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'post' }
    ],
    handler: function(request, reply) {
        const post = request.pre.post;
        post.remove((err) => {
            return reply(post);
        });
    }
}

exports.moveToTrash = {
    pre: [{
        method: getById,
        assign: 'post'
    }],
    handler: function(request, reply) {
        const post = request.pre.post;
        if (post) {
            post.status = 2;
            post.save().then(function() {
                return reply({
                    status: true,
                    message: 'This post has been move to trash!'
                });
            })
        } else {
            return reply(Boom.notFound('Post is not found'));
        }
    }
};


exports.changeStatus = {
    pre: [{
        method: getById,
        assign: 'post'
    }],
    handler: function(request, reply) {

        const post = request.pre.post;
        let status = request.payload.currentStatus == 1 ? 0 : 1;
        if (post) {
            post.status = status;
            post.save().then(function() {
                return reply({
                    status: true,
                    message: 'This post has been change status'
                });
            })
        } else {
            return reply(Boom.notFound('Post is not found'));
        }
    }
};

exports.changeStatusMultiRows = {
    pre: [
        { method: getRowsSelect, assign: 'currentSelect' },
    ],
    handler: function(request, reply) {
        let status = request.payload.status;
        let filter_ids = request.pre.currentSelect;

        if (filter_ids) {
            Post
                .find({
                    _id: {
                        $in: filter_ids
                    }
                })
                .then(function(posts) {
                    _.each(posts, function(post) {
                        post.status = status;
                        post.save();
                    })
                    return reply({
                        status: 1,
                        message: 'Change status success'
                    })
                })
        }
    }
};

exports.deleteMultiRows = {
    pre: [
        { method: getRowsSelect, assign: 'currentSelect' },
    ],
    handler: function(request, reply) {
        let status = request.payload.status;
        let currentStatusFilter = request.payload.currentStatusFilter;
        let filter_ids = request.pre.currentSelect;
        if (filter_ids) {
            Post
                .find({
                    _id: {
                        $in: filter_ids
                    }
                })
                .then(function(posts) {
                    _.each(posts, function(post) {
                        if (currentStatusFilter == 2) {
                            // Delete permanent                            
                            post.remove();
                        } else {
                            // Move to trash
                            post.status = 2;
                            post.save();
                        }
                    });

                    return reply({
                        status: 1,
                        message: 'Remove success'
                    })
                })
        } else {

        }
    }
};

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Post.findOne({ '_id': id });
    promise
        .then(function(post) {
            reply(post);
        })
        .catch(function(err) {
            request.log(['error'], err);
            return reply.continue();
        })
}

function getRowsSelect(request, reply) {
    let rowsSelected = request.payload.rowsSelected;

    var filter_ids = [];
    _.map(rowsSelected, function(key, value) {
        if (key) {
            filter_ids.push(value);
        }
    });

    reply(filter_ids);
}

function getOptions(request, reply) {
    let {
        status,
        category,
        feature,
        keyword,
    } = request.payload || request.query;
    let options = {
        status: {
            $ne: 2
        }
    };

    let tmpKeyword = regexp.RegExp("", 'i');
    let idKeyword = null;
    if (!keyword) {
        keyword = '';
    }
    if (keyword && keyword.length > 0) {
        tmpKeyword = regexp.RegExp(keyword, 'i');
        if (mongoose.Types.ObjectId.isValid(keyword)) {
            idKeyword = new mongoose.mongo.ObjectId(keyword);
        }
    }
    var andCondition = [];

    if (status) {
        options.status = status;
    }

    if (feature) {
        options.feature = feature;
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
        options.category = new mongoose.mongo.ObjectId(category);
    }
    var orCondition = [{
        title: tmpKeyword
    }, {
        product_code: keyword
    }];

    if (idKeyword) {
        orCondition.push({
            _id: idKeyword
        });
    }

    andCondition.push({
        $or: orCondition
    });

    options.$and = andCondition;
    return reply(options);
}