# generator-packing

一个快速生成 [Packing](https://packingjs.github.io/) 工程的手脚架工具。

## 特点
* 不依赖 host 文件，根据环境自动切换资源路径
* 节约开发服务器，多分支开发部署到同一台服务器不会相互覆盖
* 提供资源包体积分析报告
* 自动生成模版文件

## 使用步骤
1. 全局安装`yo`和`generator-packing`

  ```
  npm install -g yo generator-packing
  ```

1. 在目标目录运行以下命令，该命令会帮助你完成工程初始化和依赖包安装

  ```
  yo packing
  ```

1. 启动开发模式

  ```
  npm run serve
  ```

  如果上面的代码运行不报错的话，就可以在 `http://localhost:8081` 预览网站了

## 命令
* **npm start**: 启动开发模式
* **npm start:dist**: 预览编译后的工程
* **npm build**: 本地编译
* **npm build:dev**: 编译到开发机
* **npm build:beta**: 编译到测试机
* **npm build:prod**: 编译到线上机
* **npm serve**: `npm start` 的别名
* **npm serve:dist**: `npm start:dist` 的别名
* **npm lint**: 代码检查

## 目录结构

```
.
├── /assets/      # 图片字体等资源
│   ├── /images/  # 图片（示例）
│   └── /fonts/   # 字体（示例）
├── /config/
│   ├── /packing.js             # packing配置
│   ├── /webpack.build.babel.js # webpack编译配置
│   ├── /webpack.dll.babel.js   # webpack DllPlugin编译配置
│   └── /webpack.serve.babel.js # webpack开发环境配置
├── /mock/
│   ├── /api              # 异步请求接口模拟数据存放目录
│   │   └── /now.js       # /api/now接口模拟数据（示例）
│   └── /pages            # 初始化网页的模拟数据
│       ├── /__global.js  # 所有页面初始化通用的数据
│       ├── /index.js     # /index页面初始化的数据（示例）
│       └── /about.js     # /about页面初始化的数据（示例）
├── /profiles/
│   ├── /beta.env         # 测试环境profile文件
│   ├── /development.env  # 开发环境profile文件
│   ├── /local.env        # 本地环境profile文件
│   └── /production.env   # 线上环境profile文件
├── /src/                           
│   ├── /common/                    # 公共代码
│   ├── /pages/                     # DllPlugin插件编译配置
│   │   ├── /index/                 # 首页的资源文件（示例）
│   │   │   ├── /entry.js           # entry pointer
│   │   │   └── /entry.settings.js  # 自动生成模版使用的配置文件（可选）
│   │   └── /about/                 # about页的资源文件（示例）
│   │   │   ├── /entry.js           # entry pointer
│   │   │   └── /entry.settings.js  # 自动生成模版使用的配置文件可选）
│   └── /templates                  # 模版文件
│       ├── /layout/                # （pug用的）模版布局文件
│       └── /pages/                 # 用来生成页面的模版文件
├── /util/            # util
├── .babelrc          # babel配置
├── .env              # NODE_ENV环境变量配置，该文件不要提交到git仓库
├── .eslintrc.js      # eslint配置
├── build.sh          # jenkins发布调用的脚本
├── pom.xml           # 前后端关联maven配置
├── postcss.config.js # postcss配置
└── README.md
```

## packing.js 配置说明
```js
```

### 新手入门

#### 如何新增一个页面
假设新增页面的路由为 `/login`，只需要新增入口文件  `src/pages/login/entry.js` 即可：
```js
// src/pages/login/entry.js
document.write('login');
```
就这么简单！

使用 `http://localhost:8081/login` 查看页面效果。

#### 如何控制网页标题
所有网页默认都是通过模版自动生成出来的，可以使用 `entry.settings.js` 来控制网页标题，类似的参数还有  `keywords` 和 `description`

```js
// src/pages/login/entry.settings.js
export default {
  title: '登录',
  // keywords: '登录 注册',
  // description: '这是登录页'
};
```

#### 如何使用不同的母模版
可以使用 `entry.settings.js` 来控制网页使用哪一个母模版
```js
// src/pages/login/entry.settings.js
export default {
  source: 'src/templates/layout/other.pug'
};
```

#### 如何自定义入口文件匹配规则
除了定义入口文件外，Packing对目录结构没有要求，packing默认的入口配置是获取 `src/pages/**/entry.js`，你可以根据实际情况修改 `config/packing.js` 配置来达到自己需要的结构方式。

下面的配置将修改入口文件规则为 `src/entries/**/*.js`:

```js
// config/packing.js
import path from 'path';
import packingGlob from 'packing-glob';

export default (packing) => {
  const p = packing;

  //...

  p.path.entries = () => {
    const entryPath = 'src/entries';
    const entryPattern = '**/*.js';
    const cwd = path.resolve(context, entryPath);
    const config = {};
    packingGlob(entryPattern, { cwd }).forEach((page) => {
      const ext = path.extname(page).toLowerCase();
      const key = page.replace(ext, '');
      config[key] = path.join(cwd, page);
    });
    return config;    
  };

  //...

  return p;
};
```

#### 如何模拟异步请求的返回结果
请查看[数据模拟文档](generator-packing/generator/app/templates/mock)

#### 如何模拟页面初始化数据
请查看[数据模拟文档](generator-packing/generator/app/templates/mock)

#### 如何自定义页面的 URL 规则
`Packing` 默认会为每一个入口增加一个路由 `/${entrypoint}`。在实际项目中，可能存在线上路由和入口并不是对应关系，这时需要手动配置 `packing` 路由规则，以确保本地环境和线上环境更一致。

>>假设需要把网站的登录页设置为网站首页

可以通过修改 `config/packing.js` 来达到这一目的。

```js
// config/packing.js
export default (packing) => {
  const p = packing;

  //...

  p.rewriteRules = {
    //...

    '^/$': '/login'

    //...
  };

  //...

  return p;
};
```

#### 如何修改packing中定义的webpack配置
可以通过修改 `config/webpack.*.babel.js` 来修改 `webpack` 配置

```js
export default (webpackConfig) => {
  const config = webpackConfig;
  // 删除 extract-text-plugin
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'ExtractTextPlugin'
  );

  // 新增 html-webpack-plugin
  config.plugins.push(new HtmlWebpackPlugin());
  return config;
};

```

#### 在jenkins编译时提示找不到某些依赖包，但本地编译正常
本地开发时用的npm安装命令是 `npm install` ，它会`devDependencies`和`dependencies`包含的所有包，为了减少不必要的包安装、提高安装速度，在编译服务器上用的npm安装命令是 `npm install --production`，它只会安装`dependencies`下的包。出现这种情况是因为包的位置摆放错误，你需要把在编译服务器上提示找不到的这些包从`devDependencies`移动到`dependencies`下。

## 发布
### QRD
* 使用 `node` 编译方式：
  ```
  fe.xxx.build_method=node
  ```
* 使用 `sfile` 编译方式：
  ```
  fe.xxx.build_method=sfile
  # 将下行的 xxx 换成 <development|beta|prod> 其中一个
  fe.xxx.build_command: sh ./build.sh xxx
  ```

相比较 `sfile` 而言，`node` 会多做两件事：
1. 安装依赖包
2. 根据环境自动调用以下三个命令中的一个
  * npm run build:**development**
  * npm run build:**beta**
  * npm run build:**prod**

从上面的比较可以看出，使用 `node` 比较简单，使用 `sfile` 灵活性更强。
`node` 使用的是公司内部npm源，稳定性差，有些包无论如何都下载失败，另外该方式需要 `CM` 来支持，推荐大家使用 `sfile`。

### portal

## 迁移到 packing 3
