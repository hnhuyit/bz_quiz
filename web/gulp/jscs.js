const gulp = require('gulp');
const jscs = require('gulp-jscs');
const plumber = require('gulp-plumber');

gulp.task('jscs', function () {
    return gulp.src('./app/**/*.js')
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'));
});


