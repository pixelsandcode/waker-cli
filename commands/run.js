const shell   = require('shelljs')
const fs      = require('fs')
const helpers = require('../helpers')

exports.command = 'run'
exports.describe = 'run server'
exports.builder = {
  background: {
    alias: 'b',
    describe: 'run server as background process'
  },
  environment: {
    alias: 'e',
    describe: 'environment to run server on',
    default: 'development'
  }
}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  privates.runServer(argv)
}

privates = {
  runServer ({background, environment}) {
    if(background) return console.log('sorry! running in background is not implemented yet')
    const root = helpers.getWakerRoot()
    shell.exec(`cd ${root}/core && NODE_ENV=${environment} npm run start`, (code, stdout, stderr) => {
      if (code != '0')
        return console.log('something went wrong when trying to run server')
      console.log(`server is running!`)
    })
  }
}
