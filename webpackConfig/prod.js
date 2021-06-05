const merge = require('webpack-merge')
const baseConfig = require('./base')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
/* 该插件主要作用用来分离 css 代码，我们的 css 代码在经过 css-loader，style-loder解析后以字符串的形式存在于js文件中。
这样随着项目的业务扩展，会导致当前js文件会越来越大，并且也会加载的很慢，所以我们这里使用 mini-css-extract-plugin来将
每一个 js 文件中的 css代码单独分离出来，并且支持异步、按需加载。
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
  // optimization: {
  //   minimizer: minimizer,
  //   // 代码分割
  //   splitChunks: {
  //     // 合并前模块文件的体积（单位：KB）
  //     minSize: 10000,
  //     // 最少被引用次数
  //     minChunks: 2,
  //     // 自动命名连接符
  //     automaticNameDelimiter: '.',
  //     cacheGroups: {
  //       vendors: {
  //         name: 'chunk-vendors',
  //         test: /[\\\/]node_modules[\\\/]/,
  //         priority: -10,
  //         chunks: 'initial'
  //       },
  //       common: {
  //         name: 'chunk-common',
  //         minChunks: 2,
  //         priority: -20,
  //         chunks: 'initial',
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        // vue-style-loader类似于style-loader，两者配一个就行了
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
      filename: 'styles/[name].[hash].css' // 指定分离生成的css文件名，hash为了避免缓存
    }),
    new CleanWebpackPlugin()
  ]
})
