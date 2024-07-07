# Request API

## request.baseUrl
路由器实例的 URL 路径
```js
var greet = express.Router()

greet.get('/jp', function (req, res) {
  console.log(req.baseUrl) // /greet
  res.send('Konichiwa!')
})

app.use('/greet', greet) // load the router on '/greet'
```
```js
app.use(['/gre+t', '/hel{2}o'], greet) // load the router on '/gre+t' and '/hel{2}o'
```

## request.body
包含请求正文中提交的数据的键值对。默认情况下，它是undefined，当您使用正文解析中间件（例如 `express.json()`或 `express.urlencoded()` ）时，它会被填充。
```js
var express = require('express')

var app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/profile', function (req, res, next) {
  console.log(req.body)
  res.json(req.body)
})
```
## request.cookies
当使用cookie-parser中间件时，此属性是包含请求发送的 cookie 的对象。如果请求不包含 cookie，则默认为 `{}`
```js
// Cookie: name=tj
console.dir(req.cookies.name)
// => 'tj'
```
如果 cookie 已经签名，则必须使用 `req.signedCookies`

## request.fresh
当响应在客户端的缓存中仍然“新鲜”时，将返回 `true`，否则 `false` 将返回以指示客户端缓存现已过时，应发送完整的响应
```js
console.dir(req.fresh)
// => true
```

## request.hostname
包含从 HTTP 标头派生的主机名Host。
```js
// Host: "example.com:3000"
console.dir(req.hostname)
// => 'example.com'
```

## request.ip
包含请求的远程 IP 地址
```js
console.dir(req.ip)
// => '127.0.0.1'
```

## request.METHOD
包含与请求的 HTTP 方法对应的字符串

## request.originalUrl
此属性与 非常相似req.url；但是，它保留了原始请求 URL
```js
// GET /search?q=something
console.dir(req.originalUrl)
// => '/search?q=something'
```
```js
app.use('/admin', function (req, res, next) { // GET 'http://www.example.com/admin/new?sort=desc'
  console.dir(req.originalUrl) // '/admin/new?sort=desc'
  console.dir(req.baseUrl) // '/admin'
  console.dir(req.path) // '/new'
  next()
})
```

## request.params
例如，如果您有路由 `/user/:name`，则 `“name”` 属性可用作 `req.params.name`。此对象默认为 `{}`
```js
// GET /user/tj
console.dir(req.params.name)
// => 'tj'
```

## request.path
包含请求URL的路径部分。
```js
// example.com/users?sort=desc
console.dir(req.path)
// => '/users'
``` 

## request.protocol
包含请求协议字符串：http或（对于 TLS 请求）https。
```js
console.dir(req.protocol)
// => 'http'
```

## request.query
包含请求URL的查询部分
```js
// example.com/users?sort=desc
console.dir(req.query)
// => { sort: 'desc' }
```

## request.route
包含与请求的 HTTP 方法对应的路由对象
```js
app.get('/user/:id?', function userIdHandler (req, res) {
  console.log(req.route)
  res.send('GET')
})
// 输出：
// { path: '/user/:id?',
//   stack:
//    [ { handle: [Function: userIdHandler],
//        name: 'userIdHandler',
//        params: undefined,
//        path: undefined,
//        keys: [],
//        regexp: /^\/?$/i,
//        method: 'get' } ],
//   methods: { get: true } }
```

## request.secure
包含一个布尔值，指示是否使用了 HTTPS
```js
console.dir(req.secure)
// => true
```

## request.signedCookies
当使用cookie-parser中间件时，此属性是包含请求发送的 cookie 的对象。这些 cookie 未经签名且可供使用, 已签名的 cookie 位于不同的对象中，以显示开发人员的意图；否则，可能会对 req.cookie值进行恶意攻击（这些值很容易被欺骗）。请注意，对 cookie 进行签名不会使其“隐藏”或加密；而只是防止篡改（因为用于签名的秘密是私密的）。
```js
// Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3
console.dir(req.signedCookies.user)
// => 'tobi'
``` 

## request.stale
表示请求是否“过时”，与 `req.fresh` 相反
```js
console.dir(req.stale)
// => true
```

## request.subdomains
包含请求的子域名
```js
// Host: "tobi.ferrets.example.com"
console.dir(req.subdomains)
// => ['ferrets', 'tobi']
```

## request.xhr
包含一个布尔值，指示请求是否为 XMLHttpRequest
```js
console.dir(req.xhr)
// => false
```

## request.accepts
设置响应的可接受类型
```js
// Accept: text/html
req.accepts('html')
// => "html"

// Accept: text/*;q=.5, application/json
req.accepts(['html', 'json'])
// => "json"
```
## request.acceptsCharsets
设置响应的可接受字符集
```js
// Accept-Charset: utf-8
req.acceptsCharsets('utf-8')
// => "utf-8"
```

## request.acceptsEncodings
设置响应的可接受编码
```js
// Accept-Encoding: gzip
req.acceptsEncodings('gzip')
// => "gzip"
```

## request.acceptsLanguages
设置响应的可接受语言
```js
// Accept-Language: en
req.acceptsLanguages('en')
// => "en"
```

## request.get(key)
从请求对象中获取指定的键的值
```js
req.get('Content-Type')
// => 'application/json'
```

## request.is(type)
检查请求是否为指定类型, 请求的“Content-Type”HTTP 标头字段与参数指定的 MIME 类型匹配, 返回一个布尔值, true 表示请求是指定类型，false 表示请求不是指定类型
```js
// With Content-Type: text/html; charset=utf-8
req.is('html')
// => 'html'

req.is('html')
// => false
```

## request.range(size [,callback])
设置响应的内容范围，size 为内容的字节数
```js
// parse header from request
var range = req.range(1000)

// the type of the range
if (range.type === 'bytes') {
  // the ranges
  range.forEach(function (r) {
    // do something with r.start and r.end
  })
}
```