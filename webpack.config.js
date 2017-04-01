const path = require('path');

module.exports = {
  entry: './src/test.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'test.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
};
