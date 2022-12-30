const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { db, genid } = require("../db/DbUtils")


//添加
router.post('/_token/add', async (req, res) => {

  const { title, category_id, content } = req.body
  let id = genid.NextId()
  let create_time = new Date().getTime()

  const sql = "INSERT INTO `blog` (id,title,category_id,content,create_time) VALUES (?,?,?,?,?)"
  let { err, rows } = await db.async.run(sql, [id, title, category_id, content, create_time])

  if (err == null) {
    res.send({
      code: 200,
      msg: '添加成功',
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

  console.log('body', req.body);

  // const { id, title, content, category_id } = req.body
  const params = req.body

  if (params.id === undefined) {
    res.send({
      code: 500,
      msg: '修改失败,id缺失',
    })
    return
  }

  const id = params.id

  let paramsSql = []
  let paramsValue = []
  Object.keys(params).forEach(e => {
    if (params[e] !== undefined && e !== 'id') {
      paramsSql.push(`${e}=?`)
      paramsValue.push(params[e])
    }
  })

  if (paramsSql.length > 0) {

    let setSqlStr = paramsSql.join(',')
    sql = 'UPDATE `blog` SET ' + setSqlStr + ' WHERE `id`=?'
    console.log('sql', sql);

    let { err, rows } = await db.async.run(sql, [...paramsValue, id])

    if (err == null) {
      res.send({
        code: 200,
        msg: '修改成功',
        data: rows
      })
    } else {
      console.log(err);
      res.send({
        code: 500,
        msg: '修改失败',
      })
    }
  } else {
    res.send({
      code: 200,
      msg: '修改成功',
    })
  }



})

//删除
router.put('/_token/delete', async (req, res) => {

  const id = req.query.id

  const sql = "DELETE FROM `blog` WHERE id = ?"
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

//查询
/**
 * keyword 关键字
 * category_id 类别Id
 * page 页码
 * pageSize 每页长度
 */
router.get('/search', async (req, res) => {
  let { keyword, category_id, page, pageSize } = req.query

  keyword = keyword ?? ""
  category_id = category_id ?? 0
  page = page ?? 1
  pageSize = pageSize ?? 10

  let params = []
  let whereSql = []

  if (keyword) {
    whereSql.push(' (`title` LIKE ? OR `content` LIKE ?) ')
    params.push(`%${keyword}%`)
    params.push(`%${keyword}%`)
  }

  if (category_id) {
    whereSql.push(' `category_id`=? ')
    params.push(category_id)
  }

  let whereSqlStr = whereSql.length > 0 ? ' WHERE ' + whereSql.join(' AND ') : ''

  let pageParams = [(page - 1) * pageSize, pageSize]
  let sqlParams = [...params, ...pageParams]
  let sql = 'SELECT * FROM `blog`' + whereSqlStr + 'ORDER BY `create_time` DESC ' + ` limit ?,? `

  // console.log('sql', sql);
  // console.log('sqlParams', sqlParams);
  let searchRes = await db.async.all(sql, sqlParams)

  const countSql = 'SELECT COUNT(*) FROM `blog` ' + whereSqlStr
  // console.log('countSql', countSql);
  // console.log('params', params);
  let countRes = await db.async.all(countSql, params)
  // console.log('countRes', countRes);
  if (searchRes.err == null && countRes.err == null) {
    res.send({
      code: 200,
      msg: '查询成功',
      data: searchRes.rows,
      page,
      pageSize,
      count: countRes.rows[0]['COUNT(*)']
    })
  } else {
    console.log(searchRes.err);
    console.log(countRes.err);
    res.send({
      code: 500,
      msg: '查询失败',
    })
  }
})


module.exports = router