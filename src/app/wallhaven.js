const cheerio = require('cheerio')
const axios = require('axios')
const path = require('path')
const { dirExists } = require('../utils')

const wallhaven = option => {
  return new Promise(async (resolve, reject) => {
    const { seed, dirPath, resolution, page, ratios } = option
    const savePath = path.resolve(path.join(__dirname, '..'), dirPath)
    let url = `https://wallhaven.cc/search?categories=110&purity=110&sorting=random&order=desc&ratios=${ratios}&resolutions=${resolution}&seed=${seed}&page=${page}`
    // const headers = {
    //   'User-Agent':
    //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763'
    // }
    let $ = ''
    let wallData = []

    // 则自动创建存储文件夹
    await dirExists(savePath)

    // 抓取相关标签对象
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

    // 获取所有预览图链接，生成资源数据对象, 拿到每张图片的名称
    wallPreviewUrl.each((i, item) => {
      const url = $(item).attr('data-src')
      wallData.push({
        name: url.split('/')[5].split('.')[0],
        previewUrl: url
      })
    })

    // 解析每张图的后缀，给每个图片名称加上后缀，存入资源数据对象，
    thumbInfo.each((i, item) => {
      let postfix = ''
      if ($(item).find('.png').text()) {
        postfix = 'png'
      } else {
        postfix = 'jpg'
      }
      wallData[i].postfix = postfix
      wallData[i].name += '.' + postfix
    })

    // 开始拼接所有实际图片的跳转链接,将链接存入资源对象,并开始写入数据
    wallData.forEach(async item => {
      const prefix = item.previewUrl.split('/')[4]
      const downloadUrl = `https://w.wallhaven.cc/full/${prefix}/wallhaven-${item.name}`
      item.downloadUrl = downloadUrl
    })

    resolve(wallData)
  })
}

module.exports = {
  wallhaven
}
