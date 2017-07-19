const fs       = require('fs')
const helpers  = require('../../helpers')

exports.command = 'plugin'
exports.describe = 'disable a plugin on server'
exports.builder = {
  name: {
    alias: 'n',
    describe: 'name of plugin to disable',
    demandOption: true
  }
}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.disableHelper(argv.name)
}

const privates = {
  disableHelper (name) {
    const root = helpers.getWakerRoot()
    const configPath = `${root}/core/config/plugins/${name}.yml`
    if (!fs.existsSync(configPath)) return console.log(`there is no config file for "${name}" plugin`)
    const config = helpers.readConfig(configPath)
    if(!config.default.enabled) return console.log(`"${name}" plugin is already disabled`)
    config.default.enabled = false
    helpers.updateConfig(configPath, config)
    console.log('plugin disabled successfully')
  }
}
