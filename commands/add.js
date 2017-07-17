exports.command = 'add <type>'
exports.describe = 'add somthing to server'
exports.builder = function (yargs) {
  return yargs.commandDir('add')
}
exports.handler = function (argv) {}
