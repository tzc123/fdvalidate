const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new Koa()
const fdValidator = require('./index')

fdValidator.validators.is0 = function (value, rule) {
  console.log(value, rule)
  return value == 0
}

const options = {
  query: {
    username: {
      rules: {
        is0: true,
        required: true
      },
      messages: {
        is0: function (key, value, rule) {
          return '没有0'
        }
      },
      handlers: {
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