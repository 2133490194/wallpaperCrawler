const { dirExists } = require('./auto-create-dir')
const { delDir } = require('./delete-file')
const { emailAttachmentMap } = require('./email-map')
const { downloadImg } = require('./download-img')
const { becomingHtml } = require('./becoming-html')
const logger = require('./log4')
module.exports = {
  dirExists,
  delDir,
  emailAttachmentMap,
  downloadImg,
  becomingHtml,
  logger
}
