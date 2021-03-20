$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  template.defaults.imports.dateFormat = function (date) {
    var dt = new Date(date);

    var y = padZero(dt.getFullYear());
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + '-' + hh + '-' + mm + '-' + ss;
  }

  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }



  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  };
  initTable();
  initCate();
  // 获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'get',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('error');
        }
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        renderPage(res.total);
      }
    })
  }

  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败')
        }
        var htmlStr = template('tpl-cate', res);
        // console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr);
        // 通知layui重新渲染表单区域的ui结构
        form.render();
      }
    })
  }
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();

    q.cate_id = cate_id;
    q.state = state;

    initTable();
  })

  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', //分页容器的id
      count: total, //总数居条数
      limit: q.pagesize,  //每页显示几条数据
      curr: q.pagenum,   //设置默认被选中的页码
      //触发jump回调的方式有两种，页码点击(first为true)，和调用laypage.render方法(first为undefined)
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        // initTable(); //直接调用会产生死循环
        if (!first) {
          initTable();
        }
      }
    })
  }

  $('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length;
    var id = $(this).attr('data-id');

    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'get',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败')
          }

          layer.msg('删除文章成功')
          //当数据删除后,需要判断当前页有没有数据了
          //如果没有剩余数据,则页码值-1 , 再调用initTable方法
          // console.log(len); //len等于1时页面数据删除结束
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }

          initTable();
        }
      })
      layer.close(index);
    })
  })
})