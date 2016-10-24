/**
 * serve脚本
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module tools/serve
 */

import path from 'path';
import Express from 'express';
import webpack from 'webpack';
import urlrewrite from 'packing-urlrewrite';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../config/webpack.serve.babel';
import packing, { rewriteRules } from '../config/packing';

<% if (props.template !== 'html') { %>// eslint-disable-next-line
const template = require(`packing-template-${packing.templateEngine}`);
<% } %>

const { src, assets, templatesPages, mockPageInit } = packing.path;
const compiler = webpack(webpackConfig);
const port = packing.port.dev;
const serverOptions = {
  contentBase: src,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true }
};

const app = new Express();
app.use(Express.static(path.join(__dirname, '..', assets)));
app.use(urlrewrite(rewriteRules));
app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));<% if (props.template !== 'html') { %>
app.use(template({
  templates: templatesPages,
  mockData: mockPageInit,
  rewriteRules
}));<% } else { %>
app.use(Express.static(path.join(__dirname, '..', templatesPages)));
<% } %>

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
