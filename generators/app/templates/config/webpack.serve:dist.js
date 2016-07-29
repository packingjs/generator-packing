import { isArray } from 'util';
import path from 'path';
import HtmlWebpackPlugin from 'packing-html-webpack-plugin';
import packingGlob from 'packing-glob';
import packing from './packing';

const { templateExtension } = packing;
const { dist, templatesDistPages, mockPageInit } = packing.path;
const htmlWebpackPluginConfig = [];
const globOptions = { cwd: path.resolve(templatesDistPages) };
const jsExt = '.js';
const pattern = isArray(templateExtension) && templateExtension.length > 1 ?
  `**/*{${templateExtension.join(',')}}` :
  `**/*${templateExtension}`;

packingGlob(pattern, globOptions).forEach(page => {
  const ext = path.extname(page);
  const templateInitData = path.resolve(mockPageInit, page.replace(ext, jsExt));
  htmlWebpackPluginConfig.push({
    filename: ext === '.html' ? page : `${page}.html`,
    template: path.resolve(templatesDistPages, page),
    templateInitData,
    cache: false,
    inject: false,
  });
});


const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, dist);

const output = {
  // prd环境静态文件输出地址
  path: assetsPath,
};

const moduleConfig = {
  loaders: [<% if (props.pug) { %>
    { test: /\.(jade|pug)$/, loader: 'pug' },<% } if (props.ejs) { %>
    { test: /\.ejs$/, loader: 'ejs' },<% } if (props.smarty) { %>
    { test: /\.(tpl|smarty)$/, loader: 'smarty' },<% } if (props.handlebars) { %>
    { test: /\.handlebars$/, loader: 'handlebars' },<% } if (props.mustache) { %>
    { test: /\.mustache$/, loader: 'mustache' },<% } if (props.html) { %>
    { test: /\.html$/, loader: 'html' },<% } %>
  ]
};

const plugins = htmlWebpackPluginConfig.map((item) => new HtmlWebpackPlugin(item));

export default {
  output,
  module: moduleConfig,
  plugins,
};
