var gulp = require('gulp');
var RunSequence = require('run-sequence');

gulp.task('default',function(cb){
    return RunSequence(['watch', 'start']);
});