'use strict';
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

exports.register = function(server, options, next) {

    server.route({
        method: 'GET',
        path: '/say-hello',
        config: {
            handler: function (request, reply) {
                let mail = request.server.plugins['api-sendmail'];
                var data = {
                    "from": {
                        "name": "chung",
                        "address": "chung.gkh@gmail.com"
                    },
                    "to": [
                        {
                        "name": "chung",
                        "address": "chung.gkh@gmail.com"
                        }
                    ],
                    
                    "subject": "hello sendmail contact",
                    "html": "string",
                    "template": {
                        "name": "contact",
                        "context": {
                            "name":"chung",
                            "email":"chung.gkh@gmail.com",
                            "message": "hello messag"
                        }
                    },
                    "text": "string"
                    };
                mail.sendMail(data);
                reply({});
            }
        }
    });
    
    next();
};
exports.register.attributes = {
    name: 'web-test'
};
