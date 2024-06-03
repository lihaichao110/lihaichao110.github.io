# Path
> 提供了用于处理文件和目录路径的实用程序. 可以使用以下方式访问它：

```js
const path = require('node:path');
```

## Windows 与 POSIX
`node:path` 模块的默认操作因运行Node.js应用程序的操作系统而异. 具体而言，在 Windows 操作系统上运行时，该 `node:path` 模块将假定正在使用 Windows 样式的路径

因此，在 POSIX 和 Windows 上使用 `path.basename()` 可能会产生不同的结果:

- 在 POSIX 上：
```js
path.basename('C:\\temp\\myfile.html');
// 返回：'C:\\temp\\myfile.html' 
```
- 在 Windows 上：
```js
path.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html' 
```
- 若要在任何操作系统上使用 Windows 文件路径时获得一致的结果，请使用 `path.win32` ：

在 POSIX 和 Windows 上：
```js
path.win32.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html' 
```
- 要在任何操作系统上使用 POSIX 文件路径时获得一致的结果，请使用 `path.posix` ：

在 POSIX 和 Windows 上：
```js
path.posix.basename('/tmp/myfile.html');
// 返回: 'myfile.html' 
```

## path.basename(path[, suffix])
- `suffix` 要删除的可选后缀

该 `path.basename()` 方法返回 path 的最后一部分，类似于 Unix basename 命令。尾随目录分隔符将被忽略。
```js
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回：'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html')
// 返回: 'quux' 
```
尽管 Windows 通常以不区分大小写的方式处理文件名（包括文件扩展名），但此函数不会。例如， `C:\\foo.html` 引用 `C:\\foo.HTML` 同一文件，但 `basename` 将`扩展名视为区分大小写的字符串`：
```js
path.win32.basename('C:\\foo.html', '.html');
// 返回: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// 返回: 'foo.HTML' 
```
如果不是 `path` 字符串，或者 `suffix` 是给定的，但不是字符串，则抛出 `TypeError`

## path.delimiter
提供特定于平台的路径分隔符：
- `;` Windows 版
- `:` 用于 POSIX
例如，在 POSIX 上：
```js
console.log(process.env.PATH);
// 打印: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// 返回: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin'] 
```
在 Windows 上：
```js
console.log(process.env.PATH);
// 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// 返回 ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\'] 
```

## path.dirname(path)
该 `path.dirname()` 方法返回 path 的目录部分。
```js
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf' 
```
如果 `path` 不是字符串，则抛出 `TypeError` 

## path.extname(path)
`path.extname()` 方法返回 `path` 的扩展名，从上次出现的 . （句点） 字符到 的 最后部分的 `path` 字符串末尾。如果 `path` 的最后一部分没有 `.` ，或者除了 `path` 的 （请参阅 path.basename() ） 的基名的第一个字符之外没有其他 `.` 字符，则返回一个空字符串。