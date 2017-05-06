var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    notify      = require('gulp-notify'),
    rename      = require('gulp-rename'),
    jscs        = require('gulp-jscs'),
    concat      = require('gulp-concat'),
    stylish = require('jshint-stylish'),
    path = require('path'),
    configManager = require('kea-config'),
    asset = require(BASE_PATH + '/app/utils/asset');
var settings = require(BASE_PATH + '/gulp/settings');


gulp.task('scripts', function() {

    configManager.setup(settings.config.path);
    var assetsJsDev = configManager.get('web.assets.js');

    configManager.init(path.join(settings.config.path, 'production.conf.js'));
    var assetsJsBuild = configManager.get('web.assets.js');

    //get first js in production
    var jsBuild = path.parse(assetsJsBuild[0]);
   
    var assetsJs = asset.getAssets(assetsJsDev);
    assetsJs = assetsJs.map(function(item){
        return path.join(BASE_PATH, item);
    });
    return gulp.src((assetsJs))
        .pipe(plumber())
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter(stylish))
        // .pipe(jscs())
        // .pipe(jscs.reporter())
        .pipe(concat(jsBuild.base.replace('.min.','.')))
        .pipe(gulp.dest(path.join(BASE_PATH, jsBuild.dir) ))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(path.join(BASE_PATH, jsBuild.dir) ))
        .pipe(notify({ message: 'Scripts task complete' }));
});