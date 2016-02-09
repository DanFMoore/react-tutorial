var webpack = require("webpack");
var isDev = process.argv.indexOf('--dev') > -1;

module.exports = {
    entry: "./components/browser.js",
    output: {
        path: "./public/scripts",
        filename: "bundle.js"
    },
    // These libraries are included in separate script tags and are available as global variables
    externals: {
        "react": "React",
        "marked": "marked",
        "jquery": "jQuery",
        "react-dom": "ReactDOM",
        "window": "window"
    },
    plugins: isDev ?
        [] :
        [new webpack.optimize.UglifyJsPlugin({minimize: true})],
    devtool: isDev ? 'source-map' : null,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};
