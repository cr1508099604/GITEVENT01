// options:请求参数对象
$.ajaxPrefilter(function (options) {
    //再发起真正的ajax请求前,同意拼接请求的根路径
    console.log(options)
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})