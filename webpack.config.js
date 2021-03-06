module.exports = {
    entry: "./app/index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
        ],
    },
    plugins: [],
    resolve: {
        extensions: ['', '.js']
    },
};
