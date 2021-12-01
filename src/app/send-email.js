const nodemailer = require('nodemailer')

const config = require('./config')
const logger = require('../utils/log4')

const transport_config = {
  host: config.SENDER_HOST,
  secure: true,
  auth: {
    user: config.SENDER_EMAIL,
    pass: config.SENDER_PASS
  }
}

const send_config = {
  from: `${config.SENDER_NAME} ${config.SENDER_EMAIL}`,
  to: config.RECIPIENT_EMAIL,
  subject: config.EMAIL_SUBJECT,
  // html: res.data.imgs,

  date: new Date()
}

const sendEmail = async () => {
  logger.info('邮件开始发送...')
  return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport(transport_config)

    transporter.sendMail(send_config, (err, info) => {
      if (err) {
        logger.error('邮件发送失败。',err)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = {
  sendEmail,
  send_config
}
