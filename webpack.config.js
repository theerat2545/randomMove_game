const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.json$/,
        use: 'json-loader',
        type: 'javascript/auto'
      },      
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',  // บันทึกไฟล์ไปยังโฟลเดอร์ images
              publicPath: 'images/'   // อ้างอิงไฟล์จากโฟลเดอร์ images
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'pixi.js': path.resolve(__dirname, 'node_modules/pixi.js'),
      'pixi-spine': path.resolve(__dirname, 'node_modules/pixi-spine'),
    },
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // บอกให้เซิร์ฟเวอร์ใช้โฟลเดอร์ dist เป็นโฟลเดอร์ static
    },
    compress: true,
    port: 8080, // กำหนดพอร์ตให้ Webpack DevServer ทำงานที่พอร์ต 8080
    open: true, // เปิดเบราว์เซอร์อัตโนมัติเมื่อเริ่มเซิร์ฟเวอร์
  },
};
