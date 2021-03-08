$.ajaxPrefilter(function (option) {
  option.url = 'http://api-breakingnews-web.itheima.net' + option.url;
  // 私有信息添加请求头配置
  if (option.url.indexOf('/my/') !== -1) {
    option.headers = {
      Authorization: localStorage.getItem('token') || ''
    };
  };
  //全局统一挂载complete回调函数
  option.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //强制清空token
      localStorage.removeItem('token');
      //强制跳转到登录页面
      location.href = '/login.html';
    }
  }

})