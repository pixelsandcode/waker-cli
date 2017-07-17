exports.command = 'config <type>'
exports.describe = 'config something on server'
exports.builder = function (yargs) {
  return yargs.commandDir('config')
}
exports.handler = function (argv) {}
