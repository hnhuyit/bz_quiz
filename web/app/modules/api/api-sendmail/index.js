'use strict';

const SendmailController = require('./controller/sendmail.controller.js');

const internals = {
};

exports.register = function (server, options, next) {
    var config = server.configManager;
    let queue = server.plugins['hapi-kue'];
    let emailHelper = require('./util/mail')(server, options);
    
    server.expose('sendMail', emailHelper.sendMail);

    server.route({
        method: 'GET',
        path: '/sendmail',

        config: SendmailController.index
    });

    server.route({
        method: 'POST',
        path: '/sendmail',
        config: SendmailController.sendmail
    });

    queue.processJob('api-sendmail', function (job, done) {
        console.log('receive message');
        console.log(job.data);
        let emailData = job.data;
        emailHelper.sendMail(emailData);
        done();

    });

    next();
};

exports.register.attributes = {
    name: 'api-sendmail'
};
