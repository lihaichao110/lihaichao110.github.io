# Modules: CommonJS modules
> CommonJS 模块是为 Node.js 打包 JavaScript 代码的原始方法。Node.js还支持浏览器和其他 JavaScript 运行时使用的 ECMAScript 模块标准。

## exports
**1. 在Node.js中，每个文件都被视为一个单独的模块。例如，考虑一个名为 foo.js ：**

在第一行， foo.js 加载 circle.js 与 foo.js
```js
const circle = require('./circle.js');
console.log(`半径为 4 的圆的面积为 ${circle.area(4)}`); 
```

**2. 以下是以下 circle.js 内容：**

`该模块 circle.js 已导出函数 area() 和 circumference() .通过在特殊 exports 对象上指定其他属性，将函数和对象添加到模块的根目录中。`

在此示例中，变量 PI 是私有的
```js
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```

## module.exports
> 可以为 module.exports 该属性分配一个新值（如函数或对象）。

**1. 在下面的代码中， bar.js 使用导出 Square 类的 square 模块：**
```js
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`mySquare 的面积是 ${mySquare.area()}`); 
```

**2. 该 square 模块定义在 square.js ：**
```js
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
}; 
```
`CommonJS模块系统是在核心模块中 module 实现的。`

## 使用方法
> Node.js有两个模块系统：CommonJS 模块和 ECMAScript 模块。

### 默认情况下，Node.js 会将以下内容视为 CommonJS 模块：
- `.cjs` 扩展名为的文件;
- 当最近的父 `package.json` 文件包含值为 的 `"commonjs"` 顶级字段 `"type"` 时， `.js` 具有扩展名的文件。
- 当最近的父 `package.json` 文件不包含顶级字段 `“type”` 或任何父文件夹中没有 `package.json` 时，带有 `.js` 扩展名或不带扩展名的文件；除非该文件包含错误的语法，除非它被评估为 ES 模块。包作者应该包含`“type”`字段，即使在所有源都是 `CommonJS` 的包中也是如此。明确包的类型将使构建工具和加载器更容易确定如何解释包中的文件。
- 扩展名为 `.mjs` 、 `.cjs` 、 `.json` 或 `.node` `.js` 的文件（当最近的父 `package.json` 文件包含值为 `"module"` 的顶级字段 `"type"` 时，这些文件只有在通过 `require()` 包含时才会被识别为 `CommonJS` 模块，而不是在用作程序的命令行入口点时）。

> **调用 `require()` 时始终使用 CommonJS 模块加载器。**
>
> **调用 `import()` 时始终使用 ECMAScript 模块加载器。**

## 判断当前模块环境
在 Node.js 运行时，可以通过 require.main === module 来确定文件运行在什么模块环境

- 如果入口点是 CommonJS 模块，则 `require.main === module`
- 当入口点不是 CommonJS 模块时， `require.main` 是 `undefined`

## 包管理器提示
> Node.js `require()` 函数的语义被设计为足够通用，以支持合理的目录结构。包管理器程序，如 `dpkg` 、 `rpm` 和 `npm` ，希望能发现可以从Node.js模块构建本机包而无需修改。

### 在下文中，我们给出了一个建议的目录结构，该结构可以工作：

假设我们希望将文件夹 `/usr/lib/node/<some-package>/<some-version>` 保留特定版本的包的内容。

由于 Node.js 查找 `realpath` 它加载的任何模块（即解析符号链接），然后在文件夹中 `node_modules` 查找它们的依赖项，因此可以使用以下体系结构解决这种情况：

## require()
> 该 `.mjs` 扩展是为 ECMAScript 模块保留的。目前，如果未使用该标志，则加载 ECMAScript 模块将 `require()` 引发 `ERR_REQUIRE_ESM` 错误，用户需要改用 `import()` 该标志 --experimental-require-module 

**如果 --experimental-require-module 启用，并且正在加载的 require() ECMAScript 模块满足以下要求：**
- 该模块是完全同步的（不包含顶级 await ）
- 满足以下条件之一：
  - 该文件具有 .mjs 扩展名。
  - 该文件具有 .js 扩展名，最接近 package.json 的文件包含 "type": "module"
  - 该文件具有 .js 扩展名，最接近 package.json 的文件不包含 "type": "commonjs" ，并且 --experimental-detect-module 已启用。

`require() 将请求的模块作为 ES 模块加载，并返回模块命名空间对象`