const path = require('path');

module.exports = {
    entry: './marquis.screeps.ch/main.ts',
    target: 'node',
    output: {
        filename: './build/main.js',
        path: path.resolve(__dirname, '.'),
        library: 'loop',
        libraryTarget: 'commonjs2'
    },
    devtool: false, // Webpack will otherwise use eval calls (Why anyone would think this is a good idea is beyond me)
    mode: 'development',
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            {
                // test: /\.tsx?$/,
                use: 'ts-loader',
                // exclude: /node_modules/,
            },
        ],
    },
};