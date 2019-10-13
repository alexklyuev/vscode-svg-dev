// @ts-check

const path = require('path');

const isDevelopment = true;

/**
 * @returns {webpack.Configuration}
 */
module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: __dirname + '/main.ts',
    output: {
        path: path.resolve(__dirname, '../../out/client'),
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
        extensions: ['.ts'],
        alias: {
            '@': path.resolve(__dirname, '../../src/lib'),
        },
    },
};
