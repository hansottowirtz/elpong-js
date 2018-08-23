module.exports = {
  entry: './ts-app',
  mode: 'production',
  optimization: {
		minimize: false
	},
  output: {
    filename: 'ts-app.js',
    path: __dirname + '/built'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  }
};