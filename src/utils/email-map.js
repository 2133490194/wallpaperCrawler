const fs = require('fs')
const path = require('path')

//   {
//     filename: '附件',
//     path: './app/app.js'
//   }
const emailAttachmentMap = () => {
  const files = fs.readdirSync(
    path.resolve(path.join(__dirname, '..'), `./imgData`)
  )

  const emailAttachmentObject = files.map((item, index, array) => {
    return {
      filename: item,
      path: path.resolve(path.join(__dirname, '..'), `./imgData/${item}`)
    }
  })

  return emailAttachmentObject
}

module.exports = {
  emailAttachmentMap
}
