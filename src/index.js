import program from 'commander'
import Inquirer from 'inquirer'
import opn from 'opn'

import Utils from './utils'
import Network from './network'

program
.version(Utils.getVersion())
.description('The Deconet command line client.  You can buy and sell code with Deconet.')

program
.command('register')
.description('Register an account with Deconet')
.action(() => {
  Utils.registerOrLogin('register')
})

program
.command('login')
.description('Login to your Deconet account')
.action(() => {
  Utils.registerOrLogin('login')
})

program
.command('get <moduleName>')
.description('Get a module')
.action((moduleName) => {
  Network.getModuleUrl(moduleName)
  .then(function (response) {
    const error = (response && response.data && response.data.error)
    if (error) {
      console.log(error)
      return
    }
    // console.log('response: ', response.data)
    Utils.createDeconetModulesDir()
    const url = (response && response.data && response.data.url)
    const buyLicenseUrl = (response && response.data && response.data.buyLicenseUrl)
    Utils.saveModuleLocally(moduleName, url)
    .then((finalPath) => {
      console.log('Success! The module was saved locally to ' + finalPath)
      let questions = [
        {
          type: 'confirm',
          name: 'buyLicense',
          message: 'This module is licensed under the GPL.  To legally use this module, your project must also be licensed under the GPL.  Or, you can buy a GPL exception which allows you the freedom to license your own project under any license.  Are you interested in buy a GPL exception?'
        }
      ]
      Inquirer.prompt(questions)
      .then(answers => {
        if (answers.buyLicense === true) {
          console.log('Visit this URL to buy an exception: ' + buyLicenseUrl)
          opn(buyLicenseUrl, {wait: false})
        }
      })
    })
  })
  .catch(function (error) {
    console.log(error)
  })
})

program
.command('update')
.description('Update the Deconet command line client.')
.action(() => {
  Utils.updateToLatest(true)
})

// first, check for update
Utils.updateToLatest(false)
.then((updated) => {
  if (updated) {
    // quit and tell them to restart now that we updated.
    console.log('Your application is updating and will exit when complete.  You may need to run your original command again.')
  } else {
    program.parse(process.argv)

    // Check the program.args obj
    var NO_COMMAND_SPECIFIED = program.args.length === 0

    // Handle it however you like
    if (NO_COMMAND_SPECIFIED) {
      // e.g. display usage
      program.help()
    }
  }
})
