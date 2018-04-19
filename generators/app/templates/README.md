# <%= props.name %>

## 常用命令

1. 启动开发模式
  ```
  npm run serve
  ```

2. 在浏览器中预览网站 `http://localhost:8081`

3. 其他命令
  ```sh
  # 编译工程
  npm run build

  # 不同环境下编译工程
  npm run build:dev
  npm run build:beta
  npm run build:prod

  # 编译并预览编译结果，端口8080
  npm run serve:dist

  # 启动时自动打开浏览器功能
  npm run serve -- --open_browser
  npm run serve -- -o

  # 启动时强制清除DLL缓存功能
  npm run serve -- --clean_cache
  npm run serve -- -c

  # 编译时自动打开包体积报告网页
  npm run build -- --open
  npm run build -- -o
  ```

## 目录结构

```
.
├── /assets/                            # 静态资源，如图片、字体
├── /config/                            # webpack配置文件
│   ├── /packing.js                     # packing相关的配置
│   ├── /webpack.build.babel.js         # webpack编译环境配置文件
│   ├── /webpack.dll.babel.js           # webpack dll编译环境配置文件
│   └── /webpack.serve:dist.js          # webpack预览编译后结果的配置文件
├── /mock/                              # 模拟数据
│   ├── /api/                           # API接口类型模拟数据
│   └── /pages/                         # 页面初始化类型模拟数据
├── /prd/                               # 项目编译输出目录
├── /profiles/                          # 类似maven的profiles，设置不同环境下的配置
├── /src/                               # 项目源码目录
│   ├── /entries/                       # webpack打包入口js
│   └── /templates/                     # 后端模版，如jade、smarty
├── .babelrc                            # babel配置
├── .editorconfig                       # 代码编辑器配置
├── .eslintrc                           # eslint配置
├── package.json
├── pom.xml                             # maven配置
└── README.md                   
```

## 约定
* 网页模版中对静态资源引用时使用绝对路径，如 `<script src='/logo/qunar.png'>`
* **CSS文件引用 `assets` 中的静态资源时使用波浪线 `~` 开头的相对路径**，下面的css能引用到 `assets/images/packing-logo.png`
```css
background: url(~images/packing-logo.png)
```

## 关于 `git commit -m` 规范提议
本工程使用了`standard-version`版本管理工具  
> 该工具将通过git commit -m 时填写的信息，自动升级version版本号，并自动生成 `CHANGELOG.md` 记录文件  
> 只有符合change-log规范要求的提交信息，才会被记录并作为升级version的依据，不符合的提交信息将被忽略  

提议规范：  
- 需求开发时，若一个功能完成，提交时用`feat([页面名/组件名/PMO编号]): `开头；  
  若功能未完成，不重要的提交时不使用规范开头，重要的提交时使用`chore: `开头；  
  样式修改提交时使用`style: `开头。  
- 修复bug，全部修完并验证之后提交时使用`fix([页面名/组件名/PMO编号]): `开头；  
  未全部修复完成时，不重要的提交不使用规范开头，重要的提交使用`chore: `开头。  
- 修改文档、注释等，提交时用`docs: `开头  
- 其他重要修改提交时都使用`chore: `开头，不使用`refactor` `perf` `test`。  
- feat、 fix 等后面的括号内表示scope，可以不写括号及内容，建议写上PMO编号。  
- 上线前最后一次提交前，使用`npm run release`命令，来自动升级version版本号并更新CHANGELOG.md，然后push。  

参考资料：  
- [Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit)  
- [Standard Version](https://github.com/conventional-changelog/standard-version)


## Examples
https://github.com/zhongzhi107/packing/tree/master/examples

## 使用其他npm源
```
# npm使用qunar源
npm install --registry http://registry.npm.corp.qunar.com --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass
npm install --registry http://registry.npm.taobao.com

# 只安装dependencies，不安装devDependencies，适用于QDR编译机
npm install --registry http://registry.npm.corp.qunar.com --production
```
## 常见问题

### 如何配置和线上环境一样的路由
路由规则修改后需要重启`npm run serve`

### eslint错误太多了
根据团队的实际代码风格，修改 `.eslintrc`

### js文件中如何使用图片、字体等静态资源
假设文件目录结构如下：
```
├── /hotel/
│   └── /entries/
│       └── /index.js
└── /assets/
    └── /images/
        └── /logo.png

```
有两种方式能将静态资源引入JavaScript中：

1. 使用webpack的require机制（推荐）
  require或import时使用静态资源相对路径，有两种相对路径可用：
  - 静态文件相对于当前JavaScript文件的相对路径

    ```js
    // index.js
    import logo from '../../assets/images/logo.png';
    ```
    当文件目录层级比较深时，这种方式书写较费劲
  - 静态文件相对于`assets`的相对路径

    ```js
    // index.js
    import logo from 'images/logo.png';
    ```
    这种方式比较简洁
    无论使用上述哪种方式引入的静态资源，使用时都必须使用绝对路径

    ```js
    // index.js
    import logo from '../../assets/images/logo.png';
    // import logo from 'images/logo.png';
    var a = new Image();
    a.src = `/${logo}`;
  ```

### webpackJsonp is not defined
可能配置了common chunks，公共文件打到了vendor.js，需要在页面引用vendor.js，
```html
<script src="/vendor.js"></script>
```
如果vendor.js引用了css，页面还需要引用vendor.css
```html
<link href="/vendor.css" media="all" rel="stylesheet" />
```

### package.json中依赖包的版本更新了，但DLL不更新，还是走的缓存
启动时使用参数强制删除缓存
```
npm run serve -- --clean_cache
```

### 本地编译正常，在编译服务器上发布时却提示找不到某些依赖包
本地开发时用的npm安装命令是 `npm install` ，它会`devDependencies`和`dependencies`包含的所有包，为了减少不必要的包安装、提高安装速度，在编译服务器上用的npm安装命令是 `npm install --production`，它只会安装`dependencies`下的包。出现这种情况是因为包的位置摆放错误，你需要把在编译服务器上提示找不到的这些包从`devDependencies`移动到`dependencies`下。

### schema和job参数怎么配置
```
fe.xxx.build_method=node
fe.xxx.build_command:
```
