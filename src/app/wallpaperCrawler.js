const { wallhaven } = require('./wallhaven')
const { saveImg } = require('../utils')
const config = require('../app/config')

const wallpaperCrawler = option => {
  return new Promise(async (resolve, reject) => {
    await wallhaven(option).then(async res => {
      if (!(config.SENDER_EMAIL && config.SENDER_PASS)) {
        await saveImg(res, option.dirPath).then(() => {
          resolve({ wallData: res })
        })
      }
      resolve({ wallData: res })
    })
  })
}

module.exports = {
  wallpaperCrawler
}
