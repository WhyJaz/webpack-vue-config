const merge = require('webpack-merge');
const baseConfig = require('./base')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  // 本地开发时，产生的打包文件是在内存中，不是在磁盘上的
  devServer: {
    clientLogLevel: 'none',
    host: 'localhost',
    port: '3000',
    open: true,
    hot: true,
    compress: true // 是否启用压缩
  },
  watchOptions: {
    ignored: /node_modules/, // 忽略不用监听变更的目录
    aggregateTimeout: 500, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
    poll: 1000 // 每秒向系统询问1000次文件是否发生变化
  },
  // 注意loader的顺序是从右往左执行的，最后一个loader的执行结果传给前一个loader，然后一次执行
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        // vue-style-loader类似于style-loader，两者配一个就行了
        use: ['vue-style-loader', 'css-loader',  'sass-loader']
      },
      // {
      //   test: /\.(js|vue)$/,
      //   use: ['eslint-loader'],
      //   include: [path.resolve(__dirname, '../src')]
      // }
    ]
  },
  plugins: [
    new SimpleProgressWebpackPlugin(),
    new FriendlyErrorsPlugin()
  ],
  stats: 'errors-only' // 只在发生错误时输出信息，一般的build过程中的信息不显示
})