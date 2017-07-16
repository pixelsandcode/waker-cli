#!/usr/bin/env node

let argv = require('yargs')
  .commandDir('commands')
  .demandCommand(1)
  .help()
  .argv