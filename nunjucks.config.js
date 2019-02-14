import crypto from 'crypto';

module.exports = function(env){

  env.addFilter('base64', function(val){
    return crypto.createHash('sha1').update(val).digest('hex').slice(0,7);
  }, false);

};
