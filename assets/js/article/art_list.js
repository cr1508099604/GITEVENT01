$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示几条数据,默认每页显示2条
        cate_id: '', //文章分类的ID
        state: '' //文章的发布状态
    }
    //获取文书列表数据的方法
    initTable()

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }

        })
    }
    initCate()

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    $('#form-searc').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function renderPage(total) {
        //调用laypage.render方法来渲染分业结构
        laypage.render({
            elem: 'pageBox', //分业容器的id  注意，这里的 test1 是 ID，不用加 # 号
            count: total, //总数据条数  数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8],
            //页面发生切换时触发jump回调
            jump: function (obj, first) {
                // first是形参可以更改名字
                // 可以通过first的值来判断通过哪种方式触发的jump
                // first是记录jump触发的一种状态
                // first为undefined表示手动触发
                // first为true表示程序触发
                console.log(first)
                console.log(obj.curr)
                q.pagenum = obj.curr
                q.pagesize = obj.limit //把最新页码值赋值到q这个查询参数对象中
                if (!first) {
                    initTable()
                }

            }
        });
    }
    $('tbody').on('click', '.btn-delete', function () {
        console.log(123)
        var len = $('#btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    initTable()
                    if (len == 1 && q.pagenum !== 1) {
                        q.pagenum -= 1
                    }
                }
            })
            layer.close(index)
        })
    })
})