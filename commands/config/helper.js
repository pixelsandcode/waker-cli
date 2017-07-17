const fs       = require('fs')
const chalk    = require('chalk')
const helpers  = require('../../helpers')
const _        = require('lodash')
const inquirer = require('inquirer')
const Promise  = require('bluebird')

exports.command = 'helper'
exports.describe = 'config a helper on server'
exports.builder = {
  name: {
    alias: 'n'
  }
}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.configHelper(argv.name)
    .then(() => {
      console.log('helper config saved successfully')
    })
}

const privates = {
  configHelper (name) {
    const root = helpers.getWakerRoot()
    const configPath = `${root}/core/config/helpers/${name}.yml`
    if (!fs.existsSync(configPath)) return console.log(`there is no config file for "${name}" helper`)
    const config = helpers.readConfig(configPath)
    return privates.askConfig(config)
      .then( newConfig => {
        return helpers.updateConfig(configPath, newConfig)
      })
  },
  askConfig (config, parent, parentPath) {
    const promises = []
    _.each(config, (value, name) => {
      if (typeof value == 'object')
        promises.push(() => {
          return privates.askConfig(config[name], name, `${(parentPath)?`${parentPath}.`:''}${name}`)
        })
      else
        promises.push(() => {
          return privates.ask(name, value, parentPath)
        })
    })
    return Promise.reduce(promises, (newConfig, func) => {
      return func().then( result => {
        _.merge(newConfig, result)
        return newConfig
      })
    }, {}).then( newConfig => {
      if(parent) {
        const returnable = {}
        returnable[parent] = newConfig
        return returnable
      }
      return newConfig
    })
  },
  ask (name, value, parent) {
    return inquirer.prompt({
      name: name,
      type: 'input',
      message: `${(parent)?`${parent}.`:''}${name}`,
      default: value,
      filter: (input) => {
        if(input == 'true') return Promise.resolve(true)
        if(input == 'false') return Promise.resolve(false)
        return Promise.resolve(input)
      }
    })
  }
}
