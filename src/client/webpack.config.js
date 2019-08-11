// @ts-check

const path = require('path');

console.log('--->', path.resolve(__dirname, '../../src/lib/common'));

/**
 * @returns {webpack.Configuration}
 */
module.exports = {
    mode: 'production',
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
            '@common': path.resolve(__dirname, '../../src/lib/common'),
        },
    },
};
