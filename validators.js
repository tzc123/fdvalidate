const types = ['string', 'number', 'object', 'array']

const checkType = {
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
    value = JSON.parse(value)
    if (Object.prototype.toString.call(value) == '[object Object]') {
      return value
    } else {
      return false
    }
  },
  array(value) {
    value = JSON.parse(value)
    if (Object.prototype.toString.call(value) == '[object Array]') {
      return value
    } else {
      return false
    }
  }
}

module.exports = {
  type(value, type) {
    if (!value && value != 0) {
      return true
    } else if (typeof type != 'string' || typeof value != 'string') {
      throw new Error('type(value:?[string], type:?[string])')
    } else {
      return checkType[type](value)
    }
  },
  required(value) {
    if (!value && value != 0) {
      return false
    }
    return true
  },
  length(value, min, max) {
    if (typeof min != 'number' || (!!max && typeof max != 'number')) {
      throw new Error('length(type:[string], value:[string], min:?[number], max?[number])')
    }
    if (!value && value != 0) {
      return true
    } else if (value.length < min) {
      return false
    } else if (value.length > max) {
      return false
    } else {
      return true
    }
  },
  size(value, min, max) {
    if (typeof min != 'number' || (!!max && typeof max != 'number')) {
      throw new Error('size(type:[string], value:[number], min:?[number], max:?[number])')
    }
    if (!value && value != 0) {
      return true
    } else if (value < min) {
      return false
    } else if (value > max) {
      return false
    } else {
      return true
    }
  }
}