const fs      = require('fs')
const chalk   = require('chalk')
const helpers = require('../../helpers')
const _       = require('lodash')

exports.command = 'status'
exports.describe = 'show status of plugins/helpers of server'
exports.builder = {}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.getStatus()
}

const privates = {
  getStatus () {
    const root = helpers.getWakerRoot()
    const whiteSpace = '                    '
    const configPath = `${root}/core/config/waker`
    const pluginsManifestPath = `${root}/core/node_modules/waker/src/plugins.manifest.json`
    if (fs.existsSync(configPath))
      return console.log('there is no waker.js file')
    const config = require(configPath)
    const pluginsManifest = require(pluginsManifestPath)
    console.log('')
    console.log(chalk.bold.white(`Plugin${whiteSpace.substr(0, whiteSpace.length - 5)}Version${whiteSpace.substr(0, whiteSpace.length - 6)}Status`))
    console.log('-------------------------------------------------')
    _.each(config.plugins, (pluginConfig, name) => {
      const status = (pluginConfig.enabled) ? chalk.bold.green('enable') : chalk.bold.red('disable')
      const version = chalk.bold.yellow(`${pluginsManifest[name]}${whiteSpace.substr(0, whiteSpace.length - pluginsManifest[name].length)}`)
      name = chalk.bold.yellow(`${name}${whiteSpace.substr(0, whiteSpace.length - name.length)}`)
      console.log(name, version, status)
    })
    console.log('-------------------------------------------------')
    console.log('')
    console.log(chalk.bold.white(`Helper${whiteSpace.substr(0, whiteSpace.length - 5)}Status`))
    console.log('----------------------------')
    _.each(config.helpers, (helperConfig, name) => {
      const status = (helperConfig.enabled) ? chalk.bold.green('enable') : chalk.bold.red('disable')
      name = chalk.bold.yellow(`${name}${whiteSpace.substr(0, whiteSpace.length - name.length)}`)
      console.log(name, status)
    })
    console.log('----------------------------')
    console.log('')
  }
}
