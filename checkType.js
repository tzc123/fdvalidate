const { email, phone } = require('./regExps')

module.exports = {
  phone(value) {
    return phone.test(value)
  },
  emali(value) {
    return email.test(value)
  },
  string(value) {
    return value
  },
  number(value) {
    if (!isNaN(+value)) {
      return +value
    } else {
      return false
    }
  },
  object(value) {
    try {
      value = JSON.parse(value)
    } catch (err) {
      console.log(`${value} can not parse to object`)
      return false
    }
    if (Object.prototype.toString.call(value) == '[object Object]') {
      return value
    } else {
      return false
    }
  },
  array(value) {
    try {
      value = JSON.parse(value)
    } catch (err) {
      console.log(`${value} can not parse to array`)
      return false
    }
    if (Object.prototype.toString.call(value) == '[object Array]') {
      return value
    } else {
      return false
    }
  }
}