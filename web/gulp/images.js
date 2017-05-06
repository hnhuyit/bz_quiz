var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    imagemin    = require('gulp-imagemin'),
    cache       = require('gulp-cache'),
    notify      = require('gulp-notify');

const settings = require(BASE_PATH + '/gulp/settings');

gulp.task('images', ['clean'], function() {
    return gulp.src(settings.image.src)
        .pipe(plumber())
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(settings.image.dst))
        .pipe(notify({ message: 'Images task complete' }));
});


