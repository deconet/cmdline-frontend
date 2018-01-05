export default class Utils {
  static requireLetterAndNumber(value) {
    if (/\w/.test(value) && /\d/.test(value) && value.length >= 7) {
      return true
    }
    return 'Password needs to be at least 7 characters and have at least one letter and one number'
  }
} 
