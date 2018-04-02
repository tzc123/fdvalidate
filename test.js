const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new Koa()
const body = require('koa-body');
const fdValidator = require('./src/index')

const options = {
  query: {
    rules: {
      required: true,
      type: 'number',
      minLength: 2
    },
    messages: {
      required() {
        return 'haha is required'
      }
    },
    handlers: {
      required(ctx, message) {
        ctx.body = {
          message
        }
      }
    }
  },
  'request.body': {
    haha: {
      rules: {
        required: true,
        type: 'number',
        minLength: 2
      },
      messages: {
        required() {
          return 'haha is required'
        }
      },
      handlers: {
        required(ctx, message) {
          ctx.body = {
            message
          }
        }
      }
    }
  }
}

router.post('/', fdValidator(options), ctx => {
  ctx.body = {
    success: true
  }
})

app.use(body())

app.use(router.routes())

app.listen(3000, function () {
  console.log('server start at port 3000')
})