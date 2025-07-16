const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/KeyVisualSliderSkin.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'key-visual-slider-skin.umd.js',
      library: 'MarijuourKeyVisualSliderSkin',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true,
    },
    externals: {
      'react': {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
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
            {
              loader: 'css-loader',
              options: {
                modules: false,
                importLoaders: 1
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: isProduction ? 'compressed' : 'expanded'
                }
              }
            }
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
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: isProduction ? [
      new MiniCssExtractPlugin({
        filename: 'key-visual-slider-skin.css'
      })
    ] : [],
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: isProduction
    }
  };
};