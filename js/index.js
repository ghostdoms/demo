//获取url函数
(function($) {
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
        // return unescape(r[2]);
            return decodeURIComponent(r[2]);
        return null;
    }
})(jQuery);
(function($) {
    //判断用户登录状态
    if (localStorage.getItem('user_info')) {
        var userinfo = localStorage.getItem('user_info');
        userinfo = JSON.parse(userinfo);
        $('.loginhead span').find('em').text(userinfo.user);
        /*分析模块的跳转路径*/
        // document.getElementById('fenxi').setAttribute(`href`, `http://192.168.2.40:8888/accounts/login/?next=/&user=${toAsill(userinfo.user)}&psd=${toAsill(userinfo.psd)}`)
    } else {
        location.href = "login.html";
    }; //个人信息
    $('.use-b').on('click', function(e) {
        e.stopPropagation();
        $(this).find('.index-option').toggle();
    });

    $(document).not($('.use-b')).on('click', function(e) {
        e.stopPropagation();
        $('.index-option').hide();
    });
    $('.index-option').find('li').on('click', function(e) {
        e.stopPropagation();
        if ($(this).index() == 0) {
            location.href = "changepsd.html";
        } else {
            localStorage.removeItem('user_info');
            location.href = "login.html";
        }
    });


    //修改密码遮罩
    $('.mark').css('top', $('.loginhead').innerHeight() + 'px');
    //关闭隐藏
    $('.close').on('click', function() {
        $('.mark').hide();
    });
    //旁白隐藏
    $('.mark').not('.markbox').on('click', function(e) {
        e.stopPropagation();
        $('.mark').hide();
    });
    $('.markbox').on('click', function(e) {
        e.stopPropagation();
    });
    //显示
    $('.changepsd').on('click', function() {
        $('.mark').show();
    });
})(jQuery)


//转Asill码函数
function toAsill(str) {
    var len = str.length;
    var init = [];
    for (var i = 0; i < len; i++) {
        init.push(str[i].charCodeAt())
    };
    init = init.join(':');
    return init;
};
