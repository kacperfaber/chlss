import path from "path";

// TODO: There's an error with the import. I can't use import/from instead of require.

// noinspection WebpackConfigHighlighting
module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        main: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "chlss.js",
        library: "chlss",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
};