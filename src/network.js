import Axios from 'axios'
import Utils from './utils'
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
  static getModuleUrl (moduleName) {
    return Axios.post(backendHost + '/v1/modules/get', {
      q: moduleName
    })
  }
  static getModuleZip (url) {
    return Axios.get(url, {
      responseType: 'stream',
      headers: {
        'X-Deconet-Token': Utils.getApiKey()
      }
    })
  }
}
