// @ts-check

const path = require('path');

const isDevelopment = false;

/**@type {import('webpack').Configuration}*/
module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: __dirname + '/app/svgdev.ts',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'svgdev.js',
        // publicPath: 'src/lib/webapp/public',
    },
    devServer: {
        contentBase: path.resolve(__dirname, './public'),
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
        // modules: ["src", "node_modules"],
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, '..'),
            '&resolve': path.resolve(__dirname, './resolve'),
        },
    },
};
