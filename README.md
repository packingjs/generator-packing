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
export default {
  /**
   * 本地访问的域名
   * 如果需要使用 `qunar.com` 的 cookie，需要改成类似 `my.qunar.com` 这种
   * @type {string}
   */
  localhost: 'localhost',

  /**
   * webserver 端口
   */
  port: {
    /**
     * 开发环境 webserver 端口
     * @type {number}
     */
    dev: 8081,

    /**
     * 预览编译结果时 webserver 端口
     * @type {number}
     */
    dist: 8080
  },

  /**
   * 文件路径配置
   * 所有目录都使用相对于项目根目录的相对目录格式
   */
  path: {
    /** 源文件相关路径 */
    src: {
      /**
       * 源文件根目录
       * @type {string}
       */
      root: 'src',

      /**
       * 模版文件路径
       * 相对于 `src.root` 的相对地址
       * 若不区分布局文件和网页文件，请直接传入字符串
       * @type {(string|object)}
       */
      templates: {
        layout: 'templates/layout',
        pages: 'templates/pages'
      }
    },

    /** 编译输出文件相关路径 */
    dist: {
      /**
       * webpack 编译产物输出目录
       * 即 `webpack.config.output.path` 参数
       * @type {string}
       */
      root: 'prd',

      /**
       * 模版文件路径
       * 相对于 `dist.root` 的相对地址
       * 若不区分布局文件和网页文件，请直接传入字符串
       * @type {(string|object)}
       */
      templates: {
        layout: 'templates/layout',
        pages: 'templates/pages'
      },

      /**
       * JavaScript 输出目录
       * @type {string}
       */
      js: 'js',

      /**
       * CSS 输出目录
       * @type {string}
       */
      css: 'css'
    },

    /**
     * 页面初始化 mock 数据文件存放目录
     * @type {string}
     */
    mockPages: 'mock/pages',

    /**
     * dllPlugin 编译输出物临时存放目录
     * @type {string}
     */
    tmpDll: '.tmp/dll',

    /**
     * 打包入口文件
     * @type {(string|object|function)}
     * @example
     * // string
     * entries: './src/entries/index.js'
     * @example
     * // object
     * entries: {
     *   index: './src/entries/index.js',
     *   abc: './src/entries/abc.less'
     * }
     * @example
     * // function
     * entries: () => {}
     */
    entries: () => {
      const entryFileName = 'entry.js';
      const entryPath = 'src/pages';
      const entryPattern = `**/${entryFileName}`;
      const cwd = path.resolve(context, entryPath);
      const config = {};
      packingGlob(entryPattern, { cwd }).forEach((page) => {
        const key = page.replace(`/${entryFileName}`, '');
        config[key] = path.join(cwd, page);
      });
      return config;
    }
  },

  /** 模版配置 */
  template: {
    /**
     * 模版引擎类型
     * 目前支持
     * - html
     * - pug
     * - ejs
     * - handlebars
     * - smarty
     * - velocity
     * - artTemplate
     * @type {string}
     */
    engine: 'pug',

    /**
     * 模版文件扩展名
     * @type {string}
     */
    extension: '.pug',

    /**
     * 是否根据 `entry pointer` 自动生成网页文件
     * @type {bool}
     */
    autoGeneration: true,

    /**
     * 是否往模版中注入 assets
     * @type {bool}
     */
    inject: true,

    /**
     * JavaScript Chunk 注入的位置
     * - 'head': 在</head>前注入
     * - 'body': 在</body>前注入
     * @type {'head'|'body'}
     */
    scriptInjectPosition: 'body',

    /**
     * 是否往模版中注入 PWA manifest.json
     * @type {bool}
     */
    injectManifest: false,

    /**
     * `manifest.json` 文件位置
     * @type {string}
     */
    manifest: 'manifest.json',

    /**
     * 生成网页用的源文件位置
     * @type {string}
     */
    source: 'src/templates/pages/default.pug',

    /**
     * 生成网页使用的字符编码
     * @type {string}
     */
    charset: 'UTF-8',

    /**
     * 生成网页使用的网页标题
     * @type {string}
     */
    title: '',

    /**
     * 生成网页使用的 favicon 图标
     * - false: 不使用 favicon 图标
     * - 非空字符串: favicon 图标的位置
     * @type {(bool|string)}
     */
    favicon: false,

    /**
     * 生成网页使用的关键字
     * @type {(bool|string)}
     */
    keywords: false,

    /**
     * 生成网页使用的网页标题
     * @type {(bool|string)}
     */
    description: false,

    /**
     * 网页文件中需要在编译时替换为 _hash 的标签属性列表
     * 格式为 tag:attribute
     * 如果想对所有标签的某个属性替换，请使用 * 代替 tag
     * 如所有标签的 src 属性都需要替换，则使用 *:src
     * @example ['*:src', 'link:href']
     * @type {array}
     */
    attrs: ['img:src', 'link:href'],

    /**
     * 模版中命中的静态文件编译输出的文件名
     * @type {string}
     */
    path: '[path][name]_[hash:8].[ext]'

  },

  /** HRM 配置 */
  hot: {
    /**
     * 是否启用热模块替换
     * @type {bool}
     */
    enable: true,

    /**
     * HRM 选项
     * @type {object}
     * @see {@link https://github.com/webpack-contrib/webpack-hot-middleware|webpack-hot-middleware}
     */
    options: {}
  },

  /** 长效缓存配置 */
  longTermCaching: {
    /**
     * 是否启用编译时文件 hash 重命名
     * @type {bool}
     */
    enable: true,

    /**
     * 文件名与 hash 连接使用的字符串
     * @type {string}
     */
    delimiter: '_',

    /**
     * hash 长度
     * @type {number}
     */
    fileHashLength: 8
  },

  /**
   * 是否压缩代码
   * @type {bool}
   */
  minimize: true,

  /**
   * `css-loader` 配置项
   * @type {object}
   * @see {@link https://github.com/webpack-contrib/css-loader|css-loader}
   */
  cssLoader: {
    /**
     * 在 css loader 之前应用的 loader 数量
     * @type {number}
     */
    importLoaders: 2,
    /**
     * 是否启用 `CSS Modules`
     * @type {bool}
     */
    modules: false,

    /**
     * 自定义css-modules类标识命名规则
     * @type {string}
     */
    localIdentName: '[path][name]__[local]--[hash:base64:5]'
  },

  /** stylelint 配置 */
  stylelint: {
    /**
     * 是否启用 `stylelint`
     * @type {bool}
     */
    enable: false,

    /**
     * `stylelint` 配置项
     * @type {object}
     * @see {@link https://stylelint.io/user-guide/node-api/#options|stylelint options}
     */
    options: {
      files: ['**/*.css', '**/*.less', '**/*.s?(a|c)ss']
    }
  },

  /**
   * runtimeChunk 配置
   * @see https://webpack.js.org/plugins/split-chunks-plugin/
   */
  runtimeChunk: {
    /**
     * 是否启用 runtimeChunk
     * @type {bool}
     */
    enable: false,

    /**
     * runtimeChunk 输出的文件名
     * @type {string}
     */
    name: 'runtime'
  },

  /**
   * commonChunks 配置
   * 可以配置多个 common 包
   * 该配置分别在以下过程中被调用：
   * - 在 `packing serve` 任务中被 `DllPlugin` 调用
   * - 在 `packing build` 任务中被 `SplitChunkPlugin` 调用
   * 注意，如果配置了commonChunks，所有网页模版需要引用公共包文件
   * 否则会报错
   * <script src="/vendor.js"></script>
   * @type {object}
   * @see https://webpack.js.org/plugins/split-chunks-plugin/
   */
  commonChunks: {
    // vendor: [
    //   'react',
    //   'react-dom'
    //   'packing-ajax'
    // ]
  },

  /**
   * webpack-visualizer-plugin 配置
   * @see https://github.com/chrisbateman/webpack-visualizer
   */
  visualizer: {
    /**
     * 是否启用 webpack-visualizer-plugin
     * @type {bool}
     */
    enable: false,

    /**
     * `visualizer` 配置项
     * @type {object}
     */
    options: {
      /**
       * 是否在浏览器中打开 visualizer 报表网页
       * 和 `packing build -o` 效果一样
       * @type {object}
       */
      open: false
    }
  },

  /** graphql 配置 */
  graphql: {
    /**
     * 是否使用 `GraphQL-mock-server`
     * @type {bool}
     */
    enable: false,

    /**
     * GraphQL 地址
     * @type {string}
     */
    graphqlEndpoint: '/graphql',

    /**
     * GraphiQL 地址
     * @type {string}
     */
    graphiqlEndpoint: '/graphiql'
  },

  /**
   * 静态资源类型
   * @type {array}
   */
  assetExtensions: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'mp3',
    'ttf',
    'woff',
    'woff2',
    'eot',
    'svg'
  ],

  /**
   * URL转发路由规则配置
   * `require!` 表示使用本地 mock 文件
   * @type {object}
   */
  rewriteRules: {
    /** 网站URL与模版的对应路由关系 */
    '^/$': '/index',

    /** API转发 */
    '^/api/(.*)': 'require!/mock/api/$1.js'
  }
};
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
请查看[数据模拟文档](https://github.com/packingjs/generator-packing/blob/master/generators/app/templates/mock/README.md)

#### 如何模拟页面初始化数据
请查看[数据模拟文档](https://github.com/packingjs/generator-packing/blob/master/generators/app/templates/mock/README.md)

#### 如何自定义页面的 URL 规则
`Packing` 默认会为每一个入口增加一个路由 `/${entrypoint}`。在实际项目中，可能存在线上路由和入口并不是对应关系，这时需要手动配置 `packing` 路由规则，以确保本地环境和线上环境更一致。

>假设需要把网站的登录页设置为网站首页

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
