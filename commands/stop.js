const shell   = require('shelljs')
const fs      = require('fs')
const helpers = require('../helpers')

exports.command = 'stop'
exports.describe = 'stop server'
exports.aliases = ['kill', 'dampen']
exports.builder = {
  config: {
    alias: 'c',
    describe: 'config file to stop server based on',
    default: 'pm2.json'
  }
}
exports.handler = function (argv) {
  if (!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.stopServer(argv)
}

const privates = {
  stopServer ({config}) {
    const root = helpers.getWakerRoot()
    shell.exec(`cd ${root} && pm2 delete ${config}`, (code, stdout, stderr) => {
      if (code != '0')
        return console.log('something went wrong when trying to stop server. make sure to have pm2 npm installed globally.')
      console.log(`server is stopped!`)
    })
  }
}
