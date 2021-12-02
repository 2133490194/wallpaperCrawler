const { wallhaven } = require('./wallhaven')
const wallpaperCrawler = option => {
  return new Promise(async (resolve, reject) => {
    await wallhaven(option).then(res => {
      resolve({ wallData: res })
    })
  })
}

module.exports = {
  wallpaperCrawler
}
