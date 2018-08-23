module.exports = {
  mode: 'production',
  entry: './src/main',
  output: {
    filename: 'elpong.js',
    path: __dirname + '/dist',
    library: 'elpong',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // https://github.com/webpack/webpack/issues/6522#issuecomment-366708234
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  resolve: {
    extensions: ['.ts']
  },
  optimization: {
    minimize: false
  },
  // devtool: 'source-map',
  module: {
    rules: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  }
};
