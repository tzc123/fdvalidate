const defaults = require('./defaults')
const validators = require('./validators')
const { analyze, merge } = require('./utils')

function handleValidate(key, value, option, ctx) {
  const { rules = {}, handles = {} } = option
  if (
    typeof option != 'object' 
    || typeof rules != 'object'
    || typeof handles != 'object'
    || (option.messages && typeof option.messages != 'object')
  ) {
    throw new Error('rules,handles,messages must be object')
  }
  const messages = merge(defaults.messages, option.messages || {})
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
  // const queryOptions = options.query || {}
  // const paramsOptions = options.params || {}
  const needValidates = Object.keys(options)
  return async function (ctx, next) {
    await next()
    needValidates.forEach(nv => {
      const params = analyze(ctx, nv)
      const option = options[nv]
      const pKeys = Object.keys(option)
      pKeys.forEach(key => {
        const ruleType = option[key].rules && option[key].rules.type
        const handleType = option[key].handles && option[key].handles.type || defaults.handle
        const messageType = option[key].messages && option[key].messages.type || defaults.messages.type
        if (ruleType) {
          const value = validators.type(params[key], ruleType)
          if (value !== false) {
            query[key] = value === true ? params[key] : value
          } else {
            handleType(ctx, messageType(key, params[key], ruleType))
            return
          }
        }
        handleValidate(key, params[key], option[key], ctx)
      })
    })
    // const { query = {} , params = {} } = ctx
    // const qKeys = Object.keys(queryOptions)
    // const pKeys = Object.keys(paramsOptions)

    // qKeys.forEach(key => {
    //   const ruleType = queryOptions[key].rules && queryOptions[key].rules.type
    //   const handleType = queryOptions[key].handles && queryOptions[key].handles.type || defaults.handle
    //   const messageType = queryOptions[key].messages && queryOptions[key].messages.type || defaults.messages.type
    //   if (ruleType) {
    //     const value = validators.type(query[key], ruleType)
    //     if (value !== false) {
    //       query[key] = value === true ? query[key] : value
    //     } else {
    //       handleType(ctx, messageType(key, query[key], ruleType))
    //       return
    //     }
    //   }
    //   handleValidate(key, query[key], queryOptions[key], ctx)
    // })
    // pKeys.forEach(key => {
    //   const ruleType = paramsOptions[key].rules && paramsOptions[key].rules.type
    //   const handleType = paramsOptions[key].handles && paramsOptions[key].handles.type || defaults.handle
    //   const messageType = paramsOptions[key].messages && paramsOptions[key].messages.type || defaults.messages.type      
    //   const value = validators.type(params[key], ruleType)
    //   if (value !== false) {
    //     params[key] = value === true ? params[key] : value
    //   } else {
    //     handleType(ctx, messageType(key, params[key]))
    //   }
    //   handleValidate(key, params[key], paramsOptions[key], ctx)
    // })
  }
}

fdValidator.messages = defaults.messages
fdValidator.handle = defaults.handle
fdValidator.validators = validators

module.exports = fdValidator
