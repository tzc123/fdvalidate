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
  const validatorsKeys = Object.keys(validators)
  validatorsKeys.shift()
  return validatorsKeys.every(validatorkey => {
    if (rules[validatorkey]) {
      const res = validators[validatorkey](value, rules[validatorkey])
      if (!messages[validatorkey]) {
        console.log(`custom rule ${validatorkey} require a message generate function`)
        messages[validatorkey] = () => {}
      }
      const message = (messages[validatorkey])(key, value, rules[validatorkey])
      res || (handles[validatorkey] || defaults.handle)(ctx, message)
      return res
    } else {
      return true
    }
  })
}

function fdValidator (options) {
  const queryOptions = options.query || {}
  const paramsOptions = options.params || {}
  // const needValidate = Object.keys(options)
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
        params[key] = value === true ? params[key] : value
      } else {
        handleType(ctx, messageType(key, params[key]))
      }
      handleValidate(key, params[key], paramsOptions[key], ctx)
    })
  }
}

fdValidator.messages = defaults.messages
fdValidator.handle = defaults.handle
fdValidator.validators = validators

module.exports = fdValidator
