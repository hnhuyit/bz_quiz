var moment = require('moment');
var path = require('path');
var exec = require('child_process').exec;
var config = require('./config.js');

let d = moment().format('MMMM-Do-YYYY-h:mm:ss-a');
	let dest = config.dest + path.sep + config.db.name + '-' + d + '.archive' ;


	child = exec(`mongodump -d ${config.db.name} --archive=${dest}` , function (error, stdout, stderr) {
	  console.log('stdout: ' + stdout);
	  console.log('stderr: ' + stderr);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }
	
	});