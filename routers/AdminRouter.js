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

module.exports = router