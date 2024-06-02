# Modules: ECMAScript modules
> CMAScript 模块是将 JavaScript 代码打包以供重用的官方标准格式。模块使用各种 and import export 语句进行定义。

## 示例
以下 ES 模块示例导出一个函数：
```js
function addTwo(num) {
  return num + 2;
}

export { addTwo }; 
```

## import
`import` 语句的说明符是 `from` 关键字后面的字符串，例如 `'node:path'` in `import { sep } from 'node:path'`

三种导入类型：
- 相对导入，如 `'./startup.js'` 或 `'../config.mjs'` .它们引用相对于导入文件位置的路径。`文件扩展名`始终是必需的。
- 裸导入, 如 `'some-package'`
- 绝对导入, 如 `'file:///opt/nodejs/config.js'` .它们直接和明确地引用完整路径。

## 强制文件扩展名
使用 `import` 关键字解析相对或绝对说明符时，`必须提供文件扩展名`。目录索引`（例如 './startup/index.js' ）`也必须完全指定。

## URLs
如果用于解析模块的 `import` 说明符具有不同的查询或片段，则会多次加载模块。
```js
import './foo.mjs?query=1'; // loads ./foo.mjs with query of "?query=1"
import './foo.mjs?query=2'; // loads ./foo.mjs with query of "?query=2" 
```
ES 模块被解析并缓存为 URL。这意味着特殊字符必须采用百分比编码，例如 `#` `%23` 和 `?` `%3F` 。

## 导入属性
此功能以前称为“导入断言”，并使用 `assert` 关键字而不是 `with` .

应将以前项目中的 `assert` 关键字代码中的任何用法更新为改为使用 `with` 。
### Import Attributes 建议为模块 import 语句添加了内联语法，以便在模块说明符旁边传递更多信息。
```js
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } }); 
```

## import()
`import()` 在CommonJS和ES模块中都受支持。在 CommonJS 模块中，它可用于加载 ES 模块。

## import.meta
import.meta, meta 属性是包含以下属性: 
### import.meta.dirname
当前模块的目录名称。 `path.dirname()` 这与 `import.meta.filename`
### import.meta.filename
当前模块的完整绝对路径和文件名

注意：只有本地模块支持此属性。不使用该协议 `file:` 的模块将不提供该协议。
### import.meta.url
模块的绝对 `file:` URL。

## JSON 模块
JSON 文件可以被引用 `import ：`
```js
import packageConfig from './package.json' with { type: 'json' }; 
```

## 顶级 await
关键 `await` 字可用于 ECMAScript 模块的顶层正文。
