(function($) {
    $.fn.Upload_situation = function() {
        $(this).find('li').on('click', function() {
            $(this).addClass('on').siblings().removeClass('on');
            var period = parseInt($(this).text());
            if (period == 12 || period == 24) {
                period = period + 'hh'
            } else {
                period = period + 'dd'
            };
            var taskUrl = `${monitoringUrl}/job?period=${period}`;
            if ($(this).parent().attr('class') == 'timedateone') {
                getajax(taskUrl, 0);
            } else {
                getajax(taskUrl, 1);
            };

        });

        $('.table-box').delegate('.todetail', 'click', function() {
            var status = $(this).parent().attr('status');
            var domname = $(this).parents('.item').find('h4').text();

            var taskDetailUrl = `${monitoringUrl}/details?workspaceId=${domname}&status=${status}`;
            location.href = `monitoring_statistics_det.html?url=${taskDetailUrl}&workspaceId=${domname}&status=${status}`;

        });
        getajax(`${monitoringUrl}/job?period=24hh`, 0);
        getajax(`${monitoringUrl}/job?period=24hh`, 1);
    };
})(jQuery);
/*获取url*/
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
    var init = function() {
        getupload();
        getsql();
        $('.timedateone,.timedatetwo').Upload_situation();
        logFn('links');
    };
    init();
    /*判断页面*/
    if (location.pathname.indexOf('_det') >= 0) {
        if ($.getUrlParam('url')) {
            var url = $.getUrlParam('url');
            var status = $.getUrlParam('status');
            var domname = $.getUrlParam('workspaceId');
            gettaskDetail(url);
            $('.alert>span').text(status).attr('status', status);
            $('.workdom>span').text(domname);
            selects('select', 'alert');
            selects('select', 'workdom');
        } else {
            var taskDetailUrl = `${monitoringUrl}/details?workspaceId=all&status=all`;
            gettaskDetail(taskDetailUrl);
            selects('select', 'alert');
            selects('select', 'workdom');
        }
    } else if (location.pathname.indexOf('_det') < 0) {
        getupload();
        getsql();
        $('.timedateone,.timedatetwo').Upload_situation();
    }
    //获取累计上传统计
    function getupload() {
        var uploadUrl = `${monitoringUrl}/uploader`;
        $.ajax({
            url: uploadUrl,
            type: 'get',
            success: function(data) {
                if (data.code == 10200) {
                    var data = data.data;
                    var str = `<tr class="uploads"></tr>`;
                    var numOfJob = 0;
                    var dataSize = 0;
                    $.each(data, function(ind, val) {
                        str += `<tr>
                                <td>${val.workspaceName}</td>
                                <td>${val.numOfJob}</td>
                                <td>${val.dataSize}</td>
                            </tr>`;
                        numOfJob += parseInt(val.numOfJob);
                        dataSize += parseInt(val.dataSize);

                    });
                    $('.upload').html(str);
                    $('.uploads').html(`<td>总计</td>
                                    <td>${numOfJob}</td>
                                    <td>${dataSize}（G）</td>`)
                }
            },
            error: function() {
                console.log('error');
            }
        });
    };

    //获取数据库统计
    function getsql() {
        var sqlUrl = `${monitoringUrl}/db`;
        $.ajax({
            url: sqlUrl,
            type: 'get',
            success: function(data) {
                if (data.code == 10200) {
                    var data = data.data;
                    var str = `<tr class="sqls"></tr>`;
                    var numOfDB = 0;
                    var numOfTable = 0;
                    $.each(data, function(ind, val) {
                        str += `<tr>
                                <td>${val.workspaceName}</td>
                                <td>${val.numOfDB}</td>
                                <td>${val.numOfTable}</td>
                            </tr>`;
                        numOfDB += parseInt(val.numOfDB);
                        numOfTable += parseInt(val.numOfTable);

                    });
                    $('.sql').html(str);
                    $('.sqls').html(`<td>总计</td>
                                    <td>${numOfDB}</td>
                                    <td>${numOfTable}</td>`)
                }
            },
            error: function() {
                console.log('error');
            }
        });
    };

})(jQuery);

//获取近期任务情况
function getajax(taskUrl, num) {
    $.ajax({
                url: taskUrl,
                type: 'get',
                success: function(data) {
                        if (data.code == 10200) {
                            var str = ``;
                            var strr = ``;
                            $.each(data.data, function(ind, val) {
                                strr += `<li>${val.workspaceName}</li>`
                            });
                            console.log(strr);
                            $('.workdom').find('ul').html(strr);
                            if (num == 0) {
                                var data = data.data[0];
                                $('.taskdom1').text(data.workspaceName);
                            } else {
                                var data = data.data[1];
                                $('.taskdom2').text(data.workspaceName);
                            };
                            str += `  <tr>
                <td>在执行的任务数</td>
                <td status="ACTIVE">${data.numOfExecJob==0?data.numOfExecJob:`<a class="todetail">${data.numOfExecJob}</a>`}</td>
            </tr>
            <tr>
                <td>停止的任务数</td>
                <td status="ACTIVE">${data.numOfStoppedJob==0?data.numOfStoppedJob:`<a class="todetail">${data.numOfStoppedJob}</a>`}</td>
            </tr>
            <tr>
                <td>失败的任务数</td>
                <td status="ACTIVE">${data.numOfFailedJob==0?data.numOfFailedJob:`<a class="todetail">${data.numOfFailedJob}</a>`}</td>
            </tr>
            <tr>
                <td>报警的任务数</td>
                <td status="ACTIVE">${data.numOfAlarmJob==0?data.numOfAlarmJob:`<a class="todetail">${data.numOfAlarmJob}</a>`}</td>
            </tr>
            <tr>
                <td>新建的任务数</td>
                <td status="ACTIVE">${data.numOfNewJob==0?data.numOfNewJob:`<a class="todetail">${data.numOfNewJob}</a>`}</td>
            </tr>`;
                if (num == 0) {
                    $('.taskone').html(str);
                } else {
                    $('.tasktwo').html(str);
                };
            }
        },
        error: function() {
            console.log('error');
        }
        });
};
$('.wrap .mark,.wrap .log').css('height',screen.height-$('header').innerHeight()+'px');