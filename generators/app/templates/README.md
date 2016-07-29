# <%= props.name%>

### Install

```sh
npm install
# 如果是在公司内网，使用下面的命令安装速度更快
# npm install --registry http://registry.npm.corp.qunar.com

# 启动开发模式
npm run serve

#open http://localhost:3001

# 编译工程
npm run build

# 编译并预览编译结果
npm run serve:dist
```

### Directory

```
.
├── /config/                            # webpack配置文件
│   ├── /packing.js                     # 和构建工具相关的配置
│   ├── /webpack.build.babel.js         # webpack编译环境配置文件
│   ├── /webpack.serve.babel.js         # webpack开发环境配置文件
│   └── /webpack.serve:dist.js          # webpack预览编译后结果的配置文件
├── /mock/                              # 模拟数据
│   ├── /api/                           # API接口类型模拟数据
│   └── /pages                          # 页面初始化类型模拟数据
├── /prd/                               # 项目编译输出目录
├── /src/                               # 项目源码目录
│   ├── /config/                        # 和网站运行相关的配置，如dev/beta环境差异变量
│   ├── /entries/                       # webpack打包入口js
│   └── /templates/                     # 后端模版，如jade、smarty
├── /static/                            # 静态资源，如图片、字体
├── /tools/                             # webpack配置文件
│   ├── /serve.js                       # serve脚本
│   └── /serve:dist.js                  # serve:dist脚本
│── .babelrc                            # babel配置
│── .editorconfig                       # 代码编辑器配置
│── .eslintrc                           # eslint配置
│── package.json
│── pom.xml                             # maven配置
└── README.md                   
```

### 约定
* 每个网页模版有一个对应的js入口文件 `entry.js`，保证 `entry.js`的目录结构和网页模版的目录结构一致
* 网页模版中对静态资源引用时使用绝对路径，如 `/logo/qunar.png`

### 常用脚本
```
# npm使用qunar源
npm install --registry http://registry.npm.corp.qunar.com
npm install --registry http://registry.npm.taobao.com

# 只安装dependencies，不安装devDependencies，适用于QDR编译机
npm install --registry http://registry.npm.corp.qunar.com --production
```

### npm-cache在QDR上部署
使用npm-cache加速编译机上node_modules的安装速度
```
# 安装npm-cache
npm install -g npm-cache

# 安装依赖包，首次从线上下载，之后如果package.json文件不变，就走缓存
# jenkins用户需要对 `NPM_CACHE_DIR` 目录有写入权限
NPM_CACHE_DIR=/home/q/prj/npm npm-cache install npm --registry http://registry.npm.corp.qunar.com

# 清空缓存
NPM_CACHE_DIR=/home/q/prj/npm npm-cache clean
```

如果node < 4.0，还需要为npm-cache指定高版本的node编译器：
1. 打开npm-cache
```
sodu vi `which npm-cache`
```

2. 将第一行换成下面的代码，根据服务器上的node路径修改
```
#! /home/q/node/node-v4.2.4-linux-x64/bin/node
```

### 常见问题

#### 迁移已有的项目

#### 新建项目

#### 如何配置和线上环境一样的路由
路由规则修改后需要重启`npm run serve`

#### 如何模拟数据

#### 如何让文件在编译过程不做reversion

#### eslint错误太多了
根据团队的实际代码风格，修改 `.eslintrc`

#### schema怎么配置

#### webpackJsonp is not defined
可能配置了common chunks，公共文件打到了vendor.js，需要在页面引用vendor.js，
```html
<script src="/vendor.js"></script>
```
如果vendor.js引用了css，页面还需要引用vendor.css
```html
<link href="/vendor.css" media="all" rel="stylesheet" />
```
