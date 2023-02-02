const express = require("express")
const router = express.Router()
const fs = require("fs")
const { db, genid } = require("../db/DbUtils")

router.post("/rich_editor_upload", async (req, res) => {

  if (!req.files) {
    res.send({
      "errno": 1,
      "message": "上传失败"
    })
    return
  }

  let files = req.files
  let ret_files = []

  for (const file of files) {
    console.log(file);
    //获取文件名后缀
    let file_ext = file.originalname.slice(file.originalname.lastIndexOf(".") + 1)
    //随机文件名字
    let file_name = genid.NextId() + '.' + file_ext
    //修改名字移动文件
    fs.renameSync(process.cwd() + "/public/upload/temp/" + file.filename, process.cwd() + "/public/upload/" + file_name)
    ret_files.push("/upload/" + file_name)
  }

  console.log('url', ret_files[0]);

  res.send({
    "errno": 0,
    "data": {
      "url": ret_files[0]
    }
  })

})

module.exports = router

