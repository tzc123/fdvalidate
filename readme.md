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
        type: 'string',
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
      handlers: {
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
fdValidator.messages.maxLength = function (key, value, rule) {
  return `${key}超出长度了`
}

fdValidator.handler = function (ctx, message, rule) {
  ctx.body = {
    success: false,
    message: '参数错误'
  }
}
// 添加或重写校验规则， 添加校验规则后必须要添加相应的消息生成函数
fdValidator.validators.ID = function (value) {
  const IDRegExp = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return IDRegExp.test(value)
}

fdValidator.messages.ID = function (key, value, rule) {
  return `${key} 不是身份证号`
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

### supported validate rules
* required 是否必填
* type 数据类型
  * number
  * string
  * array
  * object
  * phone 手机号码
  * email 邮箱号
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