module.exports = {
  mode: 'production',
  entry: './src/entry',
  output: {
    filename: 'elpong.js',
    path: __dirname + '/dist',
    library: 'elpong',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts']
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  }
};
