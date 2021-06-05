const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//必须导入此插件,它负责克隆您定义的任何其他规则，并将它们应用于.vue文件中的相应语言块
const { VueLoaderPlugin } = require("vue-loader");
/* 该插件主要作用用来分离 css 代码，我们的 css 代码在经过 css-loader，style-loder解析后以字符串的形式存在于js文件中。
这样随着项目的业务扩展，会导致当前js文件会越来越大，并且也会加载的很慢，所以我们这里使用 mini-css-extract-plugin来将
每一个 js 文件中的 css代码单独分离出来，并且支持异步、按需加载。
*/
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin  = require("progress-bar-webpack-plugin") //运行/打包,显示进度条


module.exports = {
  devServer: {
    clientLogLevel: 'none',
    host: 'localhost',
    port: '3000',
    open: true,
    hot: true,
    compress: true // 是否启用压缩
  },
  entry: './src/index.js',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist') // 必须是绝对路径
  },
  resolve: {
    // 后缀名自动补全,当导入文件的时候可以省略后缀名不写
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 注意loader的顺序是从右往左执行的，最后一个loader的执行结果传给前一个loader，然后一次执行
  module: {
    rules: [
      {
        test: /\.css$/,
        // vue-style-loader类似于style-loader，两者配一个就行了
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader', 'sass-loader']
          // sass-loader需要依赖于node-sass，且要保证版本对应才可以
      },
      {
        test: /\.(png|jpg|gif|svg|bmp)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10 * 1024, // 限制图片资源大小,小于10kb的图片会以 base64 编码输出,大于此限制值的会以拷贝方式(file-loader)放到 'outputPath'指定目录下
            outputpath: 'images/' //指定图片资源输出路径,不指定默认直接放到dist目录下,此时这里是 dist/imgs/
          }
        }
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_moudles/ // 不查找此目录下的js文件
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html", // 模板文件
      filename: "index.html", // 文件名
      hash: true // 避免缓存
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash].css', // 指定分离生成的css文件名，hash为了避免缓存
    })
  ]
}