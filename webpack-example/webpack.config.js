const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode : 'production',
    watch : true,
    entry : {
        index : './src/index.js',
        about : './src/about.js',
    },
    output : {
        path : path.resolve(__dirname,"public"),
        filename : '[name]_bundle.js'
    },
    module : {
        rules : [
            {
                test : /\.css$/i,
                use : ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins : [
        new HtmlWebpackPlugin({
            template : './src/index.html',
            filename : './index.html',
            chunks : ['index']
        }),
        new HtmlWebpackPlugin({
            template : './src/about.html',
            filename : './about.html',
            chunks : ['about']
        })
    ]
}