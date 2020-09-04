// options:请求参数对象
$.ajaxPrefilter(function (options) {
    //再发起真正的ajax请求前,同意拼接请求的根路径
    console.log(options)
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    //统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //当请求结束后判断用户的设置访问权限
    options.complete = function (res) {
        console.log('wbquiiw')
        //当用户身份认证失败后
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.强制清空本地tonke
            localStorage.removeItem('token')
            //2.强制跳转登录页
            console.log('wquiwdqn')
            location.href = '/login.html'
        }
    }
})