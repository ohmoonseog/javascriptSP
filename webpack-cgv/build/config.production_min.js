const { merge } = require('webpack-merge');
module.exports = merge(require('./config.base_min.js'), {
  mode: 'production'
});