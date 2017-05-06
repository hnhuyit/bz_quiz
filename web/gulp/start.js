var gulp = require('gulp')
    , nodemon = require('gulp-nodemon');

gulp.task('start', function () {
    nodemon({
        script: 'app.js',
        ext: 'js html json',
        delay: 5,
        ignore: [
            'public/',
            'var/',
            'node_modules/',
            'app/modules/*/view/client/**'
        ],
        stdout:   true,
        readable: false,
        env: {'NODE_ENV': process.env.NODE_ENV || 'development'}
    })
});
