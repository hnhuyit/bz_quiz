var gulp = require('gulp'),
    del = require('del');

const settings = require(BASE_PATH + '/gulp/settings');
var dirs = [settings.asset.dist + '/**'];

gulp.task('clean', function(cb) {
    return del(dirs, cb)
});