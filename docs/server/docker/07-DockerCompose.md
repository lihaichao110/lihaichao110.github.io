# Docker Compose 基础入门

## 什么是 Docker Compose

Docker Compose 是一个用来**定义和运行多容器应用**的工具。

### 生活中的类比

想象你要开一家餐厅，需要同时准备：

- 厨房（Web 服务）
- 食材库（MySQL 数据库）
- 冰箱（Redis 缓存）
- 收银系统（其他服务）

传统方式需要一个个手动启动每个服务，既麻烦又容易出错。

**Docker Compose 就是这个餐厅的「一键开业」按钮**：你只需要写一份清单（YAML 文件），告诉 Docker Compose 需要哪些服务，然后一个命令就能把所有服务一起启动起来。

### 为什么需要 Docker Compose

**问题**：一个应用通常不只有一个容器

比如一个典型的 Web 应用：

```
用户请求 → Nginx（Web 服务器）
         → Spring Boot（Java 后端）
         → MySQL（数据库）
         → Redis（缓存）
```

**解决方案**：手动管理多个容器很麻烦

```bash
# 以前要这样启动每个容器
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=123 mysql:8.0
docker run -d --name redis redis:alpine
docker run -d --name backend -p 8080:8080 my-app
docker run -d --name nginx -p 80:80 nginx
```

而且还要考虑容器之间的依赖关系、启动顺序、网络配置等。

**Docker Compose 的优势**：

- 一个命令启动所有服务
- 自动管理服务依赖和启动顺序
- 统一管理所有容器配置
- 轻松实现服务扩缩容

## 安装 Docker Compose

Docker Compose 通常随 Docker Desktop 一起安装。

### 检查是否已安装

```bash
docker-compose --version
# 或者
docker compose version
```

> 注意：新版本 Docker 已经将 `docker-compose` 集成到 `docker` 命令中（`docker compose`），两者功能相同。

### 单独安装（Linux）

```bash
# 下载二进制文件
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 创建软链接（可选）
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

## 快速开始

### 1. 创建项目目录

```bash
mkdir myapp && cd myapp
```

### 2. 创建应用文件

假设是一个简单的 Nginx + PHP 应用：

```bash
# index.php
echo '<?php echo "Hello from PHP!"; ?>' > index.php

# Dockerfile
cat > Dockerfile << 'EOF'
FROM php:8.0-apache
COPY . /var/www/html/
EOF
```

### 3. 创建 docker-compose.yml

这是核心文件，定义了所有服务：

```yaml
version: '3.8'  # Docker Compose 文件版本

services:  # 服务列表
  web:
    build: .  # 使用当前目录的 Dockerfile 构建
    ports:    # 端口映射
      - "80:80"
    volumes:  # 数据卷挂载
      - .:/var/www/html

  db:
    image: mysql:8.0  # 直接使用镜像
    environment:      # 环境变量
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql  # 命名数据卷

  redis:
    image: redis:alpine

volumes:  # 定义命名数据卷
  db_data:
```

### 4. 启动服务

```bash
# 启动所有服务（-d 表示后台运行）
docker compose up -d

# 或者旧版本
docker-compose up -d
```

### 5. 管理服务

```bash
# 查看运行状态
docker compose ps

# 查看所有服务日志
docker compose logs

# 查看指定服务日志
docker compose logs web

# 停止所有服务
docker compose down

# 停止并删除数据卷
docker compose down -v
```

### 6. 扩展服务

```bash
# 扩展 web 服务到 3 个容器
docker compose up -d --scale web=3
```

## docker-compose.yml 详解

### 基本结构

```yaml
version: '3.8'

services:
  服务名称:
    image: 镜像名
    build: 构建配置
    ports: 端口映射
    environment: 环境变量
    volumes: 数据卷
    networks: 网络
    depends_on: 依赖服务
```

### 常用配置项

#### image - 使用已有镜像

```yaml
services:
  db:
    image: mysql:8.0
```

#### build - 从 Dockerfile 构建

```yaml
services:
  web:
    build:
      context: ./app      # Dockerfile 所在目录
      dockerfile: Dockerfile  # Dockerfile 文件名
```

#### ports - 端口映射

```yaml
services:
  web:
    ports:
      - "80:80"      # 宿主机端口:容器端口
      - "443:443"
      - "8080-8085:80"  # 端口范围映射
```

#### environment - 环境变量

```yaml
services:
  db:
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=myapp
    # 或者使用字典格式
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: myapp
```

#### volumes - 数据卷

```yaml
services:
  web:
    volumes:
      - ./html:/var/www/html      # 宿主机路径:容器路径
      - config:/etc/config        # 命名数据卷

volumes:
  config:
```

#### depends_on - 依赖关系

```yaml
services:
  web:
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0

  redis:
    image: redis:alpine
```

> 注意：`depends_on` 只保证启动顺序，不保证服务已就绪。

#### networks - 网络配置

```yaml
services:
  web:
    networks:
      - frontend
      - backend

networks:
  frontend:
  backend:
```

#### restart - 重启策略

```yaml
services:
  web:
    restart: always  # 总是重启
```

可选值：

- `no` - 不重启
- `always` - 总是重启
- `on-failure` - 仅在失败时重启
- `unless-stopped` - 除非手动停止，否则一直重启

## 常用命令

### 服务管理

```bash
# 启动服务
docker compose up

# 后台运行
docker compose up -d

# 重新构建镜像
docker compose up --build

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 暂停服务
docker compose pause

# 恢复服务
docker compose unpause
```

### 查看状态

```bash
# 查看运行状态
docker compose ps

# 查看服务日志
docker compose logs -f

# 查看服务详细信息
docker compose top

# 查看资源使用
docker stats
```

### 扩展和缩容

```bash
# 扩展服务数量
docker compose up -d --scale web=3

# 查看扩展状态
docker compose ps
```

### 清理

```bash
# 停止并删除容器、网络
docker compose down

# 停止并删除容器、网络、数据卷
docker compose down -v

# 删除已停止的服务
docker compose rm

# 删除所有镜像（谨慎使用）
docker compose down --rmi all
```

### 执行命令

```bash
# 在服务中执行命令
docker compose exec web ls -la

# 进入服务 shell
docker compose exec web sh

# 启动一次性任务
docker compose run --rm web npm install
```

## 实战：部署一个 Web 应用

### 项目结构

```
myproject/
├── docker-compose.yml
├── Dockerfile
├── src/
│   └── index.php
└── .env
```

### 1. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./src:/var/www/html
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - backend

  redis:
    image: redis:alpine
    networks:
      - backend

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    ports:
      - "8080:80"
    environment:
      PMA_HOST: db
    depends_on:
      - db
    networks:
      - backend

volumes:
  db_data:

networks:
  backend:
```

### 2. 创建 Dockerfile

```dockerfile
FROM php:8.0-apache

RUN docker-php-ext-install pdo pdo_mysql
```

### 3. 创建 .env 文件

```bash
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=myapp
```

### 4. 启动应用

```bash
# 启动所有服务
docker compose up -d

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 5. 访问应用

- Web 应用：http://localhost
- PHPMyAdmin：http://localhost:8080

### 6. 关闭应用

```bash
docker compose down
```

## 多环境配置

Docker Compose 支持通过多个文件实现多环境配置。

### 基础知识和文件

Docker Compose 会读取 `docker-compose.yml` 和 `docker-compose.override.yml` 文件。

### 开发环境

```yaml
# docker-compose.yml（基础配置）
services:
  web:
    build: .
    ports:
      - "80:80"

  db:
    image: mysql:8.0
```

### 开发覆盖配置

```yaml
# docker-compose.override.yml（开发环境）
services:
  web:
    volumes:
      - ./src:/var/www/html  # 开发时挂载代码
    environment:
      - DEBUG=true

  db:
    ports:
      - "3306:3306"  # 开发时开放端口
```

### 生产环境覆盖配置

```yaml
# docker-compose.prod.yml（生产环境）
services:
  web:
    volumes:
      - static_files:/var/www/html  # 生产用数据卷
    environment:
      - DEBUG=false

  db:
    volumes:
      - prod_data:/var/lib/mysql
    restart: always

volumes:
  static_files:
  prod_data:
```

### 使用不同环境

```bash
# 开发环境（默认加载 override）
docker compose up -d

# 生产环境
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 常见问题

### 1. 容器启动顺序问题

`depends_on` 只保证启动顺序，不保证服务就绪。

**解决方案**：使用 `healthcheck` 配合 `condition`

```yaml
services:
  db:
    image: mysql:8.0
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 3s
      retries: 3

  web:
    depends_on:
      db:
        condition: service_healthy
```

### 2. 数据卷权限问题

挂载目录后容器内没有写入权限。

**解决方案**：

```yaml
services:
  web:
    user: "1000:1000"  # 指定用户
    # 或者在 Dockerfile 中设置正确权限
```

### 3. 中文乱码问题

**解决方案**：配置字符集环境变量

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      LANG: C.UTF-8
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

### 4. 端口冲突

多个服务使用相同端口。

**解决方案**：修改端口映射

```yaml
services:
  web1:
    ports:
      - "80:80"

  web2:
    ports:
      - "8080:80"  # 改为不同端口
```

## 最佳实践

1. **使用版本控制**：将 `docker-compose.yml` 纳入版本控制
2. **使用 .env 文件**：敏感配置通过环境变量管理
3. **合理组织服务**：按功能模块划分服务
4. **设置健康检查**：确保依赖服务就绪后再启动
5. **使用命名数据卷**：方便数据持久化和迁移
6. **定期清理资源**：`docker compose down -v` 清理无用数据卷
7. **生产环境配置**：使用多文件覆盖不同环境配置
