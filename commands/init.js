const figlet        = require('figlet')
const clear         = require('clear')
const chalk         = require('chalk')
const inquirer      = require('inquirer')
const gulp          = require('gulp')
const template      = require('gulp-template')
const exec          = require('gulp-exec')
const Promise       = require('bluebird')
const latestVersion = require('latest-version')
const fs            = require('fs')
const shell         = require('shelljs')
const available     = require('available-versions')
const helpers       = require('../helpers')
const _             = require('lodash')

exports.command = 'init'
exports.describe = 'create a new server'
exports.builder = {
  path: {
    alias: 'p'
  },
  version: {
    alias: 'v'
  }
}
exports.handler = function (argv) {
  const path = helpers.get_absolute_path(argv.path)
  const version =
    privates.waker_version(argv.version ? argv.version : 'latest')
      .then(version => {
        privates.check_version(version)
          .then(valid => {
            if(!valid) throw new Error(`waker version is not valid: ${version}`)
            clear()
            console.log(
              chalk.yellow(
                figlet.textSync('Waker', {horizontalLayout: 'full'})
              )
            )
            return privates.ask()
          })
          .then(result => {
            return privates.process(result, path, version)
          })
          .then(() => {
            console.log("waker skeleton initiation finished!")
            console.log("installing dependencies ...")
            return privates.install_npms(path)
          })
          .then(() => {
            console.log("dependencies are installed successfully. enjoy! :)")
          })
          .catch(err => {
            console.log('waker installation is failed')
            console.log('reason:', err.message)
          })
      })
}
const privates = {
  questions (answers) {
    return [
      {
        name: 'app',
        type: 'input',
        message: 'What is your app name?',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your app name:'
          }
        }
      },
      {
        name: 'url',
        type: 'input',
        message: 'What is your server url?',
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter server url:'
          }
        }
      },
      {
        name: 'repository',
        type: 'input',
        message: 'What is your git repository?'
      },
      {
        name: 'author',
        type: 'input',
        message: 'What is the author name?',
        default: 'Waker'
      },
      {
        name: 'homepage',
        type: 'input',
        message: "What is the project's homepage?",
        default: answers.url
      },
      {
        name: 'server_sampling',
        type: 'input',
        message: "Enter server sampling :",
        default: 5000
      },
      {
        name: 'server_host',
        type: 'input',
        message: "Enter server host:",
        default: 'http://localhost'
      },
      {
        name: 'server_port',
        type: 'input',
        message: "Enter server port:",
        default: 3100
      },
      {
        name: 'server_timeout',
        type: 'input',
        message: "Enter server timeout:",
        default: 3000
      },
      {
        name: 'database_host',
        type: 'input',
        message: "Enter database host:",
        default: '127.0.0.1'
      },
      {
        name: 'database_name',
        type: 'input',
        message: "Enter database name:",
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter database name:'
          }
        },
        default: answers.app
      },
      {
        name: 'searchengine_host',
        type: 'input',
        message: "Enter searchengin host:",
        default: 'localhost'
      },
      {
        name: 'searchengine_port',
        type: 'input',
        message: "Enter searchengin port:",
        default: 9200
      },
      {
        name: 'searchengine_name',
        type: 'input',
        message: "Enter searchengin name:",
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter searchengin name:'
          }
        },
        default: answers.app
      },
      {
        name: 'cache_host',
        type: 'input',
        message: "Enter cache host:",
        default: '0.0.0.0'
      },
      {
        name: 'cache_port',
        type: 'input',
        message: "Enter cache port:",
        default: 6379
      }
    ]
  },
  ask (answers = {}, index = 0) {
    const questions = privates.questions(answers)
    if(index == questions.length) return Promise.resolve(answers)
    return inquirer.prompt(questions[index])
      .then(result => {
        _.merge(answers, result)
        return privates.ask(answers, index + 1)
      })
  },
  process (result, path = '.', version = 'latest') {
    let src = `${path}/core/node_modules/waker/skeleton/**`
    result.name = "<%= name %>"
    result.cName = "<%= cName %>"
    result.interpolate_regex = '<%=([\\s\\S]+?)%>'
    result.scheme = 'waker' //should be deleted after updating waker
    result.version = version
    privates.touch_path(path)
    console.log(`installing waker@${version} ...`)
    return privates.install_waker(path, version)
      .then(() => {
        console.log('waker installed successfully!')
        console.log('initiating waker skeleton ...')
        return privates.render(src, path, result)
      })
  },
  render (src, dest, data) {
    return new Promise((resolve, reject) => {
      gulp.src(src, {dot: true})
        .pipe(template(data, {interpolate: /<%=([\s\S]+?)%>/g}))
        .pipe(gulp.dest(dest))
        .on('end', () => {
          resolve()
        })
    })
  },
  install_npms (path = '.') {
    return new Promise((resolve, reject) => {
      shell.exec(`cd ${path}/core && npm install`, (code, stdout, stderr) => {
        if (code != '0')
          return reject(new Error('something went wrong when installing dependencies'))
        resolve()
      })
    })
  },
  install_waker (path, version) {
    return new Promise((resolve, reject) => {
      const waker = version ? `waker@${version}` : 'waker'
      shell.exec(`cd ${path}/core && npm install ${waker}`, (code, stdout, stderr) => {
        if (code != '0')
          return reject(new Error('something went wrong when installing waker'))
        resolve()
      })
    })
  },
  waker_version (version) {
    if (version != 'latest') return Promise.resolve(version)
    return latestVersion('waker')
  },
  check_version (version) {
    return available({
      name: 'waker'
    }).then(result => {
      if (result.versions.indexOf(version) < 0) return false
      return true
    })
  },
  touch_path (path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
      fs.mkdirSync(`${path}/core`)
    }
    else {
      if (!fs.existsSync(`${path}/core`))
        fs.mkdirSync(`${path}/core`)
    }
  }
}
