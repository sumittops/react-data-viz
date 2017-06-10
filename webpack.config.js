var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var devMode = process.env.NODE_ENV == 'dev';

var extractSass = new ExtractTextPlugin({
    filename:"[name].css"
});
var config = {
    context: path.resolve(__dirname),
    entry:{
        app:'./index.js'
    },
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'[name].bundle.js'
    },
    watch:devMode,
    devtool:devMode?'sourcemap':'',
    module:{
        rules:[{
            test:/\.js$/,
            loaders:['babel-loader'],
            exclude:/node_modules/
        },{
            test:/\.scss$/,
            use: extractSass.extract({
                use:[{
                    loader:'css-loader'
                },{
                    loader:'sass-loader'
                }],
                fallback:'style-loader'
            })
        },{
            test:/\.json$/,
            loaders:['json-loader'],
            exclude: /node_modules/
        }]
    },
    plugins:[
        // new CleanWebpackPlugin(['dist']),
        extractSass        
    ]
};

module.exports = config;