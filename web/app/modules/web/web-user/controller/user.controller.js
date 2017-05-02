'use strict'

exports.login = {
    auth: false,
    handler: function (request, reply) {
        let meta = {
            title: 'Login',
            description: ''
        }
        // console.log(request.auth)
        if(request.auth.isAuthenticated) {
            return reply.redirect('/');
        }
        reply.view('web/html/web-user/login', meta);
    },
}

exports.register = {
    auth: false,
    handler: function (request, reply) {
        let meta = {
            title: 'Register',
            description: ''
        }
        reply.view('web/html/web-user/register', meta);
    },
}

exports.account = {
    auth: {
        strategy: 'jwt',
    },
    handler: function (request, reply) {
        let meta = {
            title: 'My account',
            description: ''
        }
        reply.view('web/html/web-user/account', meta);
    },
}

exports.forgot = {
    auth: {
        strategy: 'jwt',
    },
    handler: function (request, reply) {
        let meta = {
            title: 'Forgot Password',
            description: ''
        }
        reply.view('web/html/web-user/forgot', meta);
    },
}

exports.reset = {
    auth: {
        strategy: 'jwt',
    },
    handler: function (request, reply) {
        let token = request.query.token;
        let meta = {
            title: 'Reset password',
            description: ''
        }
        reply.view('web/html/web-user/forgot', { token: token, meta: meta });
    },
}

exports.changepassword = {
    auth: {
        strategy: 'jwt',
    },
    handler: function (request, reply) {
        let meta = {
            title: 'Change password',
            description: ''
        }
        reply.view('web/html/web-user/changepassword', meta);
    },
}
