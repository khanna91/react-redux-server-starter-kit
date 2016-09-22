var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var path = require('path');
var fs = require('fs');

var statsFormat = {
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
    return function(){
        return new Promise((resolve, reject) => {
            const compiler = webpack(webpackConfig);

            compiler.run((err, stats) => {
                if (err) {
                    gutil.log('Webpack compiler encountered a fatal error.', err)
                    return reject(err)
                }

                const jsonStats = stats.toJson()
                gutil.log('Webpack compile completed.')
                gutil.log(stats.toString(statsFormat))

                if (jsonStats.errors.length > 0) {
                    gutil.log('Webpack compiler encountered errors.')
                    gutil.log(jsonStats.errors.join('\n'))
                    return reject(new Error('Webpack compiler encountered errors'))
                } else if (jsonStats.warnings.length > 0) {
                    gutil.log('Webpack compiler encountered warnings.')
                    gutil.log(jsonStats.warnings.join('\n'))
                } else {
                    gutil.log('No errors or warnings encountered.')
                }
                resolve(jsonStats)
            })
        })
    };
};
