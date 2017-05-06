var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var stylish = require('jshint-stylish');
var notify = require('gulp-notify');
var RunSequence = require('run-sequence');

gulp.task('build',function(cb){
    return RunSequence(['clean','cclear','styles', 'scripts', 'images']);
});