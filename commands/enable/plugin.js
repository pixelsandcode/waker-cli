const fs       = require('fs')
const helpers  = require('../../helpers')

exports.command = 'plugin'
exports.describe = 'enable a plugin on server'
exports.builder = {
  name: {
    alias: 'n',
    describe: 'name of plugin to enable',
    demandOption: true
  }
}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.enablePlugin(argv.name)
}

const privates = {
  enablePlugin (name) {
    const root = helpers.getWakerRoot()
    const configPath = `${root}/core/config/plugins/${name}.yml`
    if (!fs.existsSync(configPath)) return console.log(`there is no config file for "${name}" plugin`)
    const config = helpers.readConfig(configPath)
    if(config.default.enabled) return console.log(`"${name}" plugin is already enabled`)
    console.log('installing plugin package ...')
    helpers.installPlugin(name)
      .then(() => {
        config.default.enabled = true
        helpers.updateConfig(configPath, config)
        console.log('plugin enabled successfully')
      })
      .catch((err) => {
        console.log(`something went wrong when installing "${name}" plugin`)
      })
  }
}
