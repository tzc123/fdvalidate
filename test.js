const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new Koa()
const fdValidator = require('./index')

const options = {
  query: {
    a: {
      rules: {
        required: true,
        type: 'string',
        maxLength: 5,
        minLength: 2,
      },
      messages: {
        // required(ctx, message) {
          
        // }
      },
      handles: {
        required(ctx, message) {
          console.log(ctx, message)
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