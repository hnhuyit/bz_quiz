var gulp        = require('gulp'),
    livereload  = require('gulp-livereload');

var staticPathDev = './';
gulp.task('watch', function() {

    // Create LiveReload server
    livereload.listen();

    gulp.watch('./app/**/*.js', ['jscs']);

    gulp.watch([('./app/modules/*/view/client/*')]).on('change', livereload.changed);
    // Watch any files in public/assets/, reload on change
    gulp.watch([('./public/assets/css/*'), ('./public/assets/js/*')]).on('change', livereload.changed);

});