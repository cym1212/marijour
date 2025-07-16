const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'marijour-skin.umd.js',
      library: {
        name: 'MarijouirSkin',
        type: 'umd',
        export: 'default'
      },
      globalObject: 'this',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
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
          test: /\.(woff|woff2|ttf|eot)$/,
          type: 'asset/inline' // base64로 인라인화
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'marijour-skin.css'
      }),
      !isProduction && new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ].filter(Boolean),
    devServer: {
      port: 3001,
      hot: true,
      open: true
    },
    externals: isProduction ? {
      'react': 'React',
      'react-dom': 'ReactDOM'
    } : {}
  };
};