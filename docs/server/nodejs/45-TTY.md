# tty - 终端
该 `node:tty` 模块提供 `tty.ReadStream` 和 `tty.WriteStream` 类。在大多数情况下，没有必要或不可能直接使用此模块。但是，可以使用以下方法访问它：
```js
const tty = require('node:tty');
```
当 Node.js 检测到正运行在一个文本终端（TTY）时，则 `process.stdin` 默认会被初始化为一个 `tty.ReadStream` 实例，且 `process.stdout` 和 `process.stderr` 默认会被初始化为一个 `tty.WriteStream` 实例。 判断 Node.js 是否运行在一个 TTY 上下文的首选方法是检查 `process.stdout.isTTY` 属性的值是否为 `true` ：
```shell
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
大多数情况下，应用程序无需手动创建 `tty.ReadStream` 类和 `tty.WriteStream` 类的实例。
## tty.ReadStream 类
`tty.ReadStream` 类是 `net.Socket` 的一个子类，表示 TTY 的可读部分。 正常情况下，`process.stdin` 是 Node.js 进程中唯一的 `tty.ReadStream` 实例，无需创建更多的实例。
### readStream.isRaw
返回 `boolean` 值。 如果 TTY 被配置成原始模式，则返回 `true`。 默认为 `false`。
### readStream.isTTY
A `boolean` 总是 `true` 用于 `tty.ReadStream` 实例。
### readStream.setRawMode(mode)
把 `tty.ReadStream` 配置成原始模式。

在原始模式中，输入按字符逐个生效，但不包括修饰符。 终端对字符的所有特殊处理会被禁用，包括应答输入的字符。 该模式中 `CTRL` + `C` 不再产生 `SIGINT`。

- `mode` | 如果为 `true`，则把 `tty.ReadStream` 配置成原始模式。 如果为 `false`，则把 `tty.ReadStream` 配置成默认模式。 `readStream.isRaw` 属性会被设为对应的值。

## tty.WriteStream 类
`tty.WriteStream` 类是 `net.Socket` 的一个子类，表示 TTY 的可写部分。 正常情况下，`process.stdout` 和 `process.stderr` 是 Node.js 进程中唯一的 `tty.WriteStream` 实例，无需创建更多的实例。

### 'resize' 事件
当 `writeStream.columns` 属性或 `writeStream.rows` 属性发生变化时触发 `'resize'` 事件。 监听器回调函数没有参数。
```js
process.stdout.on('resize', () => {
  console.log('窗口大小发生变化！');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
})
```
### writeStream.columns
返回 `number` 值，表示 `TTY` 当前具有的列数。 每当 `'resize'` 事件被触发时，该属性会被更新。

### writeStream.isTTY
那 `boolean` 是永远的 `true`。

### writeStream.rows
返回 `number` 值，表示 TTY 当前具有的行数。 每当 `'resize'` 事件被触发时，该属性会被更新。
## tty.isatty(fd)
- fd | 数值类型的文件描述符。

如果给定的 `fd` 有关联 TTY，则返回 `true`，否则返回 `false`。





















