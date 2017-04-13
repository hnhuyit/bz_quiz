const Webpack = require('webpack')
const WebpackMerge = require('webpack-merge')
const BaseConfig = require('./base.config.js')

module.exports = function (env) {
  return WebpackMerge(BaseConfig(), {
    plugins: [
      new Webpack.DefinePlugin({
        global: {},
        process: {
          env: {
            NODE_ENV: JSON.stringify('production')
          }
        }
      }),
      new Webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new Webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: false,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          warnings: false,
          drop_console: false
        },
        comments: false
      })
    ]
  })
}
