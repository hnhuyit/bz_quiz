'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Bcrypt = require('bcrypt');
const pagination = require('pagination');
const _ = require('lodash');
const crypto = require('crypto');
const regexp = require(BASE_PATH + '/app/utils/regexp');



exports.getAll = {
    pre: [{
        method: getOptions,
        assign: 'options'
    }],
    handler: function (request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage = config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');

        let options = request.pre.options;

        User.find(options).sort('id').paginate(page, itemsPerPage, function (err, items, total) {
            if (err) {
                request.log(['error', 'list', 'user'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });
    },
    description: 'List User',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}


exports.changeStatus = {
    handler: function (request, reply) {

        User.update({ _id: request.params.id }, { $set: { status: request.params.status } }, function (err) {
            if (err) {
                return reply(Boom.forbidden("403"));
            }
        });
        return reply.redirect('/user/list');
    },
}

exports.edit = {
    pre: [
        { method: getById, assign: 'user' }
    ],
    handler: function (request, reply) {
        let user = request.pre.user;
        if (user) {
            return reply(user);
        } else {
            reply(Boom.notFound('User is not found'));
        }
    }
}

exports.save = {
    pre: [
        { method: getUserByEmail, assign: 'userByEmail' }
    ],
    handler: function (request, reply) {
        if (request.pre.userByEmail) {
            return reply(Boom.badRequest('Email taken'));
        }
        if (request.payload.password != request.payload.cfpassword) {
            return reply(Boom.badRequest('Confirm new password does not match'));
        }
        delete request.payload.cfpassword;

        let user = new User(request.payload);
        user.provider = 'local';
        user.hashPassword(request.payload.password, function (err, hash) {
            user.password = hash;
            // const token = crypto.randomBytes(20).toString('hex');
            // user.activeToken = token;
            const promise = user.save();
            promise.then(user => {
                user = user.toObject();
                delete user.password;
                //@TODOsend email welcome here
                return reply(user);
            }).catch(err => {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        });
    },
    validate: {
        payload: {
            name: Joi.string().required().description('Name'),
            email: Joi.string().email().required().description('Email'),
            password: Joi.string().description('Password'),
            cfpassword: Joi.string(),
            status: Joi.number().integer().min(0).max(1),
            roles: Joi.any().description('Roles'),
            phone: Joi.any().description('Phone'),
            address: Joi.any().description('Address'),
        }
    }
}


exports.update = {
    pre: [
        { method: getById, assign: 'user' }
    ],
    handler: function (request, reply) {
        let user = request.pre.user;
        if (!request.payload.password) {
            delete request.payload.password;
        } else if (request.payload.password !== request.payload.cfpassword) {
            return reply(Boom.badRequest('Confirm new password does not match'));
        }
        delete request.payload.cfpassword;
        console.log('request', request.payload);
        console.log('user', user);
        user = _.assignIn(user, request.payload);
        console.log(user);
        let saveUser = function (user) {
            let promise = user.save();
            promise.then(function (user) {
                reply(user);
            }).catch(function (err) {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
        if (request.payload.password) {
            user.hashPassword(request.payload.password, function (err, hash) {
                user.password = hash;
                saveUser(user);

            });
        } else {
            saveUser(user);
        }
    },
    validate: {
        payload: {
            _id: Joi.string().description('MongoID'),
            name: Joi.string().required().description('Name'),
            email: Joi.string().email().required().description('Email'),
            password: Joi.any().description('Password'),
            cfpassword: Joi.any(),
            status: Joi.number().integer().min(0).max(1),
            roles: Joi.any().description('Roles'),
            phone: Joi.any().description('Phone'),
            address: Joi.any().description('Address'),
        },
        options: {
            allowUnknown: true
        }
    }
}

exports.delete = {
    pre: [
        { method: getById, assign: 'user' }
    ],
    handler: function (request, reply) {
        const user = request.pre.user;
        user.remove((err) => {
            return reply(user);
        });
    }
}


exports.moveToTrash = {
    pre: [{
        method: getById,
        assign: 'user'
    }],
    handler: function (request, reply) {

        const user = request.pre.user;
        if (user) {
            user.status = 2;
            user.save().then(function () {
                return reply({
                    status: true,
                    message: 'This user has been move to trash!'
                });
            })
        } else {
            return reply(Boom.notFound('User is not found'));
        }
    }
};


exports.changeStatus = {
    pre: [{
        method: getById,
        assign: 'user'
    }],
    handler: function (request, reply) {

        const user = request.pre.user;
        let status = request.payload.currentStatus == 1 ? 0 : 1;
        if (user) {
            user.status = status;
            user.save().then(function () {
                return reply({
                    status: true,
                    message: 'This user has been change status'
                });
            })
        } else {
            return reply(Boom.notFound('User is not found'));
        }
    }
};

exports.changeStatusMultiRows = {
    pre: [
        { method: getRowsSelect, assign: 'currentSelect' },
    ],
    handler: function (request, reply) {
        let status = request.payload.status;
        let filter_ids = request.pre.currentSelect;

        if (filter_ids) {
            User
                .find({
                    _id: {
                        $in: filter_ids
                    }
                })
                .then(function (users) {
                    _.each(users, function (user) {
                        user.status = status;
                        user.save();
                    })
                    return reply({
                        status: 1,
                        message: 'Change status success'
                    })
                })
                .catch(err => {
                    return reply({
                        status: 0,
                        message: Boom.badRequest(ErrorHandler.getErrorMessage(err))
                    })
                });
        }
    }
};

exports.deleteMultiRows = {
    pre: [
        { method: getRowsSelect, assign: 'currentSelect' },
    ],
    handler: function (request, reply) {
        let status = request.payload.status;
        let currentStatusFilter = request.payload.currentStatusFilter;
        let filter_ids = request.pre.currentSelect;
        if (filter_ids) {
            User
                .find({
                    _id: {
                        $in: filter_ids
                    }
                })
                .then(users => {
                    _.each(users, function (user) {
                        if (currentStatusFilter == 2) {
                            // Delete permanent                            
                            user.remove();
                        } else {
                            // Move to trash
                            user.status = 2;
                            user.save();
                        }
                    });

                    return reply({
                        status: 1,
                        message: 'Remove success'
                    })
                })
                .catch(err => {
                    return reply({
                        status: 0,
                        message: Boom.badRequest(ErrorHandler.getErrorMessage(err))
                    })
                });
        }
    }
};

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = User.findOne({ '_id': id });
    promise
        .then(function (user) {
            return reply(user);
        })
        .catch(function (err) {
            request.log(['error'], err);
            return reply.continue();
        })
}

function getUserByEmail(request, reply) {

    const email = request.payload.email;
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            request.log(['error'], err);
        }
        return reply(user);
    });
}

function getRowsSelect(request, reply) {
    let rowsSelected = request.payload.rowsSelected;

    var filter_ids = [];
    _.map(rowsSelected, function (key, value) {
        if (key) {
            filter_ids.push(value);
        }
    });

    reply(filter_ids);
}

function getOptions(request, reply) {
    let options = {
        status: {
            $ne: 2
        }
    };
    let {
        status,
        keyword,
        role
    } = request.payload || request.query;

    let tmpKeyword = regexp.RegExp("", 'i');
    let idKeyword = null;
    if (keyword &&
        keyword.length > 0) {

        options.$or = [{
            email: regexp.RegExp(keyword, 'i')
        },
        {
            name: regexp.RegExp(keyword, 'i')
        }, {
            phone: regexp.RegExp(keyword, 'i')
        }
        ];

        if (mongoose.Types.ObjectId.isValid(keyword)) {
            options.$or.push({
                _id: keyword
            });
        }
    }

    if (status) {
        options.status = status;
    }

    if (role) {
        options.roles = role;
    }
    return reply(options);
}