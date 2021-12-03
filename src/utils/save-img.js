const asyncFn = require('async')
const { downloadImg } = require('./download-img')

const saveImg = (wallData, dirPath) => {
  let index = 0
  return new Promise((resolve, reject) => {
    // 开始按顺序写入文件流
    asyncFn.mapSeries(
      wallData,
      (item, callback) => {
        setTimeout(async () => {
          index++
          await downloadImg(
            dirPath,
            item.downloadUrl,
            item.name,
            index
          )
          callback(null, item)
        }, 0)
      },
      function (err, results) {
        resolve()
      }
    )
  })
}

module.exports = {
  saveImg
}
