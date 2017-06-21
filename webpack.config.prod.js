var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

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
            },
            {
                test: /\.s?css$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
           'process.env': {
               NODE_ENV: JSON.stringify('production')
           }
       }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            drop_console: false,
          }
        }),
        new CopyWebpackPlugin([
           {from: 'client/src/assets', to: 'assets'}
       ])
    ]
}
