global.BASE_PATH = __dirname;

function buildConfig (env) {
  return require('./webpack/' + env + '.config.js')({ env: env })
}

module.exports = buildConfig
