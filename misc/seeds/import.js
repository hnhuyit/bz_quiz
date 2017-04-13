'use strict';

var path = require('path');
var exec = require('child_process').exec;
var config = require('./config.js');
var child;

let seedPath = __dirname + path.sep + path.join('data', config.db.name);

child = exec(`mongorestore --noIndexRestore --drop -d ${config.db.name} ${seedPath}` , function (error, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});