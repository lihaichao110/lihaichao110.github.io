# REPL
用 js 代码执行命令，控制终端进行交互。

node:repl 模块提供了一个读取-评估-打印-循环 (REPL) 实现，它既可以作为独立程序使用，也可以包含在其他应用中。可以使用以下方式访问它：
```js
const repl = require('node:repl');
```
## 命令和特殊键
所有 REPL 实例都支持以下特殊命令：
- `.brea`k：在输入多行表达式的过程中，输入 .break 命令（或按 Ctrl+C）可中止对该表达式的进一步输入或处理。
- `.clear`：将 REPL context 重置为空对象并清除任何输入的多行表达式。
- `.exit`：关闭 I/O 流，导致 REPL 退出。
- `.help`：显示此特殊命令列表。
- `.save`：将当前 REPL 会话保存到一个文件中：> .save ./file/to/save.js
- `.load`：将文件加载到当前 REPL 会话中。> .load ./file/to/load.js
- `.editor`：进入编辑模式（Ctrl+D 完成，Ctrl+C 取消）。

REPL 中的以下组合键具有这些特殊效果：

- `Ctrl`+`C`:按一次时，与 .break 命令具有相同的效果。当在空白行上按两次时，效果与 .exit 命令相同。
- `Ctrl`+`D`:与 .exit 命令具有相同的效果。
- `Tab`：在空白行上按下时，显示全局和局部（作用域）变量。当在输入其他输入时按下时，显示相关的自动补齐选项。

## 全局和本地作用域
默认求值器提供对全局作用域中存在的任何变量的访问。可以通过将变量分配给与每个 `REPLServer` 关联的 `context` 对象来显式地向 REPL 公开变量：
```js
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg; 
```
`context` 对象中的属性在 REPL 中显示为本地：
```bash
$ node repl_test.js
> m
'message'
```

默认情况下上下文属性不是只读的。要指定只读的全局变量，则必须使用 `Object.defineProperty()` 定义上下文属性：
```js
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

