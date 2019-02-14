var env = require('dotenv').config().parsed;
var argv = require('yargs').argv;

module.exports = {
  'PORT': JSON.stringify(env.PORT),
  'NODE_ENV': JSON.stringify(argv.env),
  'API_URL': JSON.stringify(env.API_URL),
};