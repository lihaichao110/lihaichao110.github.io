# Response API


## response.headersSent
包含一个布尔值，指示响应是否已经发送
```js
app.get('/', function (req, res) {
  console.dir(res.headersSent) // false
  res.send('OK')
  console.dir(res.headersSent) // true
})
```

## response.locals
设置响应的本地变量
```js
app.use(function (req, res, next) {
  res.locals.user = req.user
  res.locals.authenticated = !req.user.anonymous
  next()
})
```

## response.append（字段[，值]）
设置响应的字段值, 该方法可以接受多个参数, 其中第一个参数是字段，后面的参数是值, 如果没有指定值，则该字段将被删除.
```js
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
```

## response.attachment(filename)
设置响应的文件名, 将 HTTP 响应Content-Disposition头字段设置为“attachment”。
```js
res.attachment()
// Content-Disposition: attachment

res.attachment('file.txt')
// Content-Disposition: attachment; filename="file.txt"
```

## response.cookie(name, value[, options])
- options:

| key | type | description |
| --- | --- | --- |
| domain | string | Cookie 的域名。默认为应用程序的域名。 |
| encode | function | 用于编码 Cookie 值的函数。默认为 `encodeURIComponent`。 |
| expires | Date | Cookie 的过期时间。 |
| httpOnly | boolean | 仅用于 HTTP 协议。默认为 `true`。 |
| maxAge | number | 以秒为单位的 Cookie 的过期时间。 |
| path | string | Cookie 的路径。默认为 `/`。 |
| secure | boolean | 仅用于 HTTPS 协议。默认为 `false`。 |
| signed | boolean | 指示是否应对 cookie 进行签名, 默认为 `false` |
| sameSite | string | 用于设置 Cookie 的 `SameSite` 值。|
```js
res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
```
您可以通过多次调用在单个响应中设置多个 cookie，例如：
```js
res
  .status(201)
  .cookie('access_token', 'Bearer ' + token, {
    expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
  })
  .cookie('test', 'test')
  .redirect(301, '/admin')

```

## response.clearCookie(name [, options])
清除指定的 Cookie name 
```js
res.cookie('name', 'tobi', { path: '/admin' })
res.clearCookie('name', { path: '/admin' })
```

## response.download(path [, filename] [, options] [, callback])
响应下载文件
```js
res.download('/report-12345.pdf', 'report.pdf')
```

## response.end(data [, encoding])
结束响应
```js
res.end('Hello World!')
```

## response.format(obj)
格式化响应, 根据请求的 Accept 头决定响应的格式, 如 `application/json`、`text/html` 等.
```js
res.format({
  'text/plain': function () {
    res.send('hey')
  },

  'text/html': function () {
    res.send('<p>hey</p>')
  },

  'application/json': function () {
    res.send({ message: 'hey' })
  },

  default: function () {
    // log the request and respond with 406
    res.status(406).send('Not Acceptable')
  }
})
```
除了规范化的 MIME 类型之外，您还可以使用映射到这些类型的扩展名，以实现稍微不那么冗长的实现：
```js
res.format({
  text: function () {
    res.send('hey')
  },

  html: function () {
    res.send('<p>hey</p>')
  },

  json: function () {
    res.send({ message: 'hey' })
  }
})
```

## response.get(key)
获取响应头的字段值
```js
res.get('Content-Type')
// => "text/plain; charset=utf-8"
```

## response.json(data)
设置响应为 JSON 格式, 同时设置 `Content-Type` 为 `application/json`。

该参数可以是任何 JSON 类型，包括`对象`、`数组`、`字符串`、`布尔值`、`数字或` `null`，您也可以使用它将其他值转换为 JSON。


```js
res.json(null)
res.json({ user: 'tobi' })
res.status(500).json({ error: 'message' })
```
## response.jsonp(data)
发送支持 JSONP 的 JSON 响应。此方法与 相同 `res.json()`，只是它选择加入 JSONP 回调支持。
```js
res.jsonp(null)
// => callback(null)

res.jsonp({ user: 'tobi' })
// => callback({ "user": "tobi" })

res.status(500).jsonp({ error: 'message' })
// => callback({ "error": "message" })
```
以下是使用相同代码的 JSONP 响应的一些示例：
```js
// ?callback=foo
res.jsonp({ user: 'tobi' })
// => foo({ "user": "tobi" })

app.set('jsonp callback name', 'cb')

// ?cb=foo
res.status(500).jsonp({ error: 'message' })
// => foo({ "error": "message" })
```
## response.links(links)
设置响应的链接, 例如以下调用：
```js
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=5'
})
```
产生以下结果：
```js
Link: <http://api.example.com/users?page=2>; rel="next",
      <http://api.example.com/users?page=5>; rel="last"
```

## response.location([url])
设置响应的 `Location` 值, 例如以下调用：
```js
res.location('/foo/bar')
res.location('http://example.com')
res.location('back')
```

## response.redirect(url)
重定向响应, 重定向可以是用于重定向到其他站点的完全限定 URL：
```js
res.redirect('/foo/bar')

res.redirect(301, 'http://example.com')

res.redirect('http://google.com')
```
重定向可以相对于主机名的根目录进行。例如，如果应用程序处于 状态  `http://example.com/admin/post/new`，则以下内容将重定向到 URL `http://example.com/admin`：
```js
res.redirect('/admin')
```
重定向可以相对于当前 URL。例如，从 `http://example.com/blog/admin/`（注意末尾的斜杠） ，以下内容将重定向到 URL `http://example.com/blog/admin/post/new`。
```js
res.redirect('post/new')
```
路径相对重定向也是可能的。如果您在 `http://example.com/admin/post/new`，则以下内容将重定向到 `http://example.com/admin/post`：
```js
res.redirect('..')
```
重定向back会将请求重定向回 `referer` ，当 `/referer` 缺失时则默认重定向。
```js
res.redirect('back')
```

## response.render(view, [locals] [, callback])
渲染 view 并将渲染后的 HTML 字符串发送到客户端。可选参数：
- `locals`：用于渲染视图的对象，可以是任何 JavaScript 对象
- `callback`：当渲染视图时使用的回调函数，可选
```js
res.render('user', { name: 'Tobi' }, function (err, html) {
  // ...
})
```

## response.send(data)
将数据发送到客户端, 参数可以是任何 JavaScript 对象
```js
res.send(Buffer.from('whoop'))
res.send({ some: 'json' })
res.send('<p>some html</p>')
res.status(404).send('Sorry, we cannot find that!')
res.status(500).send({ error: 'something blew up' })
```
## response.sendFile(path [, options] [, callback])
`res.sendFile()由 Express v4.8.0 及以上版本支持。`

传输文件, path 为文件的路径
```js
app.get('/file/:name', function (req, res, next) {
  var options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})
```
## response.sendStatus(code)
设置响应的状态码，例如 `200`、`201`、`204`、`304`、`400`、`401`、`403`、`404`、`500` 等。
```js
res.sendStatus(200)
```

## response.set(field, value)
将响应的 HTTP 标头设置 `field` 为 `value`。要一次设置多个字段，请传递一个对象作为参数。
```js
res.set('Content-Type', 'text/plain')

res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  ETag: '12345'
})
```
别名为 `res.header(field [, value])`。

## response.status(code)
设置响应的状态码，例如 `200`、`201`、`204`、`304`、`400`、`401`、`403`、`404`、`500` 等。
```js
res.status(403).end()
res.status(400).send('Bad Request')
res.status(404).sendFile('/absolute/path/to/404.png')
```

## response.type(type)
设置响应的 MIME 类型, 例如 `text/plain`、`text/html`、`application/json` 等。
```js
res.type('.html')
// => 'text/html'
res.type('html')
// => 'text/html'
res.type('json')
// => 'application/json'
res.type('application/json')
// => 'application/json'
res.type('png')
// => 'image/png'
```

## response.vary(field)
设置响应的 `Vary` 标头，以便多个字段间区分, Vary如果该字段尚不存在，则将其添加到响应头中。
```js
res.vary('User-Agent').render('docs')
```