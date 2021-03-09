$(function () {
  getUserInfo();
  var layer = layui.layer;
  $('#btnLogout').on('click', function () {
    layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      localStorage.removeItem('token');
      location.href = '/login.html';
      //关闭提示框
      layer.close(index);
    });
  })
})

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败');
      }
      renderAvatar(res.data);
    }
  })
}

function renderAvatar(user) {
  var name = user.nickname || user.username;
  $('.welcome').html('欢迎&nbsp&nbsp' + name);

  // 渲染用户头像
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('scr', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    var first = name[0].toUpperCase();
    $('.layui-nav-img').hide();
    $('.text-avatar').html(first).show();
  }
}