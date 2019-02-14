require('ignore-styles');
require('babel-register')({
  "presets": "env"
});

const path              = require('path');
const crypto            = require('crypto');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg               = require('./package.json');
const App               = require('./src/js/').default;
const staticfiles       = require('./webpack.static.js');
const sample            = require('./dist/static/api/sample.json');

let base64 = crypto.createHash('sha1').update(pkg.version).digest('hex').slice(0,7);
let app_ssr = new App().render({
  tours: sample
});

module.exports = {
  devtool: 'source-map',
  node: {
    fs: 'empty'
  },
  entry: [
    // ES2015 polyfills
    'babel-polyfill',
    // your code:
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('./webpack.env.js')
    }),
    new HtmlWebpackPlugin({
      inject: false,
      app_ssr: app_ssr,
      title: pkg.description,
      js: staticfiles.js.map(src => src+'?'+base64),
      css: staticfiles.css.map(src => src+'?'+base64),
      template: path.join(__dirname, 'index.tpl.ejs')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    rules: require('./webpack.rules.js')
  }
};
