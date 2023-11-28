## 创建 HTTP 服务
```js
// 导入 http 模块
const http = require('http')

// 创建服务器对象
const service = http.createServer((request, response) => {
  // 注意事项
  // 返回中文会乱码 - 解决办法设置响应头
  response.setHeader('content-type', 'text/html;charset=utf-8')

  // 响应信息
  response.end('你好')
  // response.end('hello world')
})

// 监听端口，启动服务 http默认端口80
service.listen(9000, () => {
  console.log('服务器初始化成功！');
})
```
## 提取 HTTP 请求报文
```js
// 导入 http 模块
const http = require('http')
// 导入 url 模块
const url = require('url')

// 创建服务器对象
const service = http.createServer((request, response) => {
  // 获取请求头信息
  console.log(request.method)      // 获取请求方法
  console.log(request.url)         // 获取请求地址
  console.log(request.httpVersion)  // 获取请求 HTTP 协议的版本号
  console.log(request.headers)      // 获取 HTTP 的请求头


  // 获取请求中的 body 信息，后面还有更简单的方法
  // 声  明一个变量
  let body = ''
  // 绑定 data 事件
  request.on('data', (chunk) => {
    body += chunk
  })
  // 绑定 end 事件，这个是 data 事件完成才会触发
  request.on('end', () => {
    console.log(body)
    // 响应信息
    request.end('hello world')
  })


  // 获取 HTTP 报文中 URL 的路径与查询字符串
  // （ 旧版 ）解析请求路径, 第二个参数可选，为 true 则可以解析出查询字符串
  let res = url.parse(request.url, true)
  console.log(res, '地址')
  
  // （ 新版 ） url 实例, 第二个参数，当前域名
  let url = new URL(request.url, 'http:127.0.0.1:9000')
  console.log(url.searchParams.get('keyword'))  // 通过 get 方法获取查询字符串
  console.log(url.pathname)   // 请求路径
})

// 监听端口，启动服务 http默认端口80
service.listen(9000, () => {
  console.log('服务器初始化成功！');
})
```


## 设置 HTTP 响应报文
```js
// 导入 http 模块
const http = require('http')

// 创建服务器对象
const service = http.createServer((request, response) => {
  // 设置响应头信息（可以自定义响应头）
  response.setHeader('content-type', 'text/html;charset=utf-8')

  // 设置响应状态码
  response.statusCode = 500

  // 响应状态描述(很少用)
  response.statusMessage = 'OK'

  // 设置响应体，每个请求必须有一个 end 方法
  response.write('你好你好')  // write 可多次调用
  response.end('你好')
})

// 监听端口，启动服务 http默认端口80
service.listen(9000, () => {
  console.log('服务器初始化成功！');
})
```


## 配置静态资源服务
```js
// 导入 http 模块
const http = require('http')
// 文件模块
const fs = require('fs')
// 导入 path 模块
const path = require('path')

// 常见 mime 类型
const mimes = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  json: 'application/json'
}
// 创建服务器对象
const service = http.createServer((request, response) => {
  let {pathname} = new URL(request.url, 'http:127.0.0.1:9000')

  if(pathname === '/favicon.ico') return response.end('')
  fs.readFile(path.resolve(__dirname, `.${pathname}`), (err, data) => {
    if(err) {
      response.setHeader('content-type', 'text/html;charset=utf-8')

      // 对多种错误进行处理
      switch (err.code) {
        case 'ENOENT':
          response.statusCode = 404
          response.end('<h1>404 Not Found</h1>')
        case 'EPERM':
          response.statusCode = 403
          response.end('<h1>403 Forbidden</h1>')
        default:
          response.statusCode = 500
          response.end('<h1>Internal Server Error</h1>')
      }
      return
    }

    const ext = path.extname(pathname).slice(1)
    const type = mimes[ext]
    // 浏览器默认有嗅探功能，会自动识别，可不写这个代码，主要是为了标准化
    if(type) {
      response.setHeader('content-type', `${type};charset=utf-8`)
    } else {
      // 对于未知的资源类型，可以选择 application/octet-stream 类型，浏览器在遇到该类型的响应时，
      // 会对响应体内容进行独立存储，也就是常见的下载效果
      response.setHeader('content-type', 'application/octet-stream')
    }

    response.end(data)
  })
})

// 监听端口，启动服务 http默认端口80
service.listen(9000, () => {
  console.log('服务器初始化成功！');
})
```