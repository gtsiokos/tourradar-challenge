const path        = require('path');
const webpack     = require('webpack');
const express     = require('express');
const env         = require('dotenv').config().parsed;
const config      = require('./webpack.config.dev');

let app = express();
let compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  stats: {
    colors: true
  },
  index: false,
  serverSideRenderer: true,
  publicPath: config.output.publicPath,

}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/dist', express.static('./dist'));
app.use('/static', express.static('./dist/static'));

app.get('/', (req, res, next) => {
  let filename = path.join(compiler.outputPath, 'index.html');

  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }

    res.set('content-type','text/html');
    res.send(result);
  });
});

app.get('/api', (req, res, next) => {
  res.set('content-type','text/json');
  res.send(require('./dist/static/api/sample.json'));
});

app.listen(7777, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('[localhost:7777] Listen App');
});
