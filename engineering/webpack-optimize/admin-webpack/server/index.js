const http = require('http')
const express = require('express')
const estatic = require('express-static')
const history = require('connect-history-api-fallback')
const path = require('path')
const app = express()

app.use(history())
app.use(estatic(path.join(__dirname, '../dist')))

http.createServer(app).listen(8886, () => {
  console.log('调试服务器启动成功 at http://127.0.0.1:8886')
})