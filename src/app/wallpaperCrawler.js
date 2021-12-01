const cheerio = require('cheerio')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const request = require('request')
const logger = require('../utils/log4')

const { dirExists } = require('../utils/auto-create-dir')

const wallpaperCrawler = async (relativePath, imgPage) => {
  let $ = ''
  let previewImgElement = ''
  let start_time
  let end_time
  let spend_time
  const url = `https://wallpapercave.com/featured-wallpapers/${imgPage}`
  const download_url =
    'https://wallpapercave.com/download/very-nice-wallpapers-'

  const filePath = path.join(__dirname, '..') + `/${relativePath}`

  return new Promise(async (resolve, reject) => {
    // 判断此路径是否存在，若不存在，则自动创建
    await dirExists(filePath)

    logger.info('开始抓取壁纸...')
    start_time = Math.round(new Date())

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
        `<div style="margin-bottom:30px; text-align="center">
        <img src=https://wallpapercave.com${$(item).attr('src')} alt=${i} />
        <a href=${loadImgUrl} style="text-a">
          下载壁纸：${imgName}
        </a>
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
          end_time = Math.round(new Date())
          spend_time = (end_time - start_time) / 1000
          logger.info(
            `抓取结束，共抓取到${element.length}张壁纸，用时${spend_time}s`
          )
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
      resolve(true)
    })
  })
}

module.exports = {
  wallpaperCrawler
}
