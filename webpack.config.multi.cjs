const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 컴포넌트 설정
const components = {
  'product-slider': {
    entry: './app/components/ui/product/ProductSliderSkin.tsx',
    name: 'ProductSliderSkin',
    filename: 'product-slider-skin'
  },
  'shop-product-list': {
    entry: './app/components/ui/product/ShopProductListSkin.tsx',
    name: 'ShopProductListSkin',
    filename: 'shop-product-list-skin'
  },
  'login': {
    entry: './app/components/ui/auth/LoginSkin.tsx',
    name: 'login-skin',
    filename: 'login-skin'
  },
  'signup': {
    entry: './app/components/ui/auth/SignupSkin.tsx',
    name: 'signup-skin',
    filename: 'signup-skin'
  },
  'notice': {
    entry: './app/components/ui/notice/NoticeSkin.tsx',
    name: 'NoticeSkin',
    filename: 'notice-skin'
  },
  'key-visual-slider': {
    entry: './app/components/ui/slider/KeyVisualSliderSkin.tsx',
    name: 'MainBannerSkin',
    filename: 'key-visual-slider-skin'
  },
  'quick-menu': {
    entry: './app/components/ui/nav/QuickMenuSkin.tsx',
    name: 'QuickMenu',
    filename: 'quick-menu-skin'
  },
  'text-banner': {
    entry: './app/components/ui/banner/TextBannerSkin.tsx',
    name: 'TextBannerSection',
    filename: 'text-banner-skin'
  },
  'brand-story': {
    entry: './app/components/ui/brand/BrandStorySkin.tsx',
    name: 'brand-story-skin',
    filename: 'brand-story-skin'
  },
  'product-detail': {
    entry: './app/components/ui/product/ProductDetailSkin.tsx',
    name: 'product-detail-skin',
    filename: 'product-detail-skin'
  },
  'banner-image-media': {
    entry: './app/components/ui/banner/BannerImageMediaSkin.tsx',
    name: 'banner-image-media-skin',
    filename: 'banner-image-media-skin'
  },
  'cart': {
    entry: './app/components/ui/cart/CartSkin.tsx',
    name: 'cart-skin',
    filename: 'cart-skin'
  },
  'my-order-list': {
    entry: './app/components/ui/mypage/MyOrderListSkin.tsx',
    name: 'my-order-list-skin',
    filename: 'my-order-list-skin'
  },
  'my-info': {
    entry: './app/components/ui/mypage/MyInfoSkin.tsx',
    name: 'my-info-skin',
    filename: 'my-info-skin'
  },
  'notice-list': {
    entry: './app/components/ui/notice/NoticeListSkin.tsx',
    name: 'notice-list-skin',
    filename: 'notice-list-skin'
  },
  'notice-detail': {
    entry: './app/components/ui/notice/NoticeDetailSkin.tsx',
    name: 'notice-detail-skin',
    filename: 'notice-detail-skin'
  },
  'notice-integrated': {
    entry: './app/components/ui/notice/NoticeIntegratedSkin.tsx',
    name: 'notice-integrated-skin',
    filename: 'notice-integrated-skin'
  }
  // 추후 다른 컴포넌트들 추가 가능
};

// CLI에서 컴포넌트 이름 가져오기
const componentName = process.env.COMPONENT || 'all';

// 단일 컴포넌트용 설정 생성 함수
function createConfig(key, component) {
  return {
    entry: component.entry,
    output: {
      path: path.resolve(__dirname, 'dist', key),
      filename: `${component.filename}.umd.js`,
      library: {
        name: component.name,
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
      // Swiper, GSAP, ScrollTrigger는 번들에 포함하도록 externals에서 제외
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
        filename: `${component.filename}.css`
      })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false,
            },
          },
        }),
        new CssMinimizerPlugin()
      ]
    },
    mode: 'production'
  };
}

// 설정 내보내기
if (componentName === 'all') {
  // 모든 컴포넌트 빌드
  module.exports = Object.entries(components).map(([key, component]) => 
    createConfig(key, component)
  );
} else if (components[componentName]) {
  // 특정 컴포넌트만 빌드
  module.exports = createConfig(componentName, components[componentName]);
} else {
  throw new Error(`Unknown component: ${componentName}. Available components: ${Object.keys(components).join(', ')}`);
}