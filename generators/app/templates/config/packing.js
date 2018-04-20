/**
 * 这个文件可以修改packing配置文件的默认设置
 * 默认配置请看 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */<% var templateExtension;
 switch (props.template) {
   case 'ejs':
     templateExtension = 'ejs';
     break;
   case 'handlebars':
     templateExtension = 'hbs';
     break;
   case 'pug':
     templateExtension = 'pug';
     break;
   case 'smarty':
     templateExtension = 'tpl';
     break;
   case 'velocity':
     templateExtension = 'vm';
     break;
   case 'artTemplate':
     templateExtension = 'html';
     break;
   default:
     templateExtension = 'html';
     break;
 } %>

export default (packing) => {
  const p = packing;
  // 模版引擎类型，目前支持的类型有[html,pug,ejs,handlebars,smarty,velocity,artTemplate]
  p.template.engine = '<%= props.template%>';
  // 模版文件扩展名
  p.template.extension = '.<%= templateExtension%>';
  // 通用模版位置
  p.template.source = 'src/templates/pages/default.<%= templateExtension%>';
  // 网站自定义配置
  p.rewriteRules = {
    // 网站URL与模版的对应路由关系
    '^/$': '/index',
    // API转发
    '^/api/(.*)': 'require!/mock/api/$1.js'
  };

  return p;
};
