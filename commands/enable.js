exports.command = 'enable <type>'
exports.describe = 'enable something on server'
exports.builder = function (yargs) {
  return yargs.commandDir('enable')
}
exports.handler = function (argv) {}