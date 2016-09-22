var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var dest = './public',
    src = './src';

var envConfig = require('config');
var WebpackStrip = require('strip-loader');
var gutil = require('gulp-util');

function getPlugins() {
    var plugins = [
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ];
    if(typeof process.env.noCompress !== 'undefined' && process.env.noCompress === 'true') {
        plugins = [];
        gutil.log('will not compress');
    } else {
        gutil.log('will compress');
    }
    return plugins;
}

function getLoaders() {
    var loaders = [
        {
            test: /\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['react', 'es2015']
            }
        },
        {
            /**
             * Replace ${apiUrl} in util.jsx file
             */
            test: /util\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'string-replace',
            query: {
                search: '${apiUrl}',
                replace: envConfig.get('api.browserUrl')
            }
        },
        {
            /**
             * Replace ${cdnUrl} in all jsx files
             */
            test: /\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'string-replace',
            query: {
                search: '${cdnUrl}',
                replace: envConfig.get('cdnUrl')
            }
        },
        {
            /**
             * Replace ${imgCdnUrl} in all jsx files
             */
            test: /\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'string-replace',
            query: {
                search: '${imgCdnUrl}',
                replace: envConfig.get('cdnImgUrl')
            }
        },
        {
            /**
             * Replace ${blogUrl} in util.jsx file
             */
            test: /util\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'string-replace',
            query: {
                search: '${blogUrl}',
                replace: envConfig.get('blog.url')
            }
        }
    ];
    if(envConfig.get('strip-logs') === true) {
        loaders.push({
            test: /\.jsx?$/,
            loader: WebpackStrip.loader('console.log')
        });
    }
    return loaders;
}
module.exports = [
    {
        entry: null,
        output: {
            path: path.join(__dirname, dest, '/javascripts/client'),
            filename: '[name]-client.js'
        },
        plugins: getPlugins(),
        module: {
            loaders: getLoaders()
        }
    },
    {
        entry: {
            "app": src + "/app-server.js"
        },
        output: {
            path: path.join(__dirname, dest, '/javascripts'),
            filename: '[name].js'
        },
        plugins: getPlugins(),
        module: {
            loaders: getLoaders()
        }
    }
];
