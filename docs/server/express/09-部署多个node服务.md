# 启动多个 node.js 服务

## 1. 启动多个 node.js 服务
```js
npm i pm2 -g
```

```js
// 进入项目目录
pm2 start  --name localhost
```

## pm2 命令
| 命令 | 解释 |
| ----  | ---- |
| pm2 start index.js --name localhost | 启动一个 node.js 服务, 并指定服务名称 |
| pm2 list | 列出所有的 node.js 服务 |
| pm2 restart all | 重启一个所有服务 |
| pm2 stop localhost | 停止一个 localhost 这个服务 |
| pm2 delete  | 删除一个 node.js 服务 |