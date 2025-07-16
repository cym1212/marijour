const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'signup-skin.umd.js', // UMD 파일명에 .umd 추가
      library: {
        name: 'SignUpSkin',
        type: 'umd',
        export: 'default' // default export 사용
      },
      globalObject: 'this',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    externals: isProduction ? {
      'react': 'React',
      'react-dom': 'ReactDOM'
    } : {}, // 개발모드에서는 externals 없음
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ]
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'signup-skin.css'
      }),
      !isProduction && new HtmlWebpackPlugin({
        template: './test/index.html',
        filename: 'test.html',
        inject: 'body'
      })
    ].filter(Boolean), // 프로덕션에서는 HtmlWebpackPlugin 제거
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      port: 3002, // 다른 서비스와 충돌 방지
      open: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORS 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};