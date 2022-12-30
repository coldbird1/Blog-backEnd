const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { db, genid } = require("../db/DbUtils")


//添加
router.post('/_token/add', async (req, res) => {
  let id = genid.NextId()
  const { name } = req.body

  const sql = "INSERT INTO `category` (id,name) VALUES (?,?)"
  let { err, rows } = await db.async.run(sql, [id, name])

  if (err == null) {
    res.send({
      code: 200,
      msg: '添加成功',
      data: rows
    })
  } else {
    res.send({
      code: 500,
      msg: '添加失败',
    })
  }
})

//修改
router.put('/_token/update', async (req, res) => {

  const { id, name } = req.body

  const sql = "UPDATE `category` SET `name` = ? WHERE id = ?"
  let { err, rows } = await db.async.run(sql, [name, id])

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

//删除
router.put('/_token/delete', async (req, res) => {

  const id = req.query.id

  const sql = "DELETE FROM `category` WHERE id = ?"
  let { err, rows } = await db.async.run(sql, [id])

  if (err == null) {
    res.send({
      code: 200,
      msg: '删除成功',
      data: rows
    })
  } else {
    console.log(err);
    res.send({
      code: 500,
      msg: '删除失败',
    })
  }
})

//分页
router.get('/list', async (req, res) => {

  const sql = "SELECT * FROM `category`"
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


module.exports = router