const express = require('express')
const multer = require('multer')
const path = require("path")
const app = express()
const { db, genid } = require("./db/DbUtils")
const port = 8080

//跨域请求开放
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method == "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json())

//上传
const update = multer({
  dest: "./public/upload/temp"
})
app.use(update.any())

//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")))

//验证token中间件
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {
  if (req.path.includes(ADMIN_TOKEN_PATH)) {

    let { token } = req.headers
    console.log("req.headers", req.headers);
    let admin_token_sql = "SELECT * FROM `admin` WHERE `token`=?"
    let { err, rows } = await db.async.all(admin_token_sql, [token])
    console.log(rows);
    if (err == null && rows?.length > 0) {
      next()
    } else {
      res.send({
        code: 403,
        msg: "请登陆后操作"
      })
    }
  } else {
    next()
  }
})


//路由
app.use("/test", require('./routers/TestRouter'))
app.use("/admin", require('./routers/AdminRouter'))
app.use("/category", require('./routers/CategoryRouter'))
app.use("/blog", require('./routers/BlogRouter'))
app.use("/upload", require('./routers/UploadRouter'))

app.get('/', (req, res) => {
  res.send("hello,world")
})

app.listen(port, () => {
  console.log("启动成功:http://localhost:" + port);
})