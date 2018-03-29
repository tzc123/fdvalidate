module.exports = {
  messages: {
    type: function (key, value, type) {
      return `${key}: input ${value}, but type ${type}`
    },
    required: function (key, value) {
      return `${key}: this key is required`
    },
    minLength: function (key, value, minLength) {
      return `${key}: input ${value}, but minLength ${minLength}`
    },
    maxLength: function (key, value, maxLength) {
      return `${key}: input ${value}, but maxLength ${maxLength}`
    },
    fixed: function (key, value, fixed) {
      return `${key}: length fixed ${fixed}`
    },
    min: function (key, value) {
      return `${key}: min ${key} ${value}`
    },
    max: function (key, value) {
      return `${key}: max ${key} ${value}`
    },
  },
  handle: function (ctx, message) {
    ctx.body = {
      success: false,
      message
    }
  }
}