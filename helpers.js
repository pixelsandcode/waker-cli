const fs     = require('fs')
const jsYaml = require('js-yaml')
const shell  = require('shelljs')
const _      = require('lodash')

const helpers = {
  getAbsolutePath (path) {
    if (!path) return process.cwd()
    if (path[0] != '/' && path[0] != '~')
      return `${process.cwd()}/${path}`
    return path
  },
  checkWakerExistence () {
    let path = helpers.getWakerRoot()
    const pkgPath = `${path}/core/package.json`
    const wakerPath = `${path}/core/node_modules/waker`
    if (!fs.existsSync(pkgPath)) return false
    const pkg = require(pkgPath)
    if (!pkg.dependencies || !pkg.dependencies.waker) return false
    if (!fs.existsSync(wakerPath)) return false
    return true
  },
  getWakerRoot () {
    let path = process.cwd()
    let index = path.indexOf('core')
    if (index > -1)
      path = path.substr(0, index)
    else {
      index = path.indexOf('modules')
      if (index > -1)
        path = path.substr(0, index)
    }
    return path
  },
  getWakerVersion () {
    const root = helpers.getWakerRoot()
    const pkgPath = `${root}/core/node_modules/waker/package.json`
    if(!fs.existsSync(pkgPath))
      throw new Error('there is no waker installed')
    const pkg = require(pkgPath)
    return pkg.version
  },
  updateConfig (path, config) {
    fs.writeFileSync(path, jsYaml.dump(config), 'utf8')
  },
  readConfig (path) {
    const contents = fs.readFileSync(path, 'utf8'),
      data     = jsYaml.load(contents)
    return data
  },
  installNpm (name, version) {
    const root = helpers.getWakerRoot()
    return new Promise((resolve, reject) => {
      const npm = version ? `${name}@${version}` : name
      shell.exec(`cd ${root}/core && npm install --save ${npm}`, (code, stdout, stderr) => {
        if (code != '0')
          return reject(new Error('something went wrong when installing waker'))
        resolve()
      })
    })
  },
  installPlugin (name) {
    const root = helpers.getWakerRoot()
    const pluginsManifestPath = `${root}/core/node_modules/waker/src/plugins.manifest.json`
    const pluginsManifest = require(pluginsManifestPath)
    if(name == 'bell') name = 'hapi-notification-server' //this should be removed when hapi-notification-server renamed to bell
    return helpers.installNpm(name, pluginsManifest[name])
  },
  installHelper (name) {
    const root = helpers.getWakerRoot()
    const helpersManifestPath = `${root}/core/node_modules/waker/src/helpers.manifest.json`
    const helpersManifest = require(helpersManifestPath)
    if(!helpersManifest[name]) return Promise.resolve(true)
    let npms = ''
    _.each(helpersManifest[name], (version, npm) => {
      if(npms == '') npms = `${npm}@${version}`
      else npms = `${npms} ${npm}@${version}`
    })
    return helpers.installNpm(npms)
  }
}

module.exports = helpers
