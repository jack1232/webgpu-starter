const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require('fs');
const glob = require("glob");

const entry = glob.sync("src/ts/*.ts")
    .reduce((x, y) => Object.assign(x, {
        [y.split('/')[2].split('.')[0]]: './' + y,
    }), {});

let htmlPageNames = [];
const pages = fs.readdirSync('./src/html');
pages.forEach(page => {
    if(page.endsWith('.html')){
        htmlPageNames.push(page.split('.html')[0]);
    }
});

module.exports = {
    entry,
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
    /*plugins: htmlPageNames.map(name => {
        return new HtmlWebpackPlugin({
            template: `./src/html/${name}.html`, // relative path to the html files
            filename: `${name}.html`, // output html files
            chunks: [`${name}`], // respective js files
            inject: false,
        });
    })*/
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/html/index.html',
            inject: false,
        }),
    ]
};
