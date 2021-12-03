const { dirExists } = require('./auto-create-dir')
const { delDir } = require('./delete-file')
const { emailAttachmentMap, becomingHtml } = require('./email-map')
const { downloadImg } = require('./download-img')
const { saveImg } = require('./save-img')
const logger = require('./log4')
module.exports = {
  dirExists,
  delDir,
  emailAttachmentMap,
  downloadImg,
  becomingHtml,
  saveImg,
  logger
}
