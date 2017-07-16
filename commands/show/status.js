const helpers = require('../../helpers')

exports.command = 'status'
exports.describe = 'show status of plugins/helpers of server'
exports.builder = {
  path: {
    alias: 'p'
  }
}
exports.handler = function (argv) {
  const path = helpers.get_absolute_path(argv.path)
  privates.get_status(path)
    .then(status => {
      console.log(status)
    })
    .catch(err => {
      console.log(err.message)
    })
}

const privates = {
  get_status (path) {
    return new Promise((resolve, reject) => {
      const pkgPath = `${path}/core/config`
      if(!fs.existsSync(pkgPath))
        return reject(new Error('there is no waker installed'))
      const pkg = require(pkgPath)
      resolve(pkg.version)
    })
  }
}