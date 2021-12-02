const becomingHtml = wallData => {
  let html = ''
  wallData.forEach(item => {
    html =
      html +
      `
    <div style="margin:15px 0; text-align="center">
      <img src=${item.previewUrl} alt=${item.name} />
      <a href=${item.downloadUrl} style="text-a">
        跳转链接另存为：${item.name}
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
