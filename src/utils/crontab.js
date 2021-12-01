const schedule = require('node-schedule')
const logger = require('./log4')
const path = require('path')

const { sendEmail, send_config } = require('../app/send-email')
const { wallpaperCrawler } = require('../app/wallpaperCrawler')
const { emailAttachmentMap } = require('./email-map')
const { delDir } = require('./delete-file')

const scheduleCron = cronRule => {
  // const rule = new schedule.RecurrenceRule()
  // rule.second = [0, 20, 40, 59] // 秒
  // rule.minute = 0 //分
  // rule.hour = 0 // 时
  // rule.date = 0 // 几号
  // rule.dayOfWeek = 0 // 星期几

  schedule.scheduleJob(cronRule, async () => {
    await wallpaperCrawler('imgData', 0).then(async result => {
      const { count, html } = result
      const attachments = emailAttachmentMap()

      send_config.attachments = attachments
      send_config.html = `
      <div>
        <p>自动抓取壁纸工具：</p>
        <p>提供两种下载方式：1.附件；2.预览图下方链接；下载资源均为原图</p>
        ${html}
      </div>`

      await sendEmail().then(res => {
        logger.info(`邮件发送成功`)
        delDir(path.resolve(path.join(__dirname, '..'), `./imgData`))
      })
    })
  })
}

module.exports = {
  scheduleCron
}
