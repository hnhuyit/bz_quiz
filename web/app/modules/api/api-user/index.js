'use strict';

const AuthController = require('./controller/auth.controller.js');

exports.register = function (server, options, next) {

   
    var Auth = require('./util/auth');
    server.expose('auth', new Auth(server) );
    
    
    server.route({
        method: ['GET'],
        path: '/user',
        config: AuthController.index,
    });
    server.route({
        method: 'POST',
        path: '/user/login',
        config: AuthController.login,
    });
    server.route({
        method: ['GET'],
        path: '/user/logout',
        config: AuthController.logout,
    });
    server.route({
        method: ['POST'],
        path: '/user/register',
        config: AuthController.register,
    });
    server.route({
        method: ['GET'],
        path: '/user/active',
        config: AuthController.active,
    });

    server.route({
        method: ['POST'],
        path: '/user/forgot',
        config: AuthController.forgot,
    });

    server.route({
        method: 'POST',
        path: '/user/reset',
        config: AuthController.reset, 
    });

    server.route({
        method: 'POST',
        path: '/user/verify/email',
        config: AuthController.verifyemail, 
    });

    server.route({
        method: ['GET'],
        path: '/user/profile/{id}',
        config: AuthController.profile,
        
    });
    server.route({
        method: ['GET'],
        path: '/user/account',
        config: AuthController.account,
        
    });

    server.route({
        method: ['POST'],
        path: '/user/changepassword',
        config: AuthController.changepassword
        
    });
    server.route({
        method: 'POST',
        path: '/user/facebook-login',
        config: AuthController.facebookLogin
    });
    server.route({
        method: 'POST',
        path: '/user/google-login',
        config: AuthController.googleLogin
    });
    server.route({
        method: 'POST',
        path: '/user/updateprofile',
        config: AuthController.update,
        
    });
    server.route({
        method: 'POST',
        path: '/user/uploadavatar',
        config: AuthController.uploadavatar,
        
    });
    return next();
};

exports.register.attributes = {
    name: 'api-user'
};
