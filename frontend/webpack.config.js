const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8080,
    hot: true,
    liveReload: true,
    watchFiles: ["src/**/*", "public/**/*"],
    proxy: {
      "/users": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/apartments": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/files": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
};
