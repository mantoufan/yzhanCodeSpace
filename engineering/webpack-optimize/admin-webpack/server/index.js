const http = require('http')
const express = require('express')
const estatic = require('express-static')
const history = require('connect-history-api-fallback')
const path = require('path')
const app = express()

app.use(history())
app.use(function(req, res, next) {
  console.log(req)
  if (req.url === '/index.html') {
    res.set({
      'Cache-Control': 'public, max-age=0',
      'Expires': new Date(Date.now() + 0).toUTCString()
    })
  } else {
    res.set({
      'Cache-Control': 'public, max-age=31536000',
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    })
  }
  next()
})
app.use(estatic(path.join(__dirname, '../dist')))

http.createServer(app).listen(8886, () => {
  console.log('调试服务器启动成功 at http://127.0.0.1:8886')
})