const path = require('path');
const { SRC, DIST, ASSETS } = require('./paths');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  entry : {
    cgv_externalLib_bundle           : path.resolve(SRC, 'js', 'index.cgv.externalLib.js'),
    cgv_bundle                       : path.resolve(SRC, 'js', 'index.cgv.js'),
    fanpage_core_min                 : path.resolve(SRC, 'js', 'fanpage.core-1.0.0.js'),
    mainInfoView_min                 : path.resolve(SRC, 'js', 'view/mainInfoView.js'),
    fanpageContentsDetail_min        : path.resolve(SRC, 'js', 'view/fanpageContentsDetail.js'),
    stillCutViewer_min               : path.resolve(SRC, 'js', 'view/stillCutViewer.js'),
    searchMoviePeoplePhotoViewer_min : path.resolve(SRC, 'js', 'view/searchMoviePeoplePhotoViewer.js'),
    lodash_min                       : path.resolve(SRC, 'js', './lib/lodash.js'),
  },
  output : {
    path : DIST,
    filename : '[name].js',
    publicPath : ASSETS
  },
  module : {
    rules : [ 
    ],
  },
  plugins : [
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: [path.join(__dirname,'dist')]
    })
  ]
}