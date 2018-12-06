// @ts-check

const webpack = require('webpack');

/**
 * @returns {webpack.Configuration}
 */
module.exports = {
    mode: 'development',
    entry: __dirname + '/main.ts',
    output: {
        path: __dirname,
        filename: 'build/main.js'
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
        extensions: ['.ts']
    },
};
