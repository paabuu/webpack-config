var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './src/main.js',
        'webpack-hot-middleware/client?reload=true'
    ],
    output: {
        path: path.resolve(__dirname, './output/'),
        filename: 'bundle.js'
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
