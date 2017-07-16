const fs      = require('fs')
const helpers = require('../../helpers')
const Promise = require('bluebird')

exports.command = 'version'
exports.describe = 'show waker version of server'
exports.builder = {
  path: {
    alias: 'p'
  }
}
exports.handler = function (argv) {
  const path = helpers.get_absolute_path(argv.path)
  privates.get_version(path)
    .then(version => {
      console.log(version)
    })
    .catch(err => {
      console.log(err.message)
    })
}

const privates = {
  get_version (path) {
    return new Promise((resolve, reject) => {
      const pkgPath = `${path}/core/node_modules/waker/package.json`
      if(!fs.existsSync(pkgPath))
        return reject(new Error('there is no waker installed'))
      const pkg = require(pkgPath)
      resolve(pkg.version)
    })
  }
}
