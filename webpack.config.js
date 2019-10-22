// @ts-check

const path = require('path');

/**@type {import('webpack').Configuration}*/
module.exports = {
    target: 'node',
    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode',
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            '@': path.resolve(__dirname, './src/lib'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: __dirname + '/tsconfig.json',
                },
            }
        ],
    }
};
