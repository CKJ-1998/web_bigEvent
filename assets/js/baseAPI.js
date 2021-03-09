$.ajaxPrefilter(function (options) {
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
  // 私有信息添加请求头配置
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    };
  };
  //全局统一挂载complete回调函数
  options.complete = function (res) {
    console.log(res);
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //强制清空token
      localStorage.removeItem('token');
      //强制跳转到登录页面
      location.href = '/login.html';
    }
  }

})