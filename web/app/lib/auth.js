'use strict'

const AuthJwt2 = require('hapi-auth-jwt2');

const Pack = require(global.BASE_PATH + '/package');
const User = require(BASE_PATH + '/app/modules/api/api-user/model/user.model');
const Session = require(BASE_PATH + '/app/modules/api/api-session/model/session.model');

exports.register = function (server, options, next) {

    var config = server.configManager;
    let cmsName = config.get("web.name");

    let cookieKey = cmsName + "-token";
    var isUseRedis = config.get('web.isUseRedis');

    function validate(decoded, request, callback) {
        if (isUseRedis) {
            const redisClient = server.redis;
            redisClient.get(decoded.id, function (rediserror, result) {
                if (rediserror) {
                    server.log(['error', 'redis', 'validateauth'], rediserror);
                }
                let session;
                if (result) {
                    session = JSON.parse(result);
                    // console.log(session);
                } else {
                    return callback(rediserror, false);
                }
                if (session.valid === true) {
                    return callback(rediserror, true);
                } else {
                    return callback(rediserror, false);
                }
            });
        } else {
            if (decoded.id) {
                Session
                    .findOne({
                        id: decoded.id
                    })
                    .lean()
                    .then(session => {
                        if (session) {
                            return callback(null, true);
                        } else {
                            return callback(null, false);
                        }
                    })
                    .catch(err => {
                        return callback(err, false);
                    })
            } else {
                return callback(null, true);
            }
        }
    }

    function registerJwtAuth2(err) {
        if (err) {
            console.log(err);
        }
        server.auth.strategy('jwt', 'jwt', 'optional', {
            key: config.get('web.jwt.secret'),
            validateFunc: validate,
            verifyOptions: { ignoreExpiration: true, algorithms: ['HS256'] },
            cookieKey: cookieKey,
            urlKey: cookieKey,
            headerKey: cookieKey
        });

        return next();
    };

    server.register(AuthJwt2, registerJwtAuth2);


}
exports.register.attributes = {
    name: 'app-auth-jwt2',
    dependencies: ['app-redis']
};