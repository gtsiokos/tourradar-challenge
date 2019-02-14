var path = require('path');

module.exports = [
  {
    test: /\.js$/,
    use: 'babel-loader',
    include: path.join(__dirname, 'src'),
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader'
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: [
            require('postcss-modules-values')(),
            require('postcss-color-function')(),
            require('autoprefixer')({browsers: ['last 2 versions']})
          ]
        }
      }

    ]
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: 'file-loader'
  },
  {
    test: /\.(woff|woff2)$/,
    use: {
      loader: 'url-loader',
      options: {
        prefix: 'font/',
        limit: 5000
      }
    }
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: {
      loader: 'url-loader',
      options: {
        mimetype: 'application/octet-stream',
        limit: 10000
      }
    }
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: {
      loader: 'url-loader',
      options: {
        mimetype: 'image/svg+xml',
        limit: 10000
      }
    }
  }
];