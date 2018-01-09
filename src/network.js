import Axios from 'axios'
// const backendHost = 'https://deconet-dev.herokuapp.com'
const backendHost = 'http://localhost:3000'

Axios.defaults.headers.post['Content-Type'] = 'application/json'
Axios.defaults.headers.post['Accept'] = 'application/json'

export default class Network {
  static registerOrLogin (actionType, email, password, username) {
    let requestPayload = {
      user: {
        email: email,
        password: password,
        username: username
      }
    }
    let endpoint = '/users'
    if (actionType === 'login') {
      endpoint = '/oauth/token'
      requestPayload = {
        email: email,
        password: password,
        grant_type: 'password'
      }
    }
    endpoint = backendHost + endpoint // prepend hostname
    return Axios.post(endpoint, requestPayload)
  }
  static getModule (moduleName) {
    return Axios.post(backendHost + '/v1/modules', {
      name: moduleName
    })
  }
}
