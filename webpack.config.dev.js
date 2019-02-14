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
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'cheap-module-eval-source-map',
  node: {
    fs: 'empty'
  },
  entry: [
    // ES2015 polyfills
    'babel-polyfill',
    // necessary for hot reloading with IE:
    'eventsource-polyfill',
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    // your code:
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: require('./webpack.rules.js')
  }
};
