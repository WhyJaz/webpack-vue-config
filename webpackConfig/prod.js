const merge = require('webpack-merge')
const baseConfig = require('./base')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/* 该插件主要作用用来分离 css 代码，我们的 css 代码在经过 css-loader，style-loder解析后以字符串的形式存在于js文件中。
这样随着项目的业务扩展，会导致当前js文件会越来越大，并且也会加载的很慢，所以我们这里使用 mini-css-extract-plugin来将
打包出来的js文件单独打包出对应的css文件，并且支持异步、按需加载。
*/
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')
// let minimizer = [
//   // CSS压缩
//   new OptimizeCSSAssetsPlugin({})
// ]

// if (process.env.ENV === 'prod') {
//   minimizer.push(
//     new TerserPlugin({
//       chunkFilter: () => true,
//       warningsFilter: () => true,
//       extractComments: false,
//       sourceMap: true,
//       cache: true,
//       parallel: true
//     })
//   )
// }

module.exports = merge(baseConfig, {
  mode: 'production',
  // output: {
  //   publicPath: '/'
  // },
  // 打包时，不打包以下引入的包，而是在html中通过cdn引入
  externals: {
    'vue': 'Vue',
    'element-ui': 'ELEMENT',
  },
  optimization: {
    // minimizer: minimizer,
    // 代码分割
    splitChunks: {
      // 合并前模块文件的体积（单位：KB）
      minSize: 0,
      // 最少被引用次数，默认为1
      minChunks: 1,
      // 打包命名分割符
      automaticNameDelimiter: '-',
      // 设置缓存的chunks
      cacheGroups: {
        // vendors: {
        //   name: 'chunk-vendors',  // 要缓存的 分隔出来的 chunk 名称 
        //   test: /[\\\/]node_modules[\\\/]/, // 正则规则验证，如果符合就提取 chunk
        //   priority: -10, // 先级
        //   chunks: 'initial'
        // },
        // 将所有引入的css或less都单独打包成独立的css文件
        // styles: {
        //   name: 'styles',
        //   test: /\.(c|le)ss$/,
        //   chunks: 'all',
        //   enforce: true,
        // },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          minSize: 0,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true // 是否重用该chunk
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css', // 指定分离生成的css文件名，hash为了避免缓存,contenthash，只要文件内容不变，hash就不会变
      chunkFilename: 'styles/[id].[hash].css'
    }),
    new CleanWebpackPlugin(),
    // 可视化查看打出的每个模块大小
    // new BundleAnalyzerPlugin(),
    // 打包进度条显示
    new ProgressBarPlugin({
      format: '  build [:bar] :percent (:elapsed seconds) :msg',
      clear: false
  })
  ]
})
