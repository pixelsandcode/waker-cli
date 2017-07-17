#!/usr/bin/env node

const argv = require('yargs')
  .commandDir('commands')
  .options({
    version: {
      alias: 'v',
      describe: 'show version of waker-cli'
    }
  })
  .help()
  .argv

if(argv.version) {
  const pkg = require('./package.json')
  console.log(pkg.version)
}
