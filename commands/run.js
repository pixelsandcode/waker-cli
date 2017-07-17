const shell   = require('shelljs')
const fs      = require('fs')
const helpers = require('../helpers')

exports.command = 'run'
exports.describe = 'run server'
exports.builder = {
  background: {
    alias: 'b'
  },
  environment: {
    alias: 'e',
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
    const root = helpers.getWakerRoot()
    shell.exec(`cd ${root}/core && NODE_ENV=${environment} npm run start`, (code, stdout, stderr) => {
      if (code != '0')
        return console.log('something went wrong when trying to run server')
      console.log(`server is running!`)
    })
  }
}
