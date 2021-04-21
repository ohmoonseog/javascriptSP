const path = require('path');
module.exports = {
  SRC: path.resolve(__dirname, '..', 'public'),
  DIST: path.resolve(__dirname, '..', 'public','js', 'dist'),
  DIST_MIN : path.resolve(__dirname, '..', 'public','js', 'dist', 'min'),
  ASSETS: '/dist'
}