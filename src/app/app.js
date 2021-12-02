const randomString = require('random-string')
const path = require('path')
const schedule = require('node-schedule')
const config = require('./config')
const { sendEmail, send_config } = require('./send-email')
const { wallpaperCrawler } = require('./wallpaperCrawler')
const { delDir, emailAttachmentMap, logger } = require('../utils')
const { becomingHtml } = require('../utils')

const startCrawler = async () => {
  const resolution = config.RESOLUTION || '1920x1080'
  const dirPath = config.DIR_PATH || 'imgData'
  await wallpaperCrawler({
    page: 1,
    resolution,
    dirPath,
    seed: randomString({ length: 6 })
  }).then(async res => {
    const html = becomingHtml(res.wallData)
    if (config.SENDER_EMAIL && config.SENDER_PASS) {
      send_config.attachments = emailAttachmentMap(dirPath)
      send_config.html = `
      <div>
        <span>自动抓取壁纸工具--反馈邮件</span><br/>
        <span>提供两种下载方式：1.附件；2.预览图下方跳转链接，跳转后手动另存为即可；</span><br/>
        <span>本次共抓取${res.wallData.length}张壁纸</span>
        ${html}
      </div>`

      await sendEmail().then(() => {
        logger.info(`邮件发送成功`)
        delDir(path.resolve(path.join(__dirname, '..'), dirPath))
        logger.info('壁纸文件已被清除！')
      })
    }
  })
}

const scheduleCron = cronRule => {
  // const rule = new schedule.RecurrenceRule()
  // rule.second = [0, 20, 40, 59] // 秒
  // rule.minute = 0 //分
  // rule.hour = 0 // 时
  // rule.date = 0 // 几号
  // rule.dayOfWeek = 0 // 星期几

  schedule.scheduleJob(cronRule, async () => {
    await startCrawler()
  })
}

module.exports = { startCrawler, scheduleCron }
