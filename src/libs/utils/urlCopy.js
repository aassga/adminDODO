import Vue from 'vue';

export default function (copyUrl) {
  if (copyUrl == "") {
    return;
  }
  let url = document.createElement("input");
  document.body.appendChild(url);
  url.value = copyUrl;
  url.select();
  document.execCommand('copy');
  document.body.removeChild(url);
  //判斷是否有加http
  if(copyUrl.indexOf('http') < 0) {
    copyUrl = 'http://'+copyUrl; 
  }
  window.open(copyUrl);
  console.log(copyUrl);
  // Vue.prototype.$message({
  //   message: "网址复制成功",
  //   type: 'success',
  //   duration: 1000
  // });
}