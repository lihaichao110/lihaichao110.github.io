# Modules: node:module API
> 在与 Module 的实例交互时提供通用实用方法，该 `module` 变量在 CommonJS 模块中经常出现。通过 `import 'node:module'` 或 `require('node:module')` 访问。
## module.builtinModules
Node.js提供的所有模块的名称列表。可用于验证模块是否由第三方维护。
## module.createRequire(filename)
`filename` | 用于构造 require 函数的文件名。必须是文件 URL 对象、文件 URL 字符串或绝对路径字符串。
```js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
const siblingModule = require('./sibling-module');
```
## module.isBuiltin(moduleName)
`moduleName` 模块的名称

返回：如果模块存在，则返回 true，否则返回 false
```js
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```

## module.syncBuiltinESMExports()
> 该 `module.syncBuiltinESMExports()` 方法更新内置 ES 模块的所有实时绑定，以匹配 CommonJS 导出的属性。它不会在 ES 模块中添加或删除导出的名称。
```js
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // It syncs the existing readFile property with the new value
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync has been deleted from the required fs
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() does not remove readFileSync from esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() does not add names
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
