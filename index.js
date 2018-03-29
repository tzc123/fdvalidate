const defaults = require('./defaults')
const merge = require('./utils/merge')
const validators = require('./validators')

function handleValidate(key, value, options, ctx) {
  const { rules = {}, handles = {} } = options
  if (
    typeof options != 'object' 
    || typeof rules != 'object'
    || typeof handles != 'object'
    || (options.messages && typeof options.messages != 'object')
  ) {
    throw new Error('rules,handles,messages must be object')
  }
  const messages = merge(defaults.messages, options.messages || {})
  if (rules.required) {
    const res = validators.required(value)
    if (!res) {
      (handles.required || defaults.handle)(ctx, messages.required(key, value))
      return false
    }
  }
  if (rules.fixed || rules.fixed === 0) {
    const res = validators.length(value, rules.fixed, rules.fixed)
    if (!res) {
      (handles.fixed || defaults.handle)(ctx, messages.fixed(key, value, rules.fixed), rules.fixed)
      return false
    }
  } 
  if (rules.minLength || rules.minLength === 0) {
    const res = validators.length(value, rules.minLength, Infinity)
    if (!res) {
      (handles.minLength || defaults.handle)(ctx, messages.minLength(key, value, rules.minLength), rules.minLength)
      return false
    }
  } 
  if (rules.maxLength || rules.maxLength === 0) {
    const res = validators.length(value, -Infinity, rules.maxLength)
    if (!res) {
      (handles.maxLength || defaults.handle)(ctx, messages.maxLength(key, value, rules.maxLength), rules.maxLength)
      return false
    }
  }
  if (rules.min || rules.min === 0) {
    const res = validators.size(value, rules.min, Infinity)
    if (!res) {
      (handles.min || defaults.handle)(ctx, messages.min(key, value, rules.min), rules.min)
      return false
    }
  }
  if (rules.max || rules.max === 0) {
    const res = validators.size(value, -Infinity, rules.max)
    if (!res) {
      (handles.max || defaults.handle)(ctx, messages.max(key, value, rules.max), rules.max)
      return false
    }
  }
}

function fdValidator (options) {
  const queryOptions = options.query || {}
  const paramsOptions = options.params || {}
  return async function (ctx, next) {
    await next()
    const { query = {} , params = {} } = ctx
    const qKeys = Object.keys(queryOptions)
    const pKeys = Object.keys(paramsOptions)

    qKeys.forEach(key => {
      const ruleType = queryOptions[key].rules && queryOptions[key].rules.type
      const handleType = queryOptions[key].handles && queryOptions[key].handles.type || defaults.handle
      const messageType = queryOptions[key].messages && queryOptions[key].messages.type || defaults.messages.type
      if (ruleType) {
        const value = validators.type(query[key], ruleType)
        if (value !== false) {
          query[key] = value === true ? query[key] : value
        } else {
          handleType(ctx, messageType(key, query[key], ruleType))
          return
        }
      }
      handleValidate(key, query[key], queryOptions[key], ctx)
    })
    pKeys.forEach(key => {
      const ruleType = paramsOptions[key].rules && paramsOptions[key].rules.type
      const handleType = paramsOptions[key].handles && paramsOptions[key].handles.type || defaults.handle
      const messageType = paramsOptions[key].messages && paramsOptions[key].messages.type || defaults.messages.type      
      const value = validators.type(params[key], ruleType)
      if (value !== false) {
        params[key] = value
      } else {
        handleType(ctx, messageType(key, params[key]))
      }
      handleValidate(key, params[key], paramsOptions[key], ctx)
    })
  }
}

fdValidator.defaults = {
  ...defaults,
  validators
}

module.exports = fdValidator
