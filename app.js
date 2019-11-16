const koa = require('koa');
const app = new koa();
const static = require('koa-static');
// const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const rest = require('./rest');
const session = require('koa-session');
const path = require('path')

const koaBody = require('koa-body');
app.keys = ['some secret hurr'];  // cookie的签名，不用管

const CONFIG = {
  key: 'koa:sess', // 也不用管，也是跟cookie相关的，就默认就可以了。
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, // 据说没有效果，默认就好了，设不设置都能覆盖 
  httpOnly: true, // true表示只有服务器端可以获取
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
// app.use(bodyParser());
app.use(koaBody({
  multipart: true, // 支持文件上传
  // encoding: 'gzip',
  formidable: {
    uploadDir: path.join(__dirname, 'build/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    onFileBegin: (name, file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}));

app.use(static('build'));

app.use(rest.restify());
app.use(controller());

app.listen(4000);
