const cheerio = require('cheerio')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const request = require('request')

const { dirExists } = require('../utils/auto-create-dir')

const wallpaperCrawler = async (relativePath, imgPage) => {
  let $ = ''
  let previewImgElement = ''
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763'
  }
  const url = `https://wallpapercave.com/featured-wallpapers/${imgPage}`
  const download_url =
    'https://wallpapercave.com/download/very-nice-wallpapers-'

  const filePath = path.join(__dirname, '..') + `/${relativePath}`

  return new Promise(async (resolve, reject) => {
    // 判断此路径是否存在，若不存在，则自动创建
    await dirExists(filePath)

    const element = await axios({
      method: 'get',
      url
    }).then(async res => {
      $ = cheerio.load(res.data)
      const element = $('#grid-container').find($('img'))
      return element
    })

    let index = element.length

    element.each(async (i, item) => {
      const integrityImgName = $(item).attr('src').split('/')[2]
      const imgName = i + 1 + '-' + integrityImgName.split('.')[0]
      const imgPostfixName = integrityImgName.split('.')[1]
      const loadImgUrl = download_url + imgName

      previewImgElement =
        previewImgElement +
        `<div style="margin-bottom:10px">
        <img src=https://wallpapercave.com${$(item).attr('src')} alt=${i} />
        <a href=https://wallpapercave.com${$(item).attr('src')}>${imgName}</a>
        <br/>
      </div>
      `
      await download_img(
        relativePath,
        loadImgUrl,
        imgName,
        imgPostfixName
      ).then(() => {
        index--
        if (!index) {
          resolve({ count: element.length, html: previewImgElement })
        }
      })
    })
  })
}

// 异步执行函数，用于下载图片，接收参数：图片地址，文件名，文件后缀
function download_img(filePath, img_url, file_name, postfix) {
  return new Promise(async (resolve, reject) => {
    const writeStream = await fs.createWriteStream(
      `./src/${filePath}/` + file_name + `.${postfix}`
    )

    // 调request下的pipe方法，配合文档写入流，存储图片
    const readStream = await request(img_url)

    readStream.pipe(writeStream)
    readStream.on('end', res => {
      writeStream.end()
    })
    writeStream.on('error', err => {
      reject(err)
    })
    writeStream.on('finish', () => {
      console.log(`已写入图片${file_name}${postfix}`)
      resolve(true)
    })
  })
}

module.exports = {
  wallpaperCrawler
}
