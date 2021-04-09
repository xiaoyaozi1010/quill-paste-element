const webpack = require('webpack');
const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: './index.js',
  context: path.resolve(__dirname, './'),
  output: {
    filename: "paste-element.js",
    library: 'pasteElement',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    quill: 'quill',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 2,
                  useESModules: true,
                }
              ]
            ],
          }
        }
      }
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      'screw-ie8': true,
      sourceMap: true,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: 'paste-element.js.map',
    }),
  ],
  devtool: 'inline-source-map'
}
