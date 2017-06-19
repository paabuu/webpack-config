var NODE_ENV = process.env.NODE_ENV || 'production';
var isDev = NODE_ENV === 'development';

var express = require('express');
var webpack = require('webpack');
var open = require('open');

var path = require('path');
var app = express();
var route = require('./server/route');

route(app);

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

    app.use(express.static('client/output'));

    var http = require('http');
    var reload = require('reload');

    app.get(/^(?!api).*/, function(req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    var server = http.createServer(app);
    reload(server, app);

    server.listen(8088, function() {
        console.log('server is running on port 8080!');
    });
} else {
    app.use(express.static('client/build'));

    app.get(/^(?!api).*/, function(req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.listen(3000, function() {
        console.log('server is running on port 8081!');
        open('http://127.0.0.1:3000');
    })
}
