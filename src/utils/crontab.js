const schedule = require('node-schedule')
const logger = require('./log4')
const { sendEmail, send_config } = require('../app/send-email')
const { wallpaperCrawler } = require('../app/wallpaperCrawler')
const { emailAttachmentMap } = require('./email-map')

const scheduleCron = () => {
  const rule = new schedule.RecurrenceRule()
  rule.second = [0, 20, 40, 59] // 秒
  // rule.minute = 0 //分
  // rule.hour = 0 // 时
  // rule.date = 0 // 几号
  // rule.dayOfWeek = 0 // 星期几
  schedule.scheduleJob(rule, async () => {
    await wallpaperCrawler('imgData', 0).then(async result => {
      const { count, html } = result
      const attachments = emailAttachmentMap()

      send_config.attachments = attachments
      send_config.html = `
      <div>
        ${html}
      </div>`

      await sendEmail().then(res => {
        logger.info(`邮件发送成功，本次爬取壁纸数为${count}张`)
      })
    })
  })
}

module.exports = {
  scheduleCron
}
