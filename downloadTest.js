// 文件流转blob对象下载
function downloadFile (data = '测试下载文件内容', type = "text/plain", fileName = "测试文件.txt") {
  let blob = new Blob([data], { type: `${type};charset=utf-8` });
  // 获取heads中的filename文件名
  let downloadElement = document.createElement('a');
  // 创建下载的链接
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  // 下载后文件名
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(href);
}

downloadFile()