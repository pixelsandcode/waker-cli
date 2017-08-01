const shell   = require('shelljs')
const fs      = require('fs')
const helpers = require('../helpers')

exports.command = 'run'
exports.describe = 'run server'
exports.aliases = ['start', 'ignite']
exports.builder = {
  background: {
    alias: 'b',
    describe: 'run server as background process'
  },
  environment: {
    alias: 'e',
    describe: 'environment to run server on',
    default: 'development'
  },
  config: {
    alias: 'c',
    describe: 'config file to run server based on',
    default: 'pm2.json'
  }
}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.runServer(argv)
}

const privates = {
  runServer ({background, environment, config}) {
    const root = helpers.getWakerRoot()
    if(background)
      shell.exec(`cd ${root} && NODE_ENV=${environment} pm2 start ${config}`, (code, stdout, stderr) => {
        if (code != '0')
          return console.log('something went wrong when trying to run server. make sure to have pm2 npm installed globally')
        console.log(`server is running!`)
        console.log('use "pm2 list" command to see list of running servers')
      })
    else
      shell.exec(`cd ${root}/core && NODE_ENV=${environment} npm run start`, (code, stdout, stderr) => {
        if (code != '0')
          return console.log('something went wrong when trying to run server')
        console.log(`server is running!`)
      })
  }
}
