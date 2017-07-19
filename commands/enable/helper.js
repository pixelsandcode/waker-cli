const fs      = require('fs')
const helpers = require('../../helpers')

exports.command = 'helper'
exports.describe = 'enable a helper on server'
exports.builder = {
  name: {
    alias: 'n',
    describe: 'name of helper to enable',
    demandOption: true
  }
}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.enableHelper(argv.name)
}

const privates = {
  enableHelper (name) {
    const root = helpers.getWakerRoot()
    const configPath = `${root}/core/config/helpers/${name}.yml`
    if (!fs.existsSync(configPath)) return console.log(`there is no config file for "${name}" helper`)
    const config = helpers.readConfig(configPath)
    if(config.default.enabled) return console.log(`"${name}" helper is already enabled`)
    console.log('installing helper dependencies ...')
    helpers.installHelper(name)
      .then(() => {
        config.default.enabled = true
        helpers.updateConfig(configPath, config)
        console.log('helper enabled successfully')
      })
      .catch((err) => {
        console.log(`something went wrong when installing "${name}" helper dependencies`)
      })
  }
}
