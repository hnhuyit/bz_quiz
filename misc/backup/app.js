var moment = require('moment');
var path = require('path');
var exec = require('child_process').exec;
var config = require('./config.js');

var kue = require('kue-scheduler');
var Queue = kue.createQueue();
var child;
//create a job instance
var job = Queue
            .createJob('backupmongo', {})
            .attempts(3)
            .priority('normal');

Queue.every('2 hours', job);


Queue.process('backupmongo', function(job, done) {
	let d = moment().format('MMMM-Do-YYYY-h:mm:ss-a');
	let dest = config.dest + path.sep + config.db.name + '-' + d + '.archive' ;


	child = exec(`mongodump -d ${config.db.name} --archive=${dest}` , function (error, stdout, stderr) {
	  console.log('stdout: ' + stdout);
	  console.log('stderr: ' + stderr);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }
	  done();
	});

    
});