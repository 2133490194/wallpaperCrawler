const becomingHtml = wallData => {
  let html = ''
  wallData.forEach(item => {
    html =
      html +
      `
    <div style="margin:20px 0; text-align="center">
      <img src=${item.previewUrl} alt=${item.name} />
      <a href=${item.downloadUrl}>
        下载地址：${item.name}
      </a>
    </div>
    <hr/>
    `
  })
  return html
}

module.exports = {
  becomingHtml
}
