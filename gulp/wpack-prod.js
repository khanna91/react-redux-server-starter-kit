var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var path = require('path');
var fs = require('fs');
var toStringOption = {
    //context: false,
    hash: false,
    version: false,
    timings: true,
    assets: false,
    chunks: true,
    chunkModules: false,
    modules: false,
    children: false,
    cached: false,
    reasons: false,
    source: false,
    errorDetails: false,
    chunkOrigins: false,
    modulesSort: false,
    chunksSort: false,
    assetsSort: false,
    colors: true
};

module.exports = function (webpackConfig) {
    return function (callback) {
        // run webpack
        webpack(webpackConfig).run(function(err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack", err);
            } else {
                printStats(stats.stats['0']);
                printStats(stats.stats['1']);
                callback();
            }
        });
    };
    function printStats(stats) {
        var out = stats.toString(toStringOption);
        if (out.length < 5000) {
            gutil.log("[webpack]", out);
        } else {
            var endTime = stats.endTime;
            var startTime = stats.startTime;
            gutil.log("[webpack] First time build successful. [Time] ", (endTime - startTime) + 'ms');
        }
    }
};
