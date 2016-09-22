var path = require('path');
var gulp = require('gulp');
var fs = require('fs');
var tap = require('gulp-tap');
var webpack = require('webpack');

var dest = './public',
    src = './src';

var envConfig = require('config');

module.exports = [
    {
        watch: true,
        entry: {            
        },
        output: {
            path: path.join(__dirname, dest, '/javascripts/client'),
            filename: '[name]-client.js'
        },
        devtool: '#eval-source-map',
        module: {
            loaders: [
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
            ]
        }
    },
]
