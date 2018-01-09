const path = require('path')

module.exports = {
  target: 'node',
  entry: {
    app: [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['env', 'stage-0']
      }
    }],
    rules: [ { test: /rx\.lite\.aggregates\.js/, use: 'imports-loader?define=>false' } ]
  }
}
