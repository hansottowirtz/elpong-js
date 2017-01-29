module.exports = {
  entry: './src/main',
  output: {
    filename: 'elpong.js',
    path: __dirname + '/dist',
    library: 'Elpong',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ],
    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  }
};
