const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new Koa()
const fdValidator = require('./index')

const options = {
  query: {
    username: {
      rules: {
        type: 'phone',
        required: true
      },
      messages: {
        maxLength(key, value, rule) {
          return `query ${key} ${value} is longer then ${rule}`
        }
      },
      handles: {
        maxLength(ctx, message, rule) {
          ctx.body = {
            success: false,
            message: message,
            maxLength: rule
          }
        }
      }
    }
  }
}

router.get('/', fdValidator(options), ctx => {
  ctx.body = {
    success: true
  }
})

app.use(router.routes())

app.listen(3000, function () {
  console.log('server start at port 3000')
})