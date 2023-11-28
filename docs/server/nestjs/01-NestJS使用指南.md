# NestJS 使用指南
> Nest 使用强大的 HTTP 服务器框架，如 Express（默认），也可以选择配置为使用 Fastify。

## 先决条件
请确保你的操作系统上安装了 **Node.js**（版本 >= 16）
## 安装
```bash
npm i -g @nestjs/cli
nest new 项目名
```

## 备择方案
```bash
git clone https://github.com/nestjs/typescript-starter.git project
cd project
npm install
npm run start
```

你还可以通过使用 npm（或 yarn）安装核心和支持文件从头开始手动创建新项目。 在这种情况下，当然，你将负责自己创建项目样板文件。
```bash
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
```