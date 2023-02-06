const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { db, genid } = require("../db/DbUtils")
var dayjs = require('dayjs');

router.post("/login", async (req, res) => {

  let { account, password } = req.body

  let { err, rows } = await db.async.all("select * from `admin` where `account` = ? AND `password` = ?", [account, password])

  if (err == null && rows.length > 0) {

    let login_token = uuidv4()

    let update_token_sql = "UPDATE `admin` SET `token` = ? where `id`=?"

    await db.async.run(update_token_sql, [login_token, rows[0].id])

    let admin_info = rows[0]
    admin_info.token = login_token
    delete admin_info.password

    admin_info.expires = new Date().getTime() + 3600 * 2 * 1000 //token过期时间两小时

    console.log({
      code: 200,
      msg: "登陆成功",
      data: admin_info
    });
    res.send({
      code: 200,
      msg: "登陆成功",
      data: admin_info
    })
  } else {
    res.send({
      code: 500,
      msg: "登陆失败"
    })
  }

})

//分页
router.get('/list', async (req, res) => {

  const sql = "SELECT `id`,`account`,`userName` FROM `admin`"
  let { err, rows } = await db.async.all(sql, [])
  console.log(rows);
  if (err == null) {
    res.send({
      code: 200,
      msg: '查询成功',
      data: rows
    })
  } else {
    console.log(err);
    res.send({
      code: 500,
      msg: '查询失败',
    })
  }
})

//新增用户
router.post('/add', async (req, res) => {
  let id = genid.NextId()
  let { account, password, userName } = req.body
  userName = userName ? userName : account
  console.log(req.body);
  //先查询用户名是否存在
  const ssql = "SELECT `id`,`account`,`userName` FROM `admin` where `account`=?"
  let { err: serr, rows: srows } = await db.async.all(ssql, [account])
  if (serr !== null || srows.length > 0) {
    res.send({
      code: 500,
      msg: '该用户名已存在',
    })
    return false
  }

  const sql = "INSERT INTO `admin` (id,account,password,userName) VALUES (?,?,?,?)"
  let { err, rows } = await db.async.run(sql, [id, account, password, userName])

  if (err == null) {
    res.send({
      code: 200,
      msg: '添加成功',
      data: {}
    })
  } else {
    res.send({
      code: 500,
      msg: '添加失败',
    })
  }
})

//修改密码
router.put('/_token/update', async (req, res) => {
  console.log(11111111111111111);
  const { id, password } = req.body

  const sql = "UPDATE `admin` SET `password` = ? WHERE id = ?"
  let { err, rows } = await db.async.run(sql, [password, id])

  if (err == null) {
    res.send({
      code: 200,
      msg: '更新成功',
      data: rows
    })
  } else {
    console.log(err);
    res.send({
      code: 500,
      msg: '更新失败',
    })
  }
})


module.exports = router