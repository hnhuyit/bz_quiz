'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const JWT = require('jsonwebtoken');
const aguid = require('aguid');
const crypto = require('crypto');
const UserEmail = require('../util/user-email');

exports.index = {
    auth: false,
    handler: function (request, reply) {
        return reply({ status: true, msg: 'It works' });
    },
    description: 'Service status',
    tags: ['api']
}

exports.verifyemail = {
    pre: [
        { method: getUserByEmail, assign: 'userByEmail' }
    ],
    handler: function (request, reply) {
        if (request.pre.userByEmail) {
            return reply(Boom.badRequest('Email is exist'));
        }
        reply({ status: 1, message: 'Email is not exist' });
    },
    description: 'Verify Email Exist',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            email: Joi.string().email().required().description('Email')
        }
    }
}

exports.register = {
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
        let auth = request.server.plugins['api-user'].auth;
        auth.hashPassword(request.payload.password).then(hash => {
            user.password = hash;
            const token = auth.getRandomString(20);
            user.activeToken = token;
            const promise = user.save();
            return promise;
        })
        // .then(user => {
        //     // send email welcome
        //     UserEmail.sendRegisterEmail(request, { name: user.name, address: user.email }, user);
        //     return user;
        // })
        .then(user => {
            user = user.toObject();
            delete user.password;

            return reply(user);
        }).catch(err => {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });

    },
    description: 'User Register',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            name: Joi.string().required().description('Name'),
            email: Joi.string().email().required().description('Email'),
            password: Joi.string().min(5).required().description('Password'),
            cfpassword: Joi.string().min(5).required().description('Confirm Password'),
            roles: Joi.array().description('Roles'),
        }
    }
}

exports.active = {
    handler: function (request, reply) {
        let token = request.query.token;
        let promise = User.findOne({ activeToken: token }).exec();
        promise.then(user => {
            if (!user) {
                return reply(Boom.badRequest('Invalid Token'));
            }
            user.activeToken = '';
            user.status = 1;
            return user.save();
        })
            .then(user => {
                reply({ status: 1 });
            })
            .catch(err => {
                request.log(['error', 'active'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
    },
    description: 'Active User',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        query: {
            token: Joi.string().required().description('Token'),
        }
    }

}

exports.login = {
    handler: function (request, reply) {
        let configManager = request.server.configManager;
        let cookieOptions = configManager.get('web.cookieOptions');
        let cmsName = configManager.get('web.name');

        let cookieKey = cmsName + "-token";
        let { email, password, scope } = request.payload;
        let promise = User.findOne({ email: email }).exec();

        promise
            .then(user => {

                console.log(user, "user");

                if (!user || (user && user.status != 1)) {
                    return reply(Boom.unauthorized("Incorrect email or password"));
                }
                //check scope if exist
                if (scope && !user.roles.includes(scope)) {
                    return reply(Boom.unauthorized("Incorrect email or password"));
                }
                let auth = request.server.plugins['api-user'].auth;

                auth
                    .login(email, password, user)
                    .then(jwtToken => {
                        reply({ token: jwtToken }).header("Authorization", jwtToken).state(cookieKey, jwtToken, cookieOptions);
                    })
                    .catch(err => {
                        request.log(['error', 'login'], err);
                        return reply(Boom.unauthorized("Incorrect email or password"));
                    });

            }).catch(err => {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });


    },
    description: 'User Login',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            email: Joi.string().email().required().description('Email'),
            password: Joi.string().required().description('Password'),
            scope: Joi.string().description('Scope'),
        }
    }

}
exports.facebookLogin = {
    handler: function (request, reply) {
        reply();
    }
}
exports.googleLogin = {
    handler: function (request, reply) {
        reply();
    }
}
exports.logout = {
    auth: 'jwt',
    handler: function (request, reply) {
        var configManager = request.server.configManager;
        let cmsName = configManager.get('web.name');
        let cookieKey = cmsName + "-token";
        var isUseRedis = configManager.get('web.isUseRedis');
        const sessionId = request.auth.credentials.id;
        let auth = request.server.plugins['api-user'].auth;
        auth
            .logout(sessionId)
            .then((session) => {
                let cookieOptions = request.server.configManager.get('web.cookieOptions');
                reply({ status: true }).header("Authorization", '')
                    .unstate(cookieKey, cookieOptions);
            })
            .catch(err => {
                console.log(err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            })

    },
}
exports.forgot = {
    handler: function (request, reply) {
        const email = request.payload.email;
        const promise = User.findOne({ email: email }, '-password').exec();
        let auth = request.server.plugins['api-user'].auth;
        promise.then(user => {
            if (!user) {
                return reply(Boom.notFound('Email is not exist'));
            }
            const token = auth.getRandomString(20);
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 48 * 3600000; // 48 hours
            return user.save();
        })
            .then(user => {
                UserEmail.sendForgotPasswordEmail(request, { name: user.name, address: user.email }, user);
                return reply({ status: 1 });
            })
            .catch(err => {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
    },
    description: 'Forgot Password',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            email: Joi.string().email().required().description('Email')
        }
    }
}
exports.reset = {
    handler: function (request, reply) {
        let { newPassword, confirmNewPassword } = request.payload;
        if (newPassword != confirmNewPassword) {
            return reply(Boom.badRequest('Confirm new password does not match'));
        }
        let token = request.query.token;
        if (!token) {
            return reply(Boom.badRequest('Token is empty'));
        }
        let auth = request.server.plugins['api-user'].auth;
        let promise = User.findOne({ resetPasswordToken: token }).exec();
        promise.then(user => {
            if (!user) {
                reply(Boom.badRequest('Token is incorrect'));
            }
            user.resetPasswordToken = '';
            user.resetPasswordExpires = null;
            return auth.hashPassword(newPassword).then(hash => {
                user.password = hash;
                return user.save();
            });
        })
            .then(user => {
                reply({ status: 1, message: 'Password changed successful.' });
            })
            .catch(err => {
                request.log(['error', 'reset'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });

    },
    description: 'Reset Password',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            newPassword: Joi.string().required().description('New Password'),
            confirmNewPassword: Joi.string().required().description('Confirm Password')
        },
        query: {
            token: Joi.string().required().description('Token'),
        }
    }
}
exports.changepassword = {
    auth: 'jwt',
    pre: [
        { method: getAuthUser, assign: 'user' }
    ],
    handler: function (request, reply) {
        let user = request.pre.user;
        if (!user) {
            return reply(Boom.notFound('User is not found'));
        }
        let { currentPassword, newPassword, confirmNewPassword } = request.payload;
        //validate new password and confirm password
        if (newPassword != confirmNewPassword) {
            return reply(Boom.badRequest('Confirm new password does not match'));
        }
        let auth = request.server.plugins['api-user'].auth;
        auth.compare(currentPassword, user.password).then(valid => {
            return auth.hashPassword(newPassword).then(hash => {
                user.password = hash;
                return user.save();
            });
        })
            .then(user => {
                reply({ status: 1, message: 'Password changed successful.' });
            })
            .catch(err => {
                let errorMessage = ErrorHandler.getErrorMessage(err);
                return reply(Boom.badRequest(errorMessage));
            });

    },
    description: 'Change Password',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            currentPassword: Joi.string().required().description('Current Password'),
            newPassword: Joi.string().required().description('New Password'),
            confirmNewPassword: Joi.string().required().description('Confirm Password')
        }
    }
}
exports.account = {
    pre: [
        { method: getAuthUser, assign: 'user' }
    ],
    auth: {
        strategy: 'jwt',
        scope: ['user', 'admin']
    },
    handler: function (request, reply) {
        const user = request.pre.user;
        if (user) {
            return reply(user);
        }
        reply(Boom.unauthorized('User is not found'));
    }
}
exports.profile = {
    pre: [
        { method: getAuthUser, assign: 'user' }
    ],
    auth: 'jwt',
    handler: function (request, reply) {
        const user = request.pre.user;
        if (user) {
            reply(user);
        }
        reply(Boom.unauthorized('User is not found'));
    }
}
exports.uploadavatar = {
    pre: [
        { method: getAuthUser, assign: 'user' }
    ],
    auth: 'jwt',
    handler: function (request, reply) {
        const user = request.pre.user;
        reply();
    }
}

exports.update = {
    pre: [
        { method: getAuthUser, assign: 'user' }
    ],
    auth: 'jwt',
    handler: function (request, reply) {
        let user = request.pre.user;
        if (!user) {
            reply(Boom.notFound('User is not found'));
        }
        let { name } = request.payload;
        user.name = name;
        user.save().then(user => {
            reply({ status: 1 });
        }).catch(err => {
            request.log(['error', 'update'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        })
    },
    description: 'Update User Profile',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            name: Joi.string().required().description('Name'),
            email: Joi.string().required().description('Email'),
        }
    }
}

/**
 * Middleware
 */

function getAuthUser(request, reply) {

    const id = request.auth.credentials.uid;
    console.log(request.auth.credentials);
    console.log("ID: " + id);
    request.log(['info', 'auth'], id);
    User.findOne({ _id: id }).exec().then(function (user) {
        return reply(user);
    }).catch(err => {
        request.log(['error'], err);
        reply(err);
    });
}
function getUserByEmail(request, reply) {

    const email = request.payload.email;
    User.findOne({ email: email }).exec().then(function (user) {
        return reply(user);
    }).catch(err => {
        request.log(['error'], err);
        reply(err);
    });
}
/**
 * end middleware
 */
