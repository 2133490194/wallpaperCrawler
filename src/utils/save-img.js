const asyncFn = require('async')
const { downloadImg } = require('./download-img')

const saveImg = (wallData, dirPath) => {
  return new Promise((resolve, reject) => {
    // 开始按顺序写入文件流
    asyncFn.mapSeries(
      wallData,
      (item, callback) => {
        setTimeout(async () => {
          await downloadImg(dirPath, item.downloadUrl, item.name, item.postfix)
          callback(null, item)
        }, 0)
      },
      function (err, results) {
        // console.log(err, results)
        resolve()
      }
    )
  })
}

module.exports = {
  saveImg
}
