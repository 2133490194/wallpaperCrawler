const fs = require('fs')
const path = require('path')

//   {
//     filename: '附件',
//     path: './app/app.js'
//   }
const emailAttachmentMap = (dirPath) => {
  const files = fs.readdirSync(
    path.resolve(path.join(__dirname, '..'), dirPath)
  )

  const emailAttachmentObject = files.map((item, index, array) => {
    return {
      filename: item,
      path: path.resolve(path.join(__dirname, '..'), `./${dirPath}/${item}`)
    }
  })

  return emailAttachmentObject
}

module.exports = {
  emailAttachmentMap
}
