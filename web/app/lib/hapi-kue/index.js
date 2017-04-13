'use strict'
var kue = require('kue-scheduler');

let internals = {};
var queue;

exports.register = function (server, options, next) {

    const config = server.configManager;
    var settings = config.get('web.redisOptions');
    let cmsName = configManager.get('web.name');
    var queue = kue.createQueue({ prefix: cmsName + ':q', redis: settings });
    server.decorate('server', 'kue', queue);
    server.decorate('request', 'kue', queue);
    server.expose('queue', queue);

    server.expose('createJob', internals.createJob);
    server.expose('processJob', internals.processJob);

    next();

}
exports.register.attributes = {
    name: 'hapi-kue'
};


internals.createJob = function (jobName, data, callback) {

    var job = queue.create(jobName, data).save(callback);
    return job;
}

internals.processJob = function (jobName, callback) {
    if (queue) {
        queue.process(jobName, callback);
    }

}
