const fs       = require('fs')
const helpers  = require('../../helpers')

exports.command = 'helper'
exports.describe = 'disable a helper on server'
exports.builder = {
  name: {
    alias: 'n',
    describe: 'name of helper to disable',
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
    const configPath = `${root}/core/config/helpers/${name}.yml`
    if (!fs.existsSync(configPath)) return console.log(`there is no config file for "${name}" helper`)
    const config = helpers.readConfig(configPath)
    if(!config.default.enabled) return console.log(`"${name}" helper is already disabled`)
    config.default.enabled = false
    helpers.updateConfig(configPath, config)
    console.log('helper disabled successfully')
  }
}
