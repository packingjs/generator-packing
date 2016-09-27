/**
 * 和构建工具相关的配置信息
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/packing
 */

export default {
  // 文件路径，所有目录都使用相对于项目根目录的相对目录格式
  path: {
    // 源文件目录
    src: 'src',

    // 静态文件目录，可以设置在src里，也可以设置在src外
    assets: 'assets',

    // 页面初始化mock数据文件存放目录
    mockPageInit: 'mock/pages',

    // webpack打包入口JS文件目录
    entries: 'src/entries/{pagename}.js',

    // 模版目录，如果模版支持继承或layout的话
    // 模板一般会再区分布局文件(layout)和网页文件(pages)
    templates: 'src/templates',

    // 模版网页文件，如果没有使用layout的话，保持这个地址和`templates`一样
    templatesPages: 'src/templates/pages',

    // 编译输出产物目录
    dist: 'prd',

    // 编译后的静态文件目录
    assetsDist: 'prd/assets',

    // 编译后的模版目录，如果模版支持继承或layout的话
    // 模板一般会再区分布局文件(layout)和网页文件(pages)
    templatesDist: 'prd/templates',

    // 编译后的模版网页文件，如果没有使用layout的话，保持这个地址和`templatesDist`一样
    templatesDistPages: 'prd/templates/pages'
  },

  // 模版文件扩展名
  templateExtension: '.<%= props.template %>',

  // webserver端口
  port: {
    // 开发环境端口号
    dev: 8081,
    // 预览编译后结果的端口号
    dist: 8080
  },

  commonChunks: {
    // CommonsChunkPlugin会将最后一个当作Entry chunk
    // 注意，如果配置了commonChunks，所有网页模版需要引用公共包文件
    // 否则会报错
    // <script src="/vendor.js"></script>
    vendor: [
      'react',
      'react-dom',
      'classnames'
    ]
  },

  // 静态资源类型
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

  // 静态文件md5保留长度
  fileHashLength: 8,

  // URL转发路由规则配置
  // require! 表示使用本地mock文件
  rewriteRules: {
    // 网站URL与模版的对应路由关系
    '^/$': '/index.pug',
    '^/list$': '/list.pug',
    '^/detail$': '/test.tpl',

    // API转发
    '^/api/(.*)': 'require!/mock/api/$1.js'
    // '^/api/(.*)': '/index.jade.html',
    // '^/api/(.*)': 'http://touch.qunar.com/api/hotel/findhotelcity?cityName=%E5%8C%97%E4%BA%AC',
    // '^/hello': 'http://localhost:3001/123/4.html',
  }

};
