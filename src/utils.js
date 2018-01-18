import Netrc from 'netrc'
import Inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'
import { Extract } from 'unzip-stream'
import rimraf from 'rimraf'
import child_process from 'child_process'

import Network from './network'

var packageJson = require('../package.json')

const domainName = 'deco.network'

export default class Utils {
  static requireLetterAndNumber (value) {
    if (/\D/.test(value) && /\d/.test(value) && value.length >= 7) {
      return true
    }
    return 'Password needs to be at least 7 characters and have at least one letter and one number'
  }
  static saveApiKey (login, apiKey) {
    const myNetrc = Netrc()
    myNetrc[domainName] = { login, password: apiKey }
    Netrc.save(myNetrc)
  }
  static getApiKey () {
    const myNetrc = Netrc()
    return myNetrc[domainName].password
  }
  static registerOrLogin (actionType) {
    let questions = [
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email address: '
      }
    ]
    if (actionType === 'register') {
      // only add username input if they are registering
      questions.push({
        type: 'input',
        name: 'username',
        message: 'Choose a username: '
      })
    }
    questions.push({
      type: 'password',
      name: 'password',
      message: 'Enter a password: ',
      mask: '*',
      validate: Utils.requireLetterAndNumber
    })
    Inquirer.prompt(questions)
    .then(answers => {
      Network.registerOrLogin(actionType, answers.email, answers.password, answers.username)
      .then(response => {
        const apiKey = (response && response.data && response.data.access_token)
        if (apiKey) {
          Utils.saveApiKey(answers.email, apiKey)
          console.log('Success!  Your account was logged in.  You can now use Deconet normally.  Try "deconet --help" to see what you can do.')
        }
      })
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        console.log('Error: ' + error.response.data.error)
      } else {
        console.error(error)
      }
    })
  }
  static modDirPath () {
    return 'deconet_modules'
  }
  static createDeconetModulesDir () {
    let modDirPath = this.modDirPath()
    // console.log('modDirPath: ' + modDirPath)
    if (!fs.existsSync(modDirPath)) {
      // create dir
      fs.mkdirSync(modDirPath)
    }
  }
  static saveModuleLocally (name, url) {
    // console.log('saving module locally with name ' + name + ' and url ' + url)
    return new Promise((resolve, reject) => {
      Network.getModuleZip(url)
      .then((response) => {
        let modPath = path.join(this.modDirPath(), name)

        // delete it if it already exists
        if (fs.existsSync(modPath)) {
          rimraf.sync(modPath)
        }

        let zipFolderNameHeader = response.headers['content-disposition']
        let parts = zipFolderNameHeader.split('attachment; filename=')
        // console.log(parts)
        // chop off start and end quote characters, and .zip ext as well
        let zipFolderName = parts[1].substr(1).slice(0, -5)
        let zipFolderPath = path.join(this.modDirPath(), zipFolderName)

        response.data
        .pipe(Extract({ path: this.modDirPath() }))
        .on('close', () => {
          // console.log('extraction complete, zipFolderPath is ' + zipFolderPath)
          // rename zipFolderPath to modPath
          fs.renameSync(zipFolderPath, modPath)
          resolve(modPath)
        })
      })
      .catch(err => reject(err))
    })
  }
  static getVersion () {
    return packageJson.version
  }
  static updateBinary () {
    // replace self with new version
    child_process.exec('curl -L https://app.deco.network/releases/latest > /usr/local/bin/deconet; chmod +x /usr/local/bin/deconet')
  }
  static updateToLatest (manuallyInvoked) {
    let updated = false
    return new Promise((resolve, reject) => {
      Network.updateCheck()
      .then(response => {
        const remoteVersion = (response && response.data && response.data.human_version)
        if (Utils.getVersion() !== remoteVersion) {
          if (manuallyInvoked === true) {
            console.log('Updating from ' + Utils.getVersion() + ' to version ' + remoteVersion + '.  Please wait...')
            Utils.updateBinary()
            resolve(true)
          } else {
            // prompt user to update
            let questions = [
              {
                type: 'confirm',
                name: 'update',
                message: 'You are running version ' + Utils.getVersion() + ' of the command line client, but the latest is ' + remoteVersion + '.  Would you like to update to the latest version?'
              }
            ]
            Inquirer.prompt(questions)
            .then(answers => {
              if (answers.update === true) {
                Utils.updateBinary()
                updated = true
              }
              resolve(updated)
            })
          }
        } else {
          if (manuallyInvoked === true) {
            console.log('No update needed.  You are running the latest version :)')
          }
          resolve(false)
        }
      })
    })
  }
}
