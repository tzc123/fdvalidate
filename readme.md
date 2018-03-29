### 使用
```javascript
const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new Koa()
const fdValidator = require('./index')

const options = {
  query: {
    username: {
      // 校验的规则
      rules: {
        required: true,
        maxLength: 10,
        minLength: 5
      },
      // 校验失败时消息，若不设置，则采用默认消息  
      messages: {
        maxLength(key, value, rule) {
          return `query ${key} ${value} is longer then ${rule}`
        }
      },
      // 校验失败时，所做的处理函数，若不设置，则采用默认处理函数
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

// 可设置默认消息生成函数、处理函数
fdValidator.defaults.messages.maxLength = function (key, value, rule) {

}

fdValidator.defaults.handle = function (ctx, message, rule) {

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
```

### 目前支持规则
* required 是否必填
* type 数据类型
  * number
  * string
  * array
  * object
* max 最大值
* min 最小值
* maxLength 最大长度
* minLength 最小长度
* fixed 固定长度

### 提示
尽量避免校验规则冲突，如：
```javascript
{
  type: 'object',
  maxlength: '5'
}
```
将无视maxLength