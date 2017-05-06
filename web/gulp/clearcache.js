var gulp  = require('gulp'),
    cache = require('gulp-cache');

gulp.task('cclear', function (done) {
    return cache.clearAll(done);
});