import Axios from 'axios'
// const backendHost = 'https://deconet-dev.herokuapp.com'
const backendHost = 'http://localhost:3000'

export default class Network {
  static register(email, password) {
    Axios.post(backendHost + '/v1/users', {
      email: email,
      password: password
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}