const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//必须导入此插件,它负责克隆您定义的任何其他规则，并将它们应用于.vue文件中的相应语言块
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

module.exports = {
  entry: ['/src/index.js'],
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist') // 必须是绝对路径
  },
  resolve: {
    // 后缀名自动补全,当导入文件的时候可以省略后缀名不写
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@images': path.resolve(__dirname, './src/assets/images')
    }
  },
  // 注意loader的顺序是从右往左执行的，最后一个loader的执行结果传给前一个loader，然后一次执行
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|bmp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 10 * 1024, // 限制图片资源大小,小于10kb的图片会以 base64 编码输出,大于此限制值的会以拷贝方式(file-loader)放到 'outputPath'指定目录下
              name: '[name].[ext]',
              outputPath: 'images/' //指定图片资源输出路径,不指定默认直接放到dist目录下,此时这里是 dist/images/
            }
          },
          // 图片压缩配置
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            outputPath: 'fonts/',
            name: '[name][hash:8].[ext]'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: '我的网页', // 设置document.title
      template: './index.html', // 模板文件
      filename: 'index.html', // 文件名
      hash: true, // 避免缓存
      inject: 'body', // script标签插入html的位置，body或head
      minify: {
        removeComments: true // 移除HTML中的注释
      }
    }),
    new webpack.DefinePlugin({
      env: process.env.ENV
    })
  ]
}
