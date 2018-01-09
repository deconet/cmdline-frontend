import Netrc from 'netrc'
import Inquirer from 'inquirer'

import Network from './network'

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
}
