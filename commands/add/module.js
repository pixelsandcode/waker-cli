const shell   = require('shelljs')
const fs      = require('fs')
const helpers = require('../../helpers')

exports.command = 'module'
exports.describe = 'add new module to waker server'
exports.builder = {
  name: {
    alias: 'n'
  }
}
exports.handler = function (argv) {
  if(!helpers.checkWakerExistence())
    return console.log('there is no waker server')
  const root = helpers.getWakerRoot()
  const addModuleScriptPath = `${root}/core/tasks/create_module.js`
  if(!fs.existsSync(addModuleScriptPath))
    try {
      console.log('add module command is not supported by waker', helpers.getWakerVersion())
    }
    catch (err) {
      console.log(err.message)
    }
  else
    privates.addModule(root, argv.name)
}

privates = {
  addModule (root, name) {
    shell.exec(`cd ${root}/core && gulp api:module:create -n ${name}`, (code, stdout, stderr) => {
      if (code != '0')
        console.log('something went wrong when creating new module')
      console.log(`"${name}" module created successfully!`)
    })
  }
}
