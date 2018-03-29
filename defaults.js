module.exports = {
  messages: {
    type: function (key, value) {
      return `type ${key} ${value}`
    },
    required: function (key, value) {
      return `required ${key} ${value}`
    },
    minLength: function (key, value) {
      return `minLength ${key} ${value}`
    },
    maxLength: function (key, value) {
      return `maxLength ${key} ${value}`
    },
    min: function (key, value) {
      return `min ${key} ${value}`
    },
    max: function (key, value) {
      return `max ${key} ${value}`
    }
  },
  handle: function (ctx, message) {
    ctx.body = {
      success: false,
      message
    }
  }
}