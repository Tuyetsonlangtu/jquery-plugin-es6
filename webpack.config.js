const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const reScript = /\.(js|jsx|mjs)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const entry = {
  'berth-right-tools': "./plugin/berth-right-tools/berth-right-tools.js",
  'berth-position-calculation': "./plugin/berth-position-calculation/berth-position-calculation.js",
}

module.exports = env => {
  const isDebug = !(env.production || false);
  console.log("isDebug : ", isDebug);

  const extractSass = new ExtractTextPlugin({
    filename: isDebug ? "[name].css" : "[name].[chunkhash:16].min.css",
  });

  const minimizeCssOptions = {
    discardComments: { removeAll: true },
  };

  return {
    context: path.join(__dirname, 'src'),
    entry: entry,
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isDebug ? '[name].js' : '[name].[chunkhash:16].min.js',
      chunkFilename: isDebug
        ? '[name].chunk.js'
        : '[name].[chunkhash:16].chunk.min.js',
    },
    resolve: {
      modules: ['node_modules', 'src'],
    },
    module: {
      loaders: [
        {
          test: reScript,
          loader: 'babel-loader',
          query: {
            presets: ['env']
          }
        },
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
        {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      ],
      rules: [
        {
          test: reScript,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        },
        {
          test: reStyle,
          use: extractSass.extract({
            use: [{
              loader: "css-loader"
            }, {
              loader: "sass-loader"
            }],
            // use style-loader in development
            fallback: "style-loader"
          })
        }]
    },
    plugins: [
      new CleanWebpackPlugin(['build'], {
        root: __dirname,
        exclude: [''],
        verbose: true,
        dry: false
      }),
      ...(isDebug
        ? []
        : [
          new webpack.optimize.ModuleConcatenationPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
              screw_ie8: true, // React doesn't support IE8
              warnings: false,
              unused: true,
              dead_code: true,
            },
            mangle: {
              screw_ie8: true,
            },
            output: {
              comments: false,
              screw_ie8: true,
            },
          }),
        ]),
      extractSass,
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.min\.css$/,
        cssProcessorOptions: { discardComments: { removeAll: true } }
      }),
    ],
    externals: {
      jquery: 'jQuery',
      moment: 'moment',
      lodash: '_',
    },
    cache: false,
    stats: {
      colors: true
    },
    devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',
  }
}