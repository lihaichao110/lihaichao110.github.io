# path 模块操作
```js
// 导入 fs 模块
const fs = require('fs')
// 导入 path 模块
const path = require('path')


// __dirname 获取当前目录的绝对路径
// __filename 获取当前文件的绝对路径
path.resolve(__dirname, './demo1.txt')
console.log(path.resolve(__dirname, './demo1.txt'))
// C:\Users\keying\Desktop\node-express\fs-module\demo1.txt

// 获取操作系统的路径分隔符
path.sep
console.log(path.sep)
// 输出：\


// 解析路径并返回对象
const url = path.parse(__filename)
console.log(url)
// {
//   root: 'C:\\', 根目录
//   dir: 'C:\\Users\\keying\\Desktop\\node-express\\fs-module', 目录
//   base: '11-path模块.js', 文件全称
//   ext: '.js', 扩展名
//   name: '11-path模块' , 文件名称
// }


// 获取路径的文件名称
const str = 'C:\\Users\\keying\\Desktop\\node-express\\fs-module\\11-path模块.js'
console.log(path.basename(str))
// 11-path模块.js

// 获取路径的目录名称
console.log(path.dirname(str))
// C:\Users\keying\Desktop\node-express\fs-module


// 获取路径的文件扩展名
console.log(path.extname(str))
// .js

```