const fs      = require('fs')
const chalk   = require('chalk')
const helpers = require('../../helpers')
const _       = require('lodash')

exports.command = 'modules'
exports.describe = 'show modules of server'
exports.builder = {}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.getModuleStatus()
}

const privates = {
  getModuleStatus () {
    const root = helpers.getWakerRoot()
    const whiteSpace = '                    '
    const configPath = `${root}/core/config/waker.js`
    if (!fs.existsSync(configPath))
      return console.log('there is no waker.js file')
    const config = require(configPath)
    console.log('')
    console.log(chalk.bold.white(`Module${whiteSpace.substr(0, whiteSpace.length - 5)}Package Name`))
    console.log('-----------------------------------------')
    _.each(config.modules, (value, name) => {
      name = chalk.bold.yellow(`${name}${whiteSpace.substr(0, whiteSpace.length - name.length)}`)
      value = chalk.bold.yellow(value)
      console.log(name, value)
    })
    console.log('-----------------------------------------')
    console.log('')
  }
}
