# Express
创建一个 Express 应用程序。该 `express()` 函数是模块导出的顶级函数 express。
```js
var express = require('express')
var app = express()
```

## express.json（[选项]）
:::warning
该中间件在 `Express v4.16.0` 及以上版本中可用。
:::
解析传入的 JSON 请求数据

## express.raw（[选项]）
:::warning
该中间件在 Express v4.17.0 及以上版本中可用。
:::
它将传入请求数据解析为 `Buffer` 对象

## express.Router（[选项]）
创建一个新的路由器对象

## express.static（根，[选项]）
提供静态文件服务

## express.text（[选项]）
它将传入的请求数据解析为字符串

## express.urlencoded（[选项]）
解析传入的请求，其中包含 urlencoded 的有效数据

## app.locals
该 app.locals 对象具有应用程序内的局部变量的属性
```js
app.locals.title = 'My App'
app.locals.strftime = require('strftime')
app.locals.email = 'me@myapp.com'
```

## app.on（'mount'，回调（父级））
mount 当子应用安装在父应用上时，会触发此事件。父应用会传递给回调函数。
```js
var admin = express()

admin.on('mount', function (parent) {
  console.log('Admin Mounted')
  console.log(parent) // refers to the parent app
})
```

## app.all（路径，回调[，回调...]）
此方法类似于标准 app.METHOD() 方法，但它匹配所有 HTTP 请求。
### 例子
`/secret` 无论使用 GET、POST、PUT、DELETE 还是任何其他 HTTP 请求方法，都会执行以下回调：
```js
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})

```
```js
app.all('*', loadUser)
```
另一个示例是白名单“全局”功能。该示例与上面的示例类似，但它仅限制以 `“/api”` 开头的路径：
```js
app.all('/api/*', requireAuthentication)
```

## app.delete（路径，回调[，回调...]）
使用指定的回调函数将 HTTP `DELETE` 请求路由到指定路径

## app.disable(name)
将 `name` 设置为 `false`。`app.set('foo', false)` 相同于 `app.disable('foo')`
```js
app.disable('trust proxy')
```

## app.disabled(name)
返回 `name` 是否被禁用
```js
app.disabled('trust proxy')
// => true
```

## app.enable(name)
将 `name` 设置为 `true`。`app.set('foo', true)` 相同于 `app.enable('foo')`

## app.engine（ext，回调）  
注册模板引擎

## app.get（名称）
name 返回应用设置的值
```js
app.get('title')
// => undefined
```

## app.get（路径，回调[，回调...]）
回调函数将 HTTP GET 请求路由到指定路径
```js
app.get('/', function (req, res) {
  res.send('GET request to homepage')
})
```

## app.listen（[端口[，主机[，积压]]][，回调]）
绑定并侦听指定主机和端口上的连接

## app.METHOD（路径，回调[，回调...]）
路由 HTTP 请求，其中 METHOD 是请求的 HTTP 方法，例如 `GET`、`PUT`、`POST` 等（小写）

Express 支持以下与同名 HTTP 方法对应的路由方法：

`mkcol` `move` `m-search` `notify` `options` `purge` `put` `report` `search` `subscribe` `trace` `unlock` `unsubscribe` `patch` `post` `checkout` `copy` `delete` `get` `head` `lock` `merge` `mkactivity`

## app.param（[名称]，回调）
为路由参数添加回调触发器，其中 `name` 是参数名称或参数数组，`callback` 是回调函数。回调函数的参数依次为请求对象、响应对象、下一个中间件、参数值、参数名称。
```js
app.param(['id', 'page'], function (req, res, next, value) {
  console.log('CALLED ONLY ONCE with', value)
  next()
})

app.get('/user/:id/:page', function (req, res, next) {
  console.log('although this matches')
  next()
})

app.get('/user/:id/:page', function (req, res) {
  console.log('and this matches too')
  res.end()
})
```
`app.param(callback)，从 v4.11.0 开始它已被弃用`

## app.path()
返回应用程序的规范路径（一个字符串）。
```js
var app = express()
var blog = express()
var blogAdmin = express()

app.use('/blog', blog)
blog.use('/admin', blogAdmin)

console.dir(app.path()) // ''
console.dir(blog.path()) // '/blog'
console.dir(blogAdmin.path()) // '/blog/admin'
```
在安装的应用程序复杂的情况下，此方法的行为会变得非常复杂：通常最好使用 `req.baseUrl` 来获取应用程序的规范路径。

## app.render（视图，[本地]，回调）
通过函数返回视图的渲染 HTML callback。它接受一个可选参数，该参数是包含视图局部变量的对象
```js
app.render('email', function (err, html) {
  // ...
})
app.render('email', { name: 'Tobi' }, function (err, html) {
  // ...
})
```

## app.route（路径）
返回单个路由的实例，然后您可以使用该实例通过可选中间件处理 HTTP 动词。使用它app.route()可以避免路由名称重复（从而避免拼写错误）。
```js
var app = express()

app.route('/events')
  .all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
  })
  .get(function (req, res, next) {
    res.json({})
  })
  .post(function (req, res, next) {
    // maybe add a new event...
  })
  ```

## app.set（名称，值）
设置分配 `name` 给 `value`。您可以存储任何您想要的值，但某些名称可用于配置服务器的行为
```js
app.set('title', 'My Site')
app.get('title') // "My Site"
```

## app.use（[路径，]回调[，回调...]）
在指定路径上挂载指定的中间件函数：当请求路径的基础匹配时，执行中间件函数 path

## router.all(路径，[回调，...] 回调)
此方法与方法类似 `router.METHOD()` ，只是它匹配所有 HTTP 请求。
```js
router.all('*', requireAuthentication, loadUser)

router.all('/api/*', requireAuthentication)
```

## router.METHOD(路径，[回调，...] 回调)
router.METHOD()方法提供了 Express 中的路由功能，其中 METHOD 是 HTTP 方法之一，例如 `get`、`post` 等。

## router.param(名称，回调)
在路由中添加参数，该参数可用于在回调函数中访问。
```js
router.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE')
  next()
})

router.get('/user/:id', function (req, res, next) {
  console.log('although this matches')
  next()
})

router.get('/user/:id', function (req, res) {
  console.log('and this matches too')
  res.end()
})
```

## router.route(路径)
返回单个路由的实例，然后您可以使用该实例通过可选中间件处理 HTTP 动词。使用它router.route()可以避免路由名称重复（从而避免拼写错误）。
```js
router.route('/users/:user_id')
  .all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next()
  })
  .get(function (req, res, next) {
    res.json(req.user)
  })
  .put(function (req, res, next) {
    // just an example of maybe updating the user
    req.user.name = req.params.name
    // save user ... etc
    res.json(req.user)
  })
  .post(function (req, res, next) {
    next(new Error('not implemented'))
  })
  .delete(function (req, res, next) {
    next(new Error('not implemented'))
  })
```

## router.use（[路径，]回调[，回调...]）
在指定路径上挂载指定的中间件函数：当请求路径的基础匹配时，执行中间件函数 path

`顺序决定了中间件的优先级`
```js
var express = require('express')
var app = express()
var router = express.Router()

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path)
  next()
})

// this will only be invoked if the path starts with /bar from the mount point
router.use('/bar', function (req, res, next) {
  // ... maybe some additional /bar logging ...
  next()
})

// always invoked
router.use(function (req, res, next) {
  res.send('Hello World')
})

app.use('/foo', router)

app.listen(3000)
```













