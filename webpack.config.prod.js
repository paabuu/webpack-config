var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './client/src/main.js'
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'client/build')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            drop_console: false,
          }
        }),
    ]
}
