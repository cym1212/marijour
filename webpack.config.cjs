const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './app/components/ui/product/ProductSliderSkin.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'product-slider-skin.umd.js',
    library: {
      name: 'ProductSliderSkin',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  externals: {
    'react': {
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
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'app'),
      '@/components': path.resolve(__dirname, 'app/components'),
      '@/types': path.resolve(__dirname, 'app/types'),
      'react-router': path.resolve(__dirname, 'app/mocks/react-router.js')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'product-slider-skin.css'
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin()
    ]
  },
  mode: 'production'
};