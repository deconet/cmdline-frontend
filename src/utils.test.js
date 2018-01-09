import Utils from './utils'

test('requireLetterAndNumber', () => {
  // these should fail validation
  expect(Utils.requireLetterAndNumber('meow')).not.toBe(true)
  expect(Utils.requireLetterAndNumber('123456')).not.toBe(true)
  expect(Utils.requireLetterAndNumber('1234567')).not.toBe(true)
  expect(Utils.requireLetterAndNumber('muffins')).not.toBe(true)
  expect(Utils.requireLetterAndNumber('muff1n')).not.toBe(true)

  // this should pass
  expect(Utils.requireLetterAndNumber('muffins1')).toBe(true)
})
