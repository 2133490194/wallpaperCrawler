const fs = require('fs')
const request = require('request')

// 异步执行函数，用于下载图片，接收参数：图片地址，文件名，文件后缀
function downloadImg(filePath, img_url, file_name, count) {
  return new Promise(async (resolve, reject) => {
    const writeStream = await fs.createWriteStream(
      `./src/${filePath}/` + file_name
    )

    // 调request下的pipe方法，配合文档写入流，存储图片
    const readStream = await request(img_url)

    readStream.pipe(writeStream)

    writeStream.on('error', err => {
      reject(err)
    })
    writeStream.on('finish', () => {
      console.log(`第${count}张写入成功~`)
      resolve(true)
    })
  })
}

module.exports = {
  downloadImg
}
