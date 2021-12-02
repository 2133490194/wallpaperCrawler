const cheerio = require('cheerio')
const axios = require('axios')
const path = require('path')
const async = require('async')
const logger = require('../utils/log4')

const { dirExists } = require('../utils/auto-create-dir')
const { downloadImg } = require('../utils')
const wallhaven = option => {
  return new Promise(async (resolve, reject) => {
    const { seed, dirPath, resolution, page } = option
    const savePath = path.resolve(path.join(__dirname, '..'), dirPath)
    let url = `https://wallhaven.cc/search?categories=010&purity=100&sorting=random&order=desc&resolutions=${resolution}&seed=${seed}&page=${page}`
    // const headers = {
    //   'User-Agent':
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763'
    // }
    let $ = ''
    let wallData = []
    let start_time
    let end_time
    // 则自动创建存储文件夹
    await dirExists(savePath)

    logger.info('开始抓取壁纸...')

    // 记录开始时间
    start_time = Math.round(new Date())

    // 获取预览图对象和a标签对象
    const elementData = await axios({
      method: 'get',
      url
    }).then(res => {
      $ = cheerio.load(res.data)
      const wallPreviewUrl = $('ul>li>figure').find('img')
      const thumbInfo = $('ul>li>figure').find('.thumb-info')
      return {
        wallPreviewUrl,
        thumbInfo
      }
    })

    const { wallPreviewUrl, thumbInfo } = elementData

    // 获取所有预览图链接，生成资源数据对象
    wallPreviewUrl.each((i, item) => {
      const url = $(item).attr('data-src')
      wallData.push({
        name: i + 1 + '-' + Math.round(new Date() / 1000),
        previewUrl: url
      })
    })

    // 解析每张图的后缀，存入资源数据对象
    thumbInfo.each((i, item) => {
      let postfix = ''
      if ($(item).find('.png').text()) {
        postfix = 'png'
      } else {
        postfix = 'jpg'
      }
      wallData[i].postfix = postfix
    })

    // 开始拼接所有实际图片的跳转链接,将链接存入资源对象,并开始写入数据
    wallData.forEach(async item => {
      const prefix = item.previewUrl.split('/')[4]
      const wallName = item.previewUrl.split('/')[5].split('.')[0]
      const downloadUrl = `https://w.wallhaven.cc/full/${prefix}/wallhaven-${wallName}.${item.postfix}`
      item.downloadUrl = downloadUrl
    })

    // 开始按顺序写入文件流
    async.mapSeries(
      wallData,
      (item, callback) => {
        setTimeout(async () => {
          await downloadImg(dirPath, item.downloadUrl, item.name, item.postfix)
          callback(null, item)
        }, 0)
      },
      function (err, results) {
        // console.log(err, results)
        end_time = Math.round(new Date())
        logger.info(
          `抓取结束，共抓取到${wallData.length}张壁纸，用时${
            (end_time - start_time) / 1000
          }s`
        )
        resolve(wallData)
      }
    )
  })
}

module.exports = {
  wallhaven
}
