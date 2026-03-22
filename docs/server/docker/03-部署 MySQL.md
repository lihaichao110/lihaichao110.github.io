# 部署 MySQL

## 使用 Docker 部署 MySQL

### 命令解析

```bash
docker run -d \
  --name lihaichao-mysql \
  -e MYSQL_ROOT_PASSWORD=lhc20020820 \
  -e MYSQL_DATABASE=testdb \
  -p 3306:3306 \
  -v /docker/mysql-data:/var/lib/mysql \
  mysql:8.0
```

| 配置 | 说明 |
|------|------|
| `-d` | 后台运行容器 |
| `--name lihaichao-mysql` | 容器名称为 `lihaichao-mysql`，方便后续管理 |
| `-e MYSQL_ROOT_PASSWORD=lhc20020820` | 设置 MySQL root 用户密码 |
| `-e MYSQL_DATABASE=testdb` | 容器启动时自动创建名为 `testdb` 的数据库 |
| `-p 3306:3306` | 将宿主机的 3306 端口映射到容器的 3306 端口 |
| `-v /docker/mysql-data:/var/lib/mysql` | 数据卷挂载，将宿主机 `/docker/mysql-data` 目录挂载到容器 `/var/lib/mysql`，持久化存储 MySQL 数据 |
| `mysql:8.0` | 指定使用 MySQL 8.0 镜像 |

### 验证部署

```bash
# 查看容器运行状态
docker ps
```

## 连接 MySQL

### 命令解析

```bash
mysql -h 127.0.0.1 -P 3306 -u root -plhc20020820
```

| 配置 | 说明 |
|------|------|
| `mysql` | MySQL 客户端命令 |
| `-h 127.0.0.1` | 指定 MySQL 服务器地址，`127.0.0.1` 表示本机 |
| `-P 3306` | 指定 MySQL 端口（注意是大写 P，与密码的小写 p 区分） |
| `-u root` | 指定用户名 |
| `-plhc20020820` | 指定密码（注意是小写 p，与端口的 P 区分） |

### 容器内直接连接

如果已经在服务器上，可以直接进入容器内部连接 MySQL：

```bash
docker exec -it lihaichao-mysql mysql -u root -plhc20020820
```