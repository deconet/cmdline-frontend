import Network from './network'
import mockAxios from 'jest-mock-axios'

afterEach(() => {
    // cleaning up the mess left behind the previous test
  mockAxios.reset()
})

test('registration endpoint', () => {
  let catchFn = jest.fn()
  let thenFn = jest.fn()
  Network.registerOrLogin('register', 'test@example.com', 'p4ssword')
  .then(thenFn)
  .catch(catchFn)
  mockAxios.mockResponse({ apiKey: 'moooo' })
  expect(mockAxios.post).toHaveBeenCalledWith('http://localhost:3000/v1/users', {'email': 'test@example.com', 'password': 'p4ssword'})
  // checking the `then` spy has been called and if the
  // response from the server was converted to upper case
  expect(thenFn).toHaveBeenCalledWith({'apiKey': 'moooo', 'config': {}, 'data': {}, 'headers': {}, 'status': 200, 'statusText': 'OK'})

  // catch should not have been called
  expect(catchFn).not.toHaveBeenCalled()
})


test('login endpoint', () => {
  let catchFn = jest.fn()
  let thenFn = jest.fn()
  Network.registerOrLogin('login', 'test@example.com', 'p4ssword')
  .then(thenFn)
  .catch(catchFn)
  mockAxios.mockResponse({ apiKey: 'moooo' })
  expect(mockAxios.post).toHaveBeenCalledWith('http://localhost:3000/v1/sessions', {'email': 'test@example.com', 'password': 'p4ssword'})
  // checking the `then` spy has been called and if the
  // response from the server was converted to upper case
  expect(thenFn).toHaveBeenCalledWith({'apiKey': 'moooo', 'config': {}, 'data': {}, 'headers': {}, 'status': 200, 'statusText': 'OK'})

  // catch should not have been called
  expect(catchFn).not.toHaveBeenCalled()
})
