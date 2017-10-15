const fs = require('fs');
const path = require('path');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
// const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  resolve: {
    modules: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "./src")
    ],
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [
          path.join(__dirname, './src'),
        ],
        loader: 'babel-loader',
        options: {
          presets: [['env', { module: false, debugger: true }], 'stage-0', 'react'],
          plugins: ['transform-runtime', 'add-module-exports', {visitor: { Program: function(p) { console.log(p)}}}]
        },
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    react: "React",
    'react-dom': "ReactDOM"
  },
  target: "web",
  devServer: {
    hot: true,
    noInfo: true,
    https: false
  }
};
