module.exports = {
  messages: {
    type: function (key, value, type) {
      return `${key}: ${value} is not a ${type}`
    },
    required: function (key, value) {
      return `${key}: this key is required`
    },
    minLength: function (key, value, minLength) {
      return `${key}: ${value} is shorter ${minLength}`
    },
    maxLength: function (key, value, maxLength) {
      return `${key}: input ${value} is longer then ${maxLength}`
    },
    fixed: function (key, value, fixed) {
      return `${key}: length fixed ${fixed}`
    },
    min: function (key, value, min) {
      return `${key}: ${value} is lesser then ${min}`
    },
    max: function (key, value) {
      return `${key}:  ${value} is more then ${min}`
    },
  },
  handler: function (ctx, message) {
    ctx.body = {
      success: false,
      message
    }
  }
}