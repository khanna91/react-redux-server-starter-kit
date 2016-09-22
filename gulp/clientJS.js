var gulp = require('gulp');
var tap = require('gulp-tap');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var privatePagesPath = '../../../src/pages/';
var wait = require('gulp-wait')
var fs = require('fs');

module.exports = function (src, dest) {

    var publicPagesPath = dest + '/javascripts/pages/';

    return function () {

        var entries = {};

        return gulp.src(src + '/pages/*.js')
            .pipe(tap(function(file, t) {
                var name = file.path.split('/');
                name = name[name.length - 1];
                name = name.replace('.js', '');
                entries[name] = publicPagesPath + name + '.js';
                gulp.src(src + '/app-client.js')
                    .pipe(replace('${page}', privatePagesPath + name))
                    .pipe(rename(function (path) {
                        path.basename = name;
                        path.extname = ".js"
                    }))
                    .pipe(gulp.dest(publicPagesPath));
            }))
            .pipe(wait(1000))
            .on('end', function () {
                var desiredExports = [];
                for (i = 0; i < module.parent.children.length; i++) {
                    var child = module.parent.children[i];
                    if (child.filename.endsWith('webpack.local.config.js') || child.filename.endsWith('webpack.prod.config.js')) {

                        desiredExports.push(child.exports[0]);

                        if (desiredExports.length == 2) {
                            break;
                        }
                    }
                }
                if (desiredExports.length != 0) {
                    desiredExports.forEach(function (desiredExport, index) {
                        for (var key in entries) {
                            if (desiredExport.entry == null) {
                                desiredExport.entry = {};
                            }

                            if (typeof desiredExport.entry[key] == 'undefined') {
                                desiredExport.entry[key] = entries[key];
                            }
                        }
                    });
                } else {
                    throw ('not abe to replace jsx entries for webpack.web');
                }
            });
    };
};
