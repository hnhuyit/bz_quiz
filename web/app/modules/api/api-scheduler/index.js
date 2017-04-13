'use strict';

let moment = require('moment');

exports.register = function (server, options, next) {
    
    let Queue = server.KueScheduler;

    //create a job instance
    /*
    var job = Queue
                .createJob('ping2', {})
                .attempts(3)
                .priority('normal');

    Queue.every('10 seconds', job);

    Queue.process('ping2', function(job, done) {
        let d = moment().format('MMMM-Do-YYYY-h:mm:ss-a');
        console.log('Ping 1 called after 10 seconds at ' + d );
        done();

    });

    Queue.process('ping2', function(job, done) {
        let d = moment().format('MMMM-Do-YYYY-h:mm:ss-a');
        console.log('Ping 2 called after 10 seconds at ' + d );
        done();

    });
    */
    next();
};

exports.register.attributes = {
    name: 'api-scheduler'
};
