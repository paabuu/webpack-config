var NODE_ENV = process.env.NODE_ENV || 'production';
var isDev = NODE_ENV === 'development';

var express = require('express');
var webpack = require('webpack');

var path = require('path');
var app = express();

if (isDev) {
    var webpackMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpackConfig = require('./webpack.config.dev');

    var compiler = webpack(webpackConfig);

    var options = {
        publicPath: '/'
    };

    app.use(webpackMiddleware(compiler, options));

    app.use(webpackHotMiddleware(compiler));

    app.use(express.static('output'));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    var http = require('http');
    var reload = require('reload');

    var server = http.createServer(app);
    reload(server, app);

    server.listen(8080, function() {
        console.log('server is running on port 8080!')
    });
} else {
    app.use(express.static('build'));

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'index.html'))
    });

    app.listen(8081, function() {
        console.log('server is running on port 8081!')
    })
}
