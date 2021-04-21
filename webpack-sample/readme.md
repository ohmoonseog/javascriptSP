강의목록 https://www.youtube.com/watch?v=rbmUFHZt3sg 확인 


>> mkdir webpack-sample
>> cd webpack-sample
>> npm init -y
>> code .
>> npm i -D webpack webpack-cli
-- 확인
>> edit package.json
{
  "name": "webpack-sample",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"   <<== 수정 
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {    <<== 추가된 부분 확인 
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^5.1.3",
    "file-loader": "^6.2.0",
    "html-webpack-plugin": "^5.3.1",
    "style-loader": "^2.0.0",
    "webpack": "^5.27.1",
    "webpack-cli": "^4.5.0"  ==> 
  }
}

webpack 기본 설정 파일 등록 
>> edit webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode : 'development',
    entry : {
        main : './src/app.js'
    },
    output : {
        path : path.resolve('./dist'),
        filename : '[name].js',
    },
    module : {
        rules : [
            { 
                test : /\.css$/,
                use : ['style-loader','css-loader']
            },
            { 
                test : /\.png$/,
                use : [{
                    loader : 'file-loader',
                    options : {
                        name : '[name].[ext]?[hash]'
                    }
                }]
            }
        ]
    },
    plugins : [
        new HtmlWebpackPlugin({
            template : './src/index.html'
        }),
        new CleanWebpackPlugin()

    ]
}




>> npm i -D css-loader
>> npm i -D style-loader
>> npm i -D file-loader 
>> npm i html-webpack-plugin -D
>> npm i -D clean-webpack-plugin