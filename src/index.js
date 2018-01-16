import program from 'commander'

import Utils from './utils'
import Network from './network'

program
.version('0.0.1')
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

program.parse(process.argv)

// Check the program.args obj
var NO_COMMAND_SPECIFIED = program.args.length === 0

// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
  // e.g. display usage
  program.help()
}
