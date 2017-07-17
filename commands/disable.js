exports.command = 'disable <type>'
exports.describe = 'disable something on server'
exports.builder = function (yargs) {
  return yargs.commandDir('disable')
}
exports.handler = function (argv) {}
