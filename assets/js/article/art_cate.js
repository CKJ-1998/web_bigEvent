$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();

  //获取评论列表数据
  function initArtCateList() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    })
  }
  //为添加类别绑定点击事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    });
  })

  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'post',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          layer.msg('新增分类失败！');
        }

        initArtCateList();

        layer.msg('新增分类成功');

        layer.close(indexAdd);
      }
    })
  })

  // 编辑文章类别
  var indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    // 为编辑按钮绑定点击事件
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '编辑文章分类',
      content: $('#dialog-edit').html()
    });

    var id = $(this).attr('data-id');
    $.ajax({
      method: 'get',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res.data);
        form.val('form-edit', res.data);
      }
    })
  })







  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新列表失败')
        }
        layer.msg('更新列表成功');

        layer.close(indexEdit);
        initArtCateList();
      }
    })
  })

  // 删除文章类别
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id');

    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'get',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败')
          }

          layer.msg('删除分类成功')

          initArtCateList();
        }
      })
      layer.close(index);
    })
  })
})