module.exports = {
    entry: './app.js',
    output: { filename: 'bundle.js' },
    devtool: "cheap-eval-source-map",
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    }
};
