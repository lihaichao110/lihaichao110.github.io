# 包管理工具
## 常用的包管理工具
下面列举了前端常用的包管理工具
- npm
- yarn
- cnpm
- pnpm

## 管理发布 npm 包
### 发布包
1. 创建文件夹，并创建index.js 文件，在文件中声明函数，实用 module.exports 暴露
2. npm 初始化工具包，package.json 填写包的信息（包的名字是唯一的）
3. 注册账号 http://www.npmjs.com/signup
4. 激活账号（`一定要激活账号`）
5. 修改为官方的官方镜像地址（命令行中运行 npm config set registry https://registry.npmjs.org）
6. 命令行下 `npm login` 填写相关用户信息
7. 命令行下 `npm publish` 发布

### 更新包
1. 更新代码
2. 测试代码是否可用
3. 修改 `package.json` 中的版本号
4. 发布更新
```js
npm publish
```

### 删除包
执行如下命令删除包
```js
npm unpublish
```
**删除包要满足一定的条件** 
- 您是作者，或者您的组织是作者的组织
- 发布小于 24 小时
- 大于 24 小时后，没有其他包依赖，并且每周小于 300 下载量，并且只有一个维护者