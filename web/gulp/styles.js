'use strict'

var asset = require(BASE_PATH + '/app/utils/asset');
var gulp = require('gulp');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var concat      = require('gulp-concat');
var configManager = require('kea-config');
var path = require('path');
var settings = require(BASE_PATH + '/gulp/settings');

configManager.setup(settings.config.path);
 
gulp.task('styles', function () {

    var assetsCssDev = configManager.get('web.assets.css');
    configManager.init(path.join(settings.config.path, 'production.conf.js'));
    var assetsCssBuild = configManager.get('web.assets.css');
     //get first css in production
    var cssBuild = path.parse(assetsCssBuild[0]);
    var assetsCss = asset.getAssets(assetsCssDev);

    assetsCss = assetsCss.map(function(item){
        return path.join(BASE_PATH, item);
    });

    return gulp.src(assetsCss)
        .pipe(concat(cssBuild.base.replace('.min.','.')))
        .pipe(gulp.dest(path.join(BASE_PATH, cssBuild.dir) ))
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(BASE_PATH, cssBuild.dir) ));

});

