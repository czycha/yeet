const webpack = require('webpack');
const fs = require('fs');

module.exports = {
    entry: {
        index: "./index.js"
    },
    output: {
        path: __dirname,
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: () => fs.readFileSync('userscript.config.js', 'utf8'),
            raw: true
        })
    ],
    devtool: false
};