# Modules: Packages
> 包是由 `package.json` 文件描述的文件夹树。该包由包含该 `package.json` 文件的文件夹和所有子文件夹组成，直到下一个包含另一个 `package.json` 文件的文件夹或名为 `node_modules` 的文件夹。

## 确定模块
> 当作为初始输入传递到 `node` 时，或者当语 `import` 句或 `import()` 表达式引用时，
### Node.js会将以下内容视为 ES 模块：
- `.mjs` 具有扩展名的文件。
- 当最近的父 `package.json` 文件包含值为 的 `"module"` 顶级 `"type"` 字段时， `.js` 具有扩展名的文件。
- 字符串作为参数传入 `--eval` ，或通过管道传递到 `node`  `STDIN` via ，标志为 `--input-type=module`
- 使用 `--experimental-detect-module` 时，包含语法的代码仅成功解析为 `ES` 模块，例如 `import` 或 `export` 语句或 `import.meta` ，没有明确标记应如何解释它。显式标记是 `.mjs` or `.cjs` 扩展名、 `package.json` `"type"` 带有 `"module"` or `"commonjs"` 值或 `--input-type` or `--experimental-default-type` 标志的字段。CommonJS 或 ES 模块都支持动态 `import()` 表达式，并且不会导致文件被视为 ES 模块。

### Node.js会将以下内容视为 CommonJS：
- `.cjs` 具有扩展名的文件。
- 当最近的父 `package.json` 文件包含值为 `"commonjs"` 顶级 `"type"` 字段时， `.js` 具有扩展名的文件。
- 字符串作为参数传入 `--eval`或通过管道传递到 `node`  `STDIN` via标志为 `--input-type=commonjs` 

此标志当前默认为  `"commonjs"` ，但将来可能会更改为默认为 `"module"` 。出于这个原因，最好尽可能明确;特别是，包作者应始终在其 `package.json` 文件中包含该 `"type"` 字段，即使在所有源代码都是 CommonJS 的包中也是如此。明确包的 type 包将使包面向未来，以防默认Node.js类型发生更改，并且它还将使构建工具和加载器更容易确定应如何解释包中的文件。

## 模块加载解析
Node.js有两个系统，用于解析模块和加载模块。
### CommonJS 模块加载器：
- 它是完全同步的。
- 它负责处理 require() 呼叫。
- 它是猴子可修补的
- 它支持将文件夹作为模块。
- 解析说明符时，如果没有找到完全匹配项，它将尝试添加扩展名（ `.js` 、 `.json` 和 `.node` ），然后尝试将文件夹解析为模块。
- 它被视为 .json JSON 文本文件。
- `.node` 文件被解释为加载了 `process.dlopen()`
- 它将所有缺少 `.json` 或 `.node` 扩展名的文件视为JavaScript文本文件。
- 它只能用于从 CommonJS 模块加载 ECMASCript 模块，前提是模块图是同步的（不包含顶级 `await` ）启用 `--experimental-require-module` 。当用于加载不是 ECMAScript 模块的 JavaScript 文本文件时，该文件将作为 CommonJS 模块加载。

### ECMAScript 模块加载器：
- 它是异步的，除非它用于加载 require() 的模块。
- 它负责处理 import 语句和 import() 表达式。
- 它不是猴子可修补的，可以使用加载器钩子进行自定义。
- 它不支持文件夹作为模块，目录索引（例如 './startup/index.js' ）必须完全指定。
- 它不进行扩展搜索。当说明符是相对或绝对文件 URL 时，必须提供文件扩展名。
- 可以加载 JSON 模块，但需要导入断言。
- 它只接受 JavaScript 文本文件的扩展 `.js`  `.cjs` `.mjs`
- 它可用于加载 JavaScript CommonJS 模块。这些模块通过 `cjs-module-lexer` 尝试识别命名导出，如果可以通过静态分析确定它们，则可以使用这些导出。导入的 CommonJS 模块的 URL 转换为绝对路径，然后通过 CommonJS 模块加载器加载。

## package.json 和文件扩展名
- 在包中，该 `package.json` `"type"` 字段定义Node.js应如何解释 `.js` 文件。如果 `package.json` 文件没有 `"type"` 字段， `.js` 则文件将被视为 CommonJS。
- `package.json` `"type"` 值 为 `"module"` 指示Node.js使用 ES 模块语法将该包中的 .js 文件解析。
- 该 `"type"` 字段不仅适用于初始入口点 （ `node my-app.js` ），还适用于语 `import` 句和 `import()` 表达式引用的文件。

结尾 `.mjs` 的文件始终作为 ES 模块加载，而不考虑最近的父级 `package.json` 。
结尾 `.cjs` 的文件始终以 CommonJS 的形式加载，而不考虑最近的父 `package.json` 级。
```js
import './legacy-file.cjs';
// .cjs 始终作为 CommonJS 加载。


import 'commonjs-package/src/index.mjs';
// .mjs 始终作为 ES 模块加载。
```