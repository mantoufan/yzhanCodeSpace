const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const complierSfc = require('@vue/compiler-sfc')
const complierDom = require('@vue/compiler-dom')
const app = new Koa()
app.use(async ctx => {
  const { url, query } = ctx.request
  // => index.html
  if (url === '/') {
    ctx.type = 'text/html'
    let content = fs.readFileSync('./index.html', 'utf-8')
    // 支持 process.env
    content = content.replace('<script','<script>window.process = { env: { NODE_ENV: \'dev\' }}</script><script')
    ctx.body = content
  } 

  // *.js => src/*.js
  else if (/.js$/.test(url)) { // url.endsWith('.js)
    // src/main.js => 代码文件所在位置/src/main.js
    const p = path.resolve(__dirname, url.slice(1)) // 删除 / 即：/src -> src
    ctx.type = 'application/javascript'
    const content = fs.readFileSync(p, 'utf-8')
    ctx.body = rewriteImport(content)
  }

  // 第三方库的支持
  // /@modules/vue => node_modules/vue
  else if (/\/@modules/.test(url)){
    // @modules/vue => 代码的位置/node_modules/vue/ 的 es 模块入口
    // 读取 package.json 的 module 属性
    const prefix = path.resolve(__dirname, 'node_modules', url.replace(/.*\/@modules\//, ''))
    // 读取 package.json 中的 module
    const modulePath = require(prefix + '/package.json').module
    const p = path.resolve(prefix, modulePath)
    const ret = fs.readFileSync(p, 'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(ret)
  }

  // 支持 SFC 单文件组件
  // *.vue 或 *.vue?type=template
  else if (url.includes('.vue')) {
    // 第一步：vue 文件 => 编译 template script (complier-sfc)
    const p = path.resolve(__dirname, url.slice(1).split('?')[0]) 
    const { descriptor } = complierSfc.parse(fs.readFileSync(p, 'utf-8'))
    if (query.type === void 0) {
      // descriptor => 提取 script 部分 + template 生成 render 部分
      ctx.type = 'application/javascript'
      ctx.body = `${rewriteImport(
        descriptor.script.content.replace('export default', 'const __script =')
      )}
      import { render as __render } from "${url}?type=template"
      __script.render = __render
      export default __script
      `
    } else {
      // 第二步：template 模板 => render 函数 (complier-dom)
      const template = descriptor.template
      const render = complierDom.compile(template.content, { mode: 'module' })
      ctx.type = 'application/javascript'
      ctx.body = rewriteImport(render.code)
    }
  }

  // css 文件
  else if (url.endsWith('.css')) {
    // css 转化为 js 代码
    const p = path.resolve(__dirname, url.substring(1))
    const file = fs.readFileSync(p, 'utf-8')
    // 利用 js 添加一个 style 标签
    const content = `
    const css = "${file.replace(/\n/g, "")}"
    let link = document.createElement('style')
    link.setAttribute('type', 'text/css')
    document.head.appendChild(link)
    link.innerHTML = css
    export default css
    `
    ctx.type = 'application/javascript'
    ctx.body = content
  }

  // 需要改写，欺骗一下浏览器 'vue' => '/@modules/vue => 别名
  // from 'xxx'
  // Vue => node_modules/***
  function rewriteImport(content) {
    // 正则表达式的替换
    return content.replace(/ from ('|")([\w@\/-]+)\1/g, (s0, _, s2) => {
      if(s2[0] !== '.' && s2[1] !== '/') {
        // 不是绝对路径或相对路径 / ./ ../ 
        return ` from '/@modules/${s2}'`
      } else {
        return s0
      }
    })
  }
})
app.listen(3000, () => {
  console.log('Vite start at 3000')
})