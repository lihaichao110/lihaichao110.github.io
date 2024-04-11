# express 框架
## 初体验
```js
// 导入 express
const express = require('express')

// 创建应用对象
const app = express()

// 创建路由规则
// app.[methods](url, [callback])
app.get('/', (req, res) => {
  res.send('hello world')
})

// 上面所有请求都没走，则返回 404 响应
app.all('*', (req, res) => {
  res.end('404 not found')
})

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

## 获取请求报文参数
```js
// 导入 express
const express = require('express')

// 创建应用对象
const app = express()

// 创建路由规则
// app.[methods](url, [callback])
app.get('/', (req, res) => {
  // 原生操作
  console.log(req.method)
  console.log(req.url)
  console.log(req.httpVersion)
  console.log(req.headers)

  // express 操作
  console.log(req.path)
  console.log(req.query)
  // 获取请求的ip
  console.log(req.ip)
  // 获取请求头中的某一个属性
  console.log(req.get('host'))

  res.send('hello world')
})

// 动态路由参数
app.get('/user/:id', (req, res) => {
  // 获取 URL 中的动态路由参数
  console.log(req.params.id)

  res.send('hello user')
})

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```


## 设置响应信息
```js
// 导入 express
const express = require('express')

// 创建应用对象
const app = express()

// 创建路由规则
app.get('/', (req, res) => {
  // 原生响应
  // res.statusCode = 404
  // res.statusMessage = 'lhc'
  // res.setHeader('xxx', 'yyy')
  // res.write('hello world')
  // res.end('express')

  // express 响应
  // res.status(404)
  // res.set('aaa', 'bbb')
  // res.send('express')

  // 可以链式调用
  // res.status(500).set('ccc', 'ddd').send('express')

  // 其他一些响应
  res.redirect('http:www.baidu.com')           // 设置重定向地址
  res.download(__dirname + '/package.json')    // 下载响应
  res.sendFile(__dirname + '/index.html')      // 响应文件内容
  // 响应 json 数据
  res.json({
    name: 'lihaichao',
    age: 18
  })
})


// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

## 全局中间件&路由中间件
```js
// 导入 express 模块，并创建一个新的应用对象
const app = require('express')()

// 分为：全局中间件 和 路由中间件
// 声明全局中间件
function recordMiddleware(req, res, next) {
  console.log('全局中间件')
  next()
}

// 声明路由中间件
const checkCodeMiddleware = (req, res, next) => {
  if(+req.query.code === 521) {
    next()
  } else {
    res.send('暗号错误')
  }
} 

// 使用中间件
app.use(recordMiddleware)

// 声明路由中间件
app.get('/', (req, res) => {
  res.send('hello world')
})

// 请求参数必须携带 code 参数, 并且等于 521
// 使用路由中间件
app.get('/setting', checkCodeMiddleware, (req, res) => {
  res.send('setting')
})

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```


## 静态资源中间件
```js
// 导入 express
const express = require('express')

// 创建应用对象
const app = express()


// 创建路由规则
app.get('/', (req, res) => {
  res.send('hello world')
})

// 静态资源中间件设置
app.use(express.static(__dirname + '/assets'))

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

## 获取 POST 请求体数据
```js
// 要安装这个插件
// npm i body-parser

// 导入 express
const express = require('express')
const bodyParser = require('body-parser')

// 创建应用对象
const app = express()

// 创建解析 json 格式数据的中间件
const jsonParser = bodyParser.json()

// 创建解析 application/x-www-form-urlencoded 的表单数据的中间件
const urlencodedParser = bodyParser.urlencoded({ extended: false })


// 创建路由规则
// 响应静态资源文件
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// 获取请求体数据，进行登录
app.post('/login', urlencodedParser, (req, res) => {
  // 获取请求体数据
  console.log(req.body)

  res.send('login')
})

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

## 防盗链实现
```js
// 导入 express
const express = require('express')

// 创建应用对象
const app = express()
app.use((req, res, next) => {
  // 获取请求头中 referer 字段
  const referer = req.get('referer')

  // 检查 referer 是否为空
  if(referer) {

    // 创建 URL 对象， 
    const url = new URL(referer)
    
    // 根据 hostname 字段读取请求域名 检查 referer 是否为 localhost
    if(url.hostname !== 'localhost') {
      res.status(403).send('禁止访问')
      return
    }
  } 
  next()
})


// 静态资源中间件设置
app.use(express.static(__dirname + '/assets'))

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

## 路由模块化
### 1. 在目录中新建 routes 文件夹，新增 homeRouter.js 文件
```js
// 导入 express 模块
const express = require('express')

// 创建路由对象
const router = express.Router()

// 创建路由规则
router.get('/', (req, res) => {
  res.send('hello world')
})

router.get('/home', (req, res) => {
  res.send('home')
})

// 导出路由对象
module.exports = router
```

### 2. 在主文件中引入路由模块，进行挂载文件
```js
// 导入 express
const express = require('express')
// 导入路由模块
const home = require('./routes/homeRouter')

// 创建应用对象
const app = express()

// 挂载路由
app.use(home)
// 可设置路由前缀
// app.use('/user', home)

// 上面所有请求都没走，则返回 404 响应
app.all('*', (req, res) => {
  res.end('404 not found')
})

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

## 模板引擎 - ejs
### ejs 初体验
```js
// 安装 ejs 模块
// npm i ejs

// 导入 ejs 模块
const ejs = require('ejs')

const china = '中国'
const result = ejs.render('我爱你 <%= china %>', { china: china })
console.log(result)
```

### ejs 列表渲染
```js
const ejs = require('ejs')

const xiyou = [ '唐僧', '孙悟空', '猪八戒', '沙僧' ]

// 渲染列表
let result = ejs.render(`
  <ul>
    <% xiyou.forEach(item => { %>
      <li><%= item %></li>
    <% }) %>
  </ul>
`, {
  xiyou: xiyou
})

console.log(result);
```

### ejs 条件渲染
```js
const ejs = require('ejs')
const fs = require('fs')

const isLogin = false

// 可将结构放入 html 文件中，使用 fs 模块读取内容
// let html = fs.readFileSync('地址').toString()
// const result = ejs.render(html, { isLogin })
let result = ejs.render(`
  <% if(isLogin){ %>
    <span>欢迎回来</span>
  <% } else { %>
    <span>登录</span>
  <% } %>
`, {
  isLogin
})

console.log(result)
```

### express 中使用 ejs
```js
/**
 * npm i express
 * npm i ejs
 */
// 导入 express
const express = require('express')
const path = require('path')

// 创建应用对象
const app = express()

// 设置模版引擎
app.set('view engine', 'ejs')
// 设置模板文件存放位置，模板文件：具有模板语法的内容
app.set('views', path.resolve(__dirname, './views'))

// 创建路由规则
app.get('/', (req, res) => {
  const title = 'nodejs - ejs'
  res.render('home', {title})
})


// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

### express-generator
```js
// npx express-generator -e [文件夹名称]
// 生成 nodejs 项目，使用 ejs 模版规范
```

### 处理文件上传
```js
var express = require('express');
const formidable = require('formidable')
const path = require('path')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 显示网页表单
router.get('/portrait', (req, res) => {
  res.render('portrait')
})

// 处理文件上传
router.post('/portrait', (req, res) => {
  // 创建 form 独享
  const form = formidable({ 
    multiples: true,
    // 设置上传文件的保存目录
    uploadDir: path.resolve(__dirname, '../public/images'),
    // 保持文件后缀
    keepExtensions: true
  })

  // 解析请求报文
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    let url = '/images/' + files.file.newFilename
    res.send(url);
  })
})

module.exports = router
```
```html
<!-- portrait.ejs 文件中 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <form action="http://127.0.0.1:3000/portrait" method="post" enctype="multipart/form-data">
    <input type="text" name="username">
    <input type="file" name="file">
    <button type="submit">上传</button>
  </form>
</body>
</html>
```

## mongoose 数据库
> 本地数据库 lowdb，方便在本地实现数据库交互
### 连接数据库
```js
// 安装 mongoose
// npm i  mongoose

// 导入 mongoose
const mongoose = require('mongoose')

// mongodb 数据库连接, 配置参数为了消除警告
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

// 设置回调函数
const db = mongoose.connection
db.on('error', () => {
  console.log('数据库连接失败')
})

// 官方推荐用 once，而不是 on
db.once('open', () => {
  console.log('数据库连接成功')
})

db.on('close', () => {
  console.log('数据库断开连接')
})

setTimeout(() => {
  mongoose.disconnect()  // 关闭数据库连接
}, 2000);
```

### 创建新文档
```js
// 安装 mongoose
// npm i  mongoose

// 导入 mongoose
const mongoose = require('mongoose')

// mongodb 数据库连接, 配置参数为了消除警告
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

// 设置回调函数
const db = mongoose.connection
db.on('error', () => {
  console.log('数据库连接失败')
})

db.once('open', () => {
  console.log('数据库连接成功')
  // 创建文档的结构对象
  const BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number,
  })

  // 创建文档模型对象
  const BookModel = mongoose.model('books', BookSchema)

  // 新增数据
  const book = new BookModel({
    name: '红楼梦',
    author: '海悦',
    price: 10,
  })

  // 保存文档
  book.save().then((data) => {
    console.log('文档保存成功', data)

    // 关闭数据库连接
    mongoose.disconnect()
  })

})

db.on('close', () => {
  console.log('数据库断开连接')
})

```

### 字段类型
| 类型 | 描述 |
| --- | --- |
| String | 字符串 |
| Number | 数字 |
| Boolean | 布尔 |
| Array | 数组 |
| Date | 日期 |
| Buffer | 二进制，Buffer 对象 |
| Regex | 正则表达式 |
| Mixed | 任意类型, 可以是任意值, 但是不推荐, 因为不可预测, 可能会被覆盖, `mongoose.Schema.Types.Mixed` |
| ObjectId | ObjectId，对象ID，`mongoose.Schema.Types.ObjectId` |
| Decimal128 | 128位浮点数, `mongoose.Schema.Types.Decimal128` |

### 字段验证
```js
// 安装 mongoose
// npm i  mongoose

// 导入 mongoose
const mongoose = require('mongoose')

// mongodb 数据库连接, 配置参数为了消除警告
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

// 设置回调函数
const db = mongoose.connection
db.on('error', () => {
  console.log('数据库连接失败')
})

db.once('open', () => {
  console.log('数据库连接成功')
  // 创建文档的结构对象
  const BookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true, // 该属性不可为空  
      unique: true,  // 该属性不可重复
    },
    author: {
      type: String,
      default: '默认值',  // 默认值
    },
    style: {
      type: String,
      enum: ['红楼梦', '水浒传', '三国演义'],  // 枚举值
    },
    price: Number,
  })

  // 创建文档模型对象
  const BookModel = mongoose.model('books', BookSchema)

  // 新增数据
  const book = new BookModel({
    name: '测试',
    author: 'xixi',
    style: '水浒传',
    price: 10,
  })

  // 保存文档
  book.save().then((data) => {
    console.log('文档保存成功', data)

    // 关闭数据库连接
    mongoose.disconnect()
  })

})

db.on('close', () => {
  console.log('数据库断开连接')
})

```

### 删除文档数据
```js
// 安装 mongoose
// npm i  mongoose

// 导入 mongoose
const mongoose = require('mongoose')

// mongodb 数据库连接, 配置参数为了消除警告
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

// 设置回调函数
const db = mongoose.connection
db.on('error', () => {
  console.log('数据库连接失败')
})

db.once('open', () => {
  console.log('数据库连接成功')
  // 创建文档的结构对象
  const BookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true, // 该属性不可为空  
      unique: true,  // 该属性不可重复
    },
    author: {
      type: String,
      default: '默认值',  // 默认值
    },
    style: {
      type: String,
      enum: ['红楼梦', '水浒传', '三国演义'],  // 枚举值
    },
    price: Number,
  })

  // 创建文档模型对象
  const BookModel = mongoose.model('books', BookSchema)

  // 删除一条数据
  // BookModel.deleteOne({
  //   name: '测试',
  // }).then((data) => {
  //   console.log('文档删除成功', data)
  // })

  // 批量删除数据
  BookModel.deleteMany({
    id: 2,
  }).then((data) => {
    console.log('文档删除成功', data)
  })
})

db.on('close', () => {
  console.log('数据库断开连接')
})

```

### 更新文档数据
```js
// 安装 mongoose
// npm i  mongoose

// 导入 mongoose
const mongoose = require('mongoose')

// mongodb 数据库连接, 配置参数为了消除警告
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

// 设置回调函数
const db = mongoose.connection
db.on('error', () => {
  console.log('数据库连接失败')
})

db.once('open', () => {
  console.log('数据库连接成功')
  // 创建文档的结构对象
  const BookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true, // 该属性不可为空  
      unique: true,  // 该属性不可重复
    },
    author: {
      type: String,
      default: '默认值',  // 默认值
    },
    style: {
      type: String,
      enum: ['红楼梦', '水浒传', '三国演义'],  // 枚举值
    },
    price: Number,
  })

  // 创建文档模型对象
  const BookModel = mongoose.model('books', BookSchema)

  // 更新文档，更新一条数据
  // 参数一：条件
  // 参数二：更新内容
  // 参数三：选项
  // promise 回调函数
  BookModel.updateOne({
    name: '测试',
  }, {
    name: '测试123',
  }).then((data) => {
    console.log('文档更新成功', data)
  })

  // 更新文档，更新多条数据
  BookModel.updateMany({
    name: '测试',
  }, {
    name: '测试123',
  })
})

db.on('close', () => {
  console.log('数据库断开连接')
})

```

### 读取文档数据
```js
// 安装 mongoose
// npm i  mongoose

// 导入 mongoose
const mongoose = require('mongoose')

// mongodb 数据库连接, 配置参数为了消除警告
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

// 设置回调函数
const db = mongoose.connection
db.on('error', () => {
  console.log('数据库连接失败')
})

db.once('open', () => {
  console.log('数据库连接成功')
  // 创建文档的结构对象
  const BookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true, // 该属性不可为空  
      unique: true,  // 该属性不可重复
    },
    author: {
      type: String,
      default: '默认值',  // 默认值
    },
    style: {
      type: String,
      enum: ['红楼梦', '水浒传', '三国演义'],  // 枚举值
    },
    price: Number,
  })

  // 创建文档模型对象
  const BookModel = mongoose.model('books', BookSchema)

  // 读取文档，读取一条数据
  BookModel.findOne({
    name: '测试',
  }, (data) => {
    console.log('文档读取成功', data)
  })

  // 读取文档，根据 ID 获取
  BookModel.findById('id', (data) => {
    console.log('文档读取成功', data)
  })

  // 读取文档，批量读取
  BookModel.find({
    name: '测试',
  }, (data) => {
    console.log('文档读取成功', data)
  })

  // 读取所有数据
  BookModel.find({}, (data) => {
    console.log('文档读取成功', data)
  })
})

db.on('close', () => {
  console.log('数据库断开连接')
})

```

### 条件控制
> 在 mongodb 不能使用运算符，需要使用替代符号

- `>` 使用 `$gt`
- `<` 使用 `$lt`
- `>=` 使用 `$gte`
- `<=` 使用 `$lte`
- `===` 使用 `$eq`
- `!==` 使用 `$ne`

```js
db.student.find({ score: { $gt: 80 } })
```

**逻辑或的情况 ||**
```js
db.student.find({ $or: [ { age: 18 }, { age: 20 } ] })
```

**逻辑非的情况 !**
```js
db.student.find({ $nor: [ { age: {$lt: 18} }, { age: {$gt: 20} } ] })
```

**逻辑与的情况 &&**
```js
db.student.find({ $and: [ { age: 18 }, { age: 20 } ] })
```

**正则表达式 new RegExp(正则)**
```js
db.student.find({ name: { $regex: /a/ } })
```

### 个性化读取
**字段筛选**
```js
// 0：不读取
// 1：读取
// const BookModel = mongoose.model('books', BookSchema)
BookModel.find().select({ name: 1, _id: 0}).exec((err, data) => {
  if (err) return res.json({ code: 1, msg: err.message })
  return res.json({ code: 0, data })
})
```

**数据排序**
```js
// sort 排序
// 1：升序
// -1：降序
BookModel.find().sort({ name: 1 }).exec((err, data) => {
  if (err) return res.json({ code: 1, msg: err.message })
  return res.json({ code: 0, data })
})
```

**数据截取**
```js
// skip 跳过
// limit 限制
BookModel.find().skip(2).limit(2).exec((err, data) => {
  if (err) return res.json({ code: 1, msg: err.message })
  return res.json({ code: 0, data })
})
```

### mongoose 代码模块化
**新增 config文件夹，创建 index.js 文件**
```js
module.exports = {
  DBHOST: '127.0.0.1',
  DBPORT: 27017,
  DBNAME: 'test',
}
```
**新增 db 文件夹，创建 db.js 文件**

抽离连接数据库代码，为公共代码
```js
/**
 * mongoose 模块化
 * @param {*} success 数据库连接成功回调
 * @param {*} error 数据库连接失败回调
 */
const { DBHOST, DBNAME, DBPORT } = require('../config/index')
module.exports = function(success, error) {
  if(typeof error !== 'function') {
    error = () => {
      console.log('没有传错误回调哦~~~')
    }
  }
  // 安装 mongoose
  // npm i  mongoose
  
  // 导入 mongoose
  const mongoose = require('mongoose')
  
  // mongodb 数据库连接, 配置参数为了消除警告
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
  
  // 设置回调函数
  const db = mongoose.connection
  db.on('error', () => {
    console.log('数据库连接失败')
    error()
  })
  
  db.once('open', () => {
    console.log('数据库连接成功')
    success()
  })
  
  db.on('close', () => {
    console.log('数据库断开连接')
  })
}


```
**新增 model 文件夹，创建 BookModels.js 文件**
```js
// 导入模块
const mongoose = require('mongoose')

// 创建文档的结构对象
const BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
})

// 创建文档模型对象
const BookModel = mongoose.model('books', BookSchema)

// 导出
module.exports = BookModel
```

**最后将二个文件导入路由文件内**
```js

const db = require('./db/db')
const mongoose = require('mongoose')
const BookModel = require('./models/BookModels')

db(() => {  
  
  // 新增数据
  const book = new BookModel({
    name: '红楼梦',
    author: '海悦',
    price: 10,
  })
  
  // 保存文档
  book.save().then((data) => {
    console.log('文档保存成功', data)
  
    // 关闭数据库连接
    mongoose.disconnect()
  })
}, () => {
  console.log('连接失败');
})

```

## RESTful API
RESTful API 是一种特殊风格的接口，主要特点有如下几个：
- URL 中的路径表示`资源`，路径中不能有`动词`，例如`create`，`delete`，`update`等
- 操作西苑要与` HTTP 请求方法`对应
- 操作结果要与` HTTP 响应状态码`对应
| 操作 | 请求类型 | URL | 返回 |
| ----- | ----- | ----- | ----- |
| 新增 | POST | /books | 201 |
| 删除 | DELETE | /books | 204 |
| 更新 | PUT | /books | 200 |
| 查询 | GET | /books | 200 |
| 修改 | PATCH | /books | 200 |

## json-server
json-server本身就是一个 JS 编写的工具包，可以快速搭建 RESTful API 服务
操作步骤：
  1. 全局安装 `json-server`
  ```js
  npm i json-server -g
  ```
  2. 创建 JSON 文件（db.json），编写基本结构
  ```js
  {
      "books": [
          {
            "name": "红楼梦",
            "author": "海悦",
            "price": 10
          },
          {
            "name": "西游记",
            "author": "吴承恩",
            "price": 20
          },
          {
            "name": "三国演义",
            "author": "罗贯中",
            "price": 30
          }
      ]
  }
  ```
  3. `以 JSON 文件所在文件夹为工作目录`，执行如下命令
  ```js
  json-server --watch db.json
  ```
  默认监听端口为 `3000`


## 会话控制
用于区分用户身份
常见的会话控制有三种：
- cookie
- session
- token

### cookie
> 特点：浏览器在向服务器发送请求时，会自动将`当前域名`可用的 cookie 设置在请求头中，然后传递到服务器

cookie 会在客户端中保存在浏览器中，用于区分用户身份并保存在本地的一小块数据。
`cookie 是按照域名划分保存的`
```js
// 导入 express
const express = require('express')
const cookieParser = require('cookie-parser')

// 创建应用对象
const app = express()

app.use(cookieParser())

// 设置 cookie 
app.get('/set', (req, res) => {
  // res.cookie('name', 'value')  // 设置 cookie, 浏览器关闭时失效
  res.cookie('name', 'value', { maxAge: 60 * 1000 })  // 设置 cookie 有效时间, 关闭浏览器也不会失效, 单位毫秒
  res.send('设置成功')
})

// 删除 cookie
app.get('/remove', (req, res) => {
  res.clearCookie('name')

  res.send('删除成功')
})

// express 中获取 cookie

// 安装 cookie-parser 来获取 cookie 信息
// npm i cookie-parser
app.get('/get', (req, res) => {
  console.log(req.cookies)
  res.send('获取成功')
})

// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

### session
> 特点：浏览器在向服务器发送请求时，会自动将`当前域名`可用的 session 设置在请求头中，然后传递到服务器
```js
// npm i express-session connect-mongo

// 导入模块
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')

// 创建应用对象
const app = express()

// 创建 session
app.use(session({
  name: 'sid',  // session 名称
  secret: 'lihaichao',  // 加密字符串
  resave: false,  // 是否重新保存
  saveUninitialized: false,  // 是否每次请求都设置一个 cookie 用来保存session
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/test'
  }),
  cookie: {
    httpOnly: true, // 开启后, 前端无法访问
    maxAge: 60 * 1000  // 过期时间
  }
}))

app.get('/login', (req, res) => {
  if(req.query.name === 'admin') { 
    // 设置 session
    req.session.username = 'lhc'
    req.session.pwd = '123'

    res.send('登录成功')
  }
})

app.get('/logout', (req, res) => {
  // 删除 session
  req.session.destroy(() => {
    res.send('退出登录成功')
  })
})



// 监听端口，启动服务
app.listen(8000, () => {
  console.log('http://localhost:8000 running....')
})
```

### token
> 特点: `token` 是服务端生成并返回给 HTTP 客户端的一串加密字符串，用于区分用户身份, `token` 中保存着`用户信息`
- 服务端压力更小
  - 数据存储在客户端
- 相对更安全
  - 数据加密
  - 可以避免 CSRF（跨站请求伪造）攻击
- 扩展性更强
  - 服务之间可以共享
  - 增加服务节点更简单

```js
// npm install jsonwebtoken

// 导入 jwt 模块
const jwt = require('jsonwebtoken')

// 创建生成 token
// 参数一：用户数据
// 参数二：加密字符串
// 参数三：配置对象
const token = jwt.sign({
  name: 'lhc',
  age: 18
}, 'lihaichao', {
  expiresIn: 60 * 60 * 24, // 过期时间, 单位秒
})

console.log(token)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGhjIiwiYWdlIjoxOCwiaWF0IjoxNjk4ODk1NDcxLCJleHAiOjE2OTg5ODE4NzF9.kO4O9bDJK5BskJ5EBjLnGmzU-5ttz4j2CAkwFQSQHSw

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGhjIiwiYWdlIjoxOCwiaWF0IjoxNjk4ODk1NDcxLCJleHAiOjE2OTg5ODE4NzF9.kO4O9bDJK5BskJ5EBjLnGmzU-5ttz4j2CAkwFQSQHSw'

// 解析 token
// 参数一：token
// 参数二：加密字符串
const result = jwt.verify(t, 'lihaichao')
console.log(result)
// { name: 'lhc', age: 18, iat: 1698895471, exp: 1698981871 }
```
