const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'login-skin.umd.js',  // ✅ .umd.js로 변경
      library: 'LoginSkin',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM'
      }
    },
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
        filename: 'login-skin.css'
      }),
      new HtmlWebpackPlugin({
        template: './test/index.html',
        filename: 'test.html',
        inject: 'body'
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      port: 3000,
      open: true,
      hot: true
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};