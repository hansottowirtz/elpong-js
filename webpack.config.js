module.exports = {
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
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  }
};
