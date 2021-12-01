const dotenv = require('dotenv')

dotenv.config()

const {
  SENDER_EMAIL,
  RECIPIENT_EMAIL,
  SENDER_PASS,
  SENDER_NAME,
  EMAIL_SUBJECT,
  RECURRENCE_RULE,
  SENDER_HOST
} = process.env

module.exports = {
  SENDER_EMAIL,
  RECIPIENT_EMAIL,
  SENDER_PASS,
  SENDER_NAME,
  EMAIL_SUBJECT,
  RECURRENCE_RULE,
  SENDER_HOST
}
