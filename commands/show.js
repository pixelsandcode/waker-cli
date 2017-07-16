exports.command = 'show <type>'
exports.describe = 'show something'
exports.builder = function (yargs) {
  return yargs.commandDir('show')
}
exports.handler = function (argv) {}