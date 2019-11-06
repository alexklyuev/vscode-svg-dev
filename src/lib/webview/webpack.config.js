// @ts-check

const path = require('path');

const isDevelopment = false;

/**@type {import('webpack').Configuration}*/
module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: __dirname + '/main.ts',
    output: {
        path: path.resolve(__dirname, '../../../out'),
        filename: 'webview.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: __dirname + '/tsconfig.json',
                }
            }
        ],
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            '@': path.resolve(__dirname, '..'),
        },
    },
};
