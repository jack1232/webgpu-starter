const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require('fs');

var tsEntry = {};
const tsFiles = fs.readdirSync('./src/ts');
tsFiles.forEach(file => {
    if(file.endsWith('.ts')){
        let nm = file.split('.ts')[0];
        tsEntry[nm] = './src/ts/' + nm + '.ts';
    }
});

module.exports = {
    entry: tsEntry,
    output: {
        clean: true,
    },
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg|jpeg)$/i,
                type: "asset/resource",
            },
            {
                // set shader files 
                test: /\.(wgsl|glsl|vs|fs)$/i,
                type: "asset/source",
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/html/index.html',
            inject: false,
        }),
    ]
};
