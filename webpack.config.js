const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = require('path').resolve;
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const ENTRY = {};

const PLUGINS = [
  new ExtractTextPlugin('css/[name].css'),
  new webpack.optimize.UglifyJsPlugin()
];

// Consider loading this from filesystem directly.
const VIEWS = [
  'home'
];

VIEWS.forEach(view => {
  // Add view as entry point.
  ENTRY[view] = `./src/views/${view}/index.jsx`;

  // Add view as html output.
  PLUGINS.push(new HtmlWebpackPlugin({
    chunks: [view],
    inject: true,
    filename: `${view}.html`,
    template: `./src/views/${view}/${view}.hbs`
  }));
});


module.exports = {
  entry: ENTRY,
  output: {
    filename: 'js/[name].js',
    // the output bundle

    path: resolve(__dirname, 'dist'),

    publicPath: ''
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    // match the output path

    publicPath: '/'
    // match the output `publicPath`
  },

  module: {
    loaders: [
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          {
            loader: 'file-loader',
            query: {
              name: '[name]-[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            query: {
              progressive: true,
              optimizationLevel: 0,
              interlaced: false,
              pngquant: {
                quality: '100',
                speed: 1,
                posterize: 0,
                // floyd: 0.5
              }
            }
          }
        ]
      },
      {
        test: /\.(hbs|html)$/,
        loader: 'handlebars-template-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({loader: ['css-loader', 'sass-loader'].join('!')})
      }
    ],
  },

  plugins: PLUGINS,

  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  }
};