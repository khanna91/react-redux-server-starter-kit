var dest = './public',
src = './src',
views = 'views',
temp = './temp';

var gulp = require('gulp');
var fs = require('fs');
var runSequence = require('run-sequence');
var webpackWebLocalConfig = require('./webpack.local.config');
var webpackWebProdConfig = require('./webpack.prod.config');

var clientJS = require('./gulp/clientJS');
var webpackLocalTask = require('./gulp/wpack-local');
var webpackProdTask = require('./gulp/wpack-prod');

gulp.task('clientJS', clientJS(src, dest));

gulp.task('local-webpacker', webpackLocalTask(webpackWebLocalConfig));

gulp.task('prod-webpacker', webpackProdTask(webpackWebProdConfig));

gulp.task('build-dev', function () {
    runSequence('clientJS', ['local-webpacker']);
});

gulp.task('build-prod', function () {
    runSequence('clientJS', ['prod-webpacker']);
});
