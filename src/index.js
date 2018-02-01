import program from 'commander'

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
    Utils.saveModuleLocally(moduleName, url)
    .then((finalPath) => {
      console.log('Success! The module was saved locally to ' + finalPath)
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
    console.log('Your application has finished updating.  You may need to run your original command again.')
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
