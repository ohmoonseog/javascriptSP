const path = require('path');
const { SRC, DIST,DIST_MIN, ASSETS } = require('./paths');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  entry: {
    cgv_externalLib_bundle    : path.resolve(SRC, 'js', 'index.cgv.externalLib.js'),
    cgv_bundle                : path.resolve(SRC, 'js', 'index.cgv.js'),
    mainInfoView_min          : path.resolve(SRC, 'js', 'view/mainInfoView.js'),
    fanpageContentsDetail_min : path.resolve(SRC, 'js', 'view/fanpageContentsDetail.js')
  },
  output: {
    path: DIST_MIN,
    filename: '[name].js',
    publicPath: ASSETS
  },
  module: {
    rules: [ 
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: [path.join(__dirname,'dist')]
    })
  ]
}