var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './src/main.js'
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'build')
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
