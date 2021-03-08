$(function () {
  //去注册账号
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  })
  //去登陆
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })
  //步骤一：从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    pass: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    repass: function (value) {
      var pwd = $('.reg-box [name=password]').val();
      if (pwd !== value) {
        return '两次密码输入不一致';
      }
    }
  })

  //注册功能
  $('#form-reg').on('submit', function (e) {
    e.preventDefault();
    var data = {
      username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val()
    };
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg(res.message);
      $('#link_login').click();
    })
  })
  // 登录功能
  $('#form-login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'post',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！');
        // console.log(res.token);
        // 将登录成功得到的token值存储到本地
        localStorage.setItem('token', res.token);
        location.href = '/index.html';
      }
    })
  })
})