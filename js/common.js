;
(function($) {
    $('.mark').css('top', $('header').height() + $('.one-title').height() + 'px');
    $('.log').css('top', $('header').height() + $('.one-title').height() + 'px');
})(jQuery);

//user
if (localStorage.getItem('user_info')) {
    var userinfo = localStorage.getItem('user_info');
    userinfo = JSON.parse(userinfo);
    $('.user').text(userinfo.user);
} else {
    location.href = "login.html";
}
$('.logout').on('click', function() {
    localStorage.removeItem('user_info');
    location.href = "login.html";
});


//user + one-title

$('.one-title').find('li').on('mouseenter', function(e) {
    e.stopPropagation();
    $(this).find('.taskbox').show();
    $(this).siblings().find('.taskbox').hide();
}).on('mouseleave', function() {
    $(this).find('.taskbox').hide();
    //$(this).siblings().find('.taskbox').show();
});
$(document).not($('.one-title li')).on('click', function(e) {
    e.stopPropagation();
    $('.taskbox').hide();
});

$('.use-b').on('click', function(e) {
    e.stopPropagation();
    $(this).find('.index-option').toggle();
})
$(document).not($('.use-b')).on('click', function(e) {
    e.stopPropagation();
    $('.index-option').hide();
})

//侧栏拖拽
var dragbox = document.getElementsByClassName('dragbox')[0];
if (dragbox) {
    dragbox.onmousedown = function(e) {
        var e = e || window.event;
        e.preventDefault();
        document.onmousemove = function(e) {
            var e = e || window.event;
            e.preventDefault();
            var left = e.clientX;
            if (left < 200) {
                $('.leftnav').css('width', '200px');
            } else if (left > screen.width - 200) {
                $('.leftnav').css('width', screen.width - 200 + 'px');
            } else {
                $('.leftnav').css('width', left + 'px');
            }
        };
        document.onmouseup = function(e) {
            var e = e || window.event;
            e.preventDefault();
            document.onmousemove = null;
        };
    }
}


//确认选择
$('.true').on('click', function() {
    $('.mark').hide();
    var ele = $(this).attr('status');
    if (ele == 'stop') {
        $.ajax({
            url: $(this).attr('url'),
            type: 'post',
            data: { 'operation': 'stop' } || {},
            success: function(data) {
                if (data.code == 10200) {
                    console.log('停止任务成功');
                    getTaskDom($('.second .title').find('span').eq(1).attr('uuid'), getstatus($('.statusdom span').text()));
                } else {
                    console.log('停止任务失败');
                }
            },
            error: function() {
                console.log('error')
            }
        });
    } else if (ele == 'delete') {
        $.ajax({
            url: $(this).attr('url'),
            type: 'delete',
            success: function(data) {
                if (data.code == 10200) {
                    console.log('停止任务成功');
                } else {
                    console.log('停止任务失败');
                }
            },
            error: function() {
                console.log('error')
            }
        });
    } else if (ele == 'delalert') {
        console.log('消除警报')
    } else if (ele == 'resume') {
        $.ajax({
            url: $(this).attr('url'),
            type: 'post',
            data: { 'operation': 'resume' } || {},
            success: function(data) {
                if (data.code == 10200) {
                    console.log('启动任务成功');
                    getTaskDom($('.second .title').find('span').eq(1).attr('uuid'), getstatus($('.statusdom span').text()));
                } else {
                    console.log('启动任务失败');
                }
            },
            error: function() {
                console.log('error')
            }
        });
    } else {
        console.log('others');
    }


});

/* mark show/hide */
$('.iscancel').on('click', function(e) {
    e.stopPropagation();
});
$('.close,.cancel').on('click', function() {
    $('.mark').hide();
});
$('.mark').not('.iscancel').on('click', function() {
    $('.mark').hide();
});

/* alertFn */
function alertFn(ele, info, path, data) {
    var url;
    $("." + ele).on('click', function() {
        $('.mark').find('h2').html(info);
        $('.mark').show();
        $('.mark .close').on('click', function() {
            $('.mark').hide();
        });
        if ($(this).attr('jobId')) {
            url = `${jobUrl}/${$(this).attr('jobId')}/operations`;
            $('.iscancel .true').attr({ 'status': ele, 'url': url });
        };
        $('.iscancel .true').attr({ 'status': ele });

    });
};

/* check log show/hide */
function logFn(ele) {
    $('.tablebox').delegate('.' + ele, 'click', function() {
        $('.log').show();
        $('.log .close').on('click', function() {
            $('.log').hide();
        });
        if ($(this).attr('taskid')) {
            var url = `${jobUrl}/logs/taskId=${$(this).attr('taskid')}`;
            $.ajax({
                url: url,
                type: 'get',
                success: function(data) {
                    if (data.code == 10200) {
                        data = data.data;
                        var str = ``;
                        $.each(data, function(ind, val) {
                            str += `<tr>
                                <td>${val.time}</td>
                                <td>${val.log}</td>
                            </tr>`
                        });
                        $('.logshow tbody').html(str);
                    }
                },
                error: function() {
                    console.log('error');
                }
            })
        } else if ($(this).attr('log')) {
            $('.logshow').find('ul').html(`<li>${$(this).attr('log')}<li>`)
        }

    });
    $('.tablebox').delegate('.logshow', 'click', function(e) {
        e.stopPropagation();
    });
    $('.log').not('.logshow').on('click', function() {
        $('.log').hide();
    });

};

/* select for 新建*/
function select(obj, parent, opt) {
    obj.on('click', function(e) {
        e.stopPropagation();
        $(this).find(opt).eq(0).toggle();
        $(this).parents(parent).siblings().find(opt).hide();
    })
    $(opt).find('li').on('mouseover', function(e) {
        e.stopPropagation();
        if ($(this).parents(opt).next()) {
            $(this).parents(opt).next().show();
        }
    })
    $(opt).find('li').on('click', function(e) {
        e.stopPropagation();
        $(this).toggleClass('active').siblings().removeClass('active');
        if (parent) {
            $(this).parents(parent).find('i').html($(this).html());
            $(opt).hide();
        } else {
            $(this).parent().prev().html($(this).html());
        }
        $('input[name=tableLocation]').val($(this).html())
    })
    $(document).not(obj).on('click', function(e) {
        e.stopPropagation();
        $(opt).hide();
    })
}

//tab select
function tabSelect(obj, parent, opt) {
    $('.tab-box').delegate(obj, 'click', function(e) {
        e.stopPropagation();
        $(this).find(opt).eq(0).toggle();
        $(this).parents(parent).siblings().find(opt).hide();
    })
    $('.tab-box').delegate(opt + ' li', 'mouseover', function(e) {
        e.stopPropagation();
        if ($(this).parents(opt).next()) {
            $(this).parents(opt).next().show();
        }
    });
    var init = 0;
    $('.tab-box').delegate(opt + ' li', 'click', function(e) {
        e.stopPropagation();
        $(this).toggleClass('active');
        if (parent == 'td.widt') {
            var that = $(this).parents(parent).find('i');
            if (!$(this).hasClass('active')) {
                that.find('.one' + $(this).index()).remove()
                if (that.text() == '') {
                    that.text('选择');
                };
            } else {
                that.append('<p class="one' + $(this).index() + '">' + $(this).text() + '</p>');
                that.html(that.html().replace('选择', ''));
            };
        } else {
            $(this).parents(parent).find('i').html($(this).html());
            $(opt).hide();
        };
    });
    $(document).not($(obj)).on('click', function(e) {
        e.stopPropagation();
        $(opt).hide();
    })
}


/* example select($('.cycle'), 'li', '.option');
 */

function selects(ele0, ele) {
    var status = 0;
    $(`.${ele0}`).on('click', function() {
        if (status == 0) {
            $(this).find('div').show();
            status = 1;
        } else {
            $(this).find('div').hide();
            status = 0;
        }
    });
    $(`.${ele} ul`).delegate('li', 'click', function(e) {
        e.stopPropagation();
        $(`.${ele}`).find('span').html($(this).html()).attr('status', $(this).attr('status'));
        $(`.${ele}>div`).hide();
        if (location.href.indexOf('task_manager') > -1) {
            getTaskDom($('.second .title').find('span').eq(1).attr('uuid'), getstatus($(this).text()));
        } else {

            var status = $('.alert>span').attr('status');
            var workdom = $('.workdom>span').text();
            var taskDetailUrl = `${monitoringUrl}/details?workspaceId=${workdom}&status=${status}`;
            gettaskDetail(taskDetailUrl);
        };
        status = 0;
    })
};

//navbar
$.fn.navcli = function() {
    this.on('click', function() {
        if ($(this).attr('class').indexOf('one') >= 0) {
            $(this).parent().find('.taskdom').toggle();
            $(this).addClass('on').parent().siblings().find('li').removeClass('on');
            $('.first .title').find('span').html($(this).text());
            $('.first').fadeIn().siblings().fadeOut();
            location.pathname.indexOf('table') >= 0 ? setBaseHtml($(this).attr('workid')) : getWorkDom();
        } else if ($(this).attr('class').indexOf('two') >= 0) {
            $(this).parent().find('.tasklist').toggle();
            $(this).addClass('on').parent().siblings().find('li').removeClass('on');
            $('.second .title').find('span').eq(0).html($(this).parents('.workdom').find('.one').text());
            $('.second .title').find('span').eq(1).html($(this).text());
            $('.second').fadeIn().siblings().fadeOut();
            location.pathname.indexOf('table') >= 0 ? setTableHtml($(this).text()) : getTaskDom();
        } else if ($(this).attr('class').indexOf('three') >= 0) {
            $(this).addClass('on').parent().siblings().find('li').removeClass('on');
            $('.third .title').find('span').eq(0).html($(this).parents('.workdom').find('.one').text());
            $('.third .title').find('span').eq(1).html($(this).parents('.taskdom').find('.two').text());
            $('.third .title').find('span').eq(2).html($(this).text());
            $('.third').fadeIn().siblings().fadeOut();
            location.pathname.indexOf('table') >= 0 ? setIntHtml($(this).text(), $(this).parents('.taskdom').find('.two').text()) : getTaskData();
        }
    });
    $('.taskdom,.tasklist').fadeOut();
};

//获取所有数据库
function setBaseHtml(id) {
    var url = `${dataUrl}/by/${id}`;
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success: function(data) {
            if (data.code == 10200) {
                if (data.data.length > 0) {
                    var str = ''
                    $.each(data.data, function(i, v) {
                        str += `<tr>
                            <td>${v.name==''?'---':v.name}</td>
                            <td>${v.description==''?'---':v.description}</td>
                        </tr>`
                    });
                    if (str.indexOf('null') >= 0) {
                        str = str.replace(/null/g, '---')
                    };
                    $('.first').find('tbody').html(str);
                } else {
                    var str = `<tr><td>---</td><td>---</td></tr>`;
                    $('.first').find('tbody').html(str);
                }
            };
        },
        error: function(res) {
            console.log(res.statusText)
        }
    })
};

//获取指定数据库中全部表信息
function setTableHtml(dataname) {
    var url = `${dataUrl}/databases/${dataname}?user=hadoop&password=default`
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success: function(data) {
            if (data.code == 10200) {
                var str = '';
                $.each(data.data, function(i, v) {
                    if (i >= 0) {
                        str += `<tr>
                            <td>${v.tableName==''?'-':v.tableName}</td>
                            <td>${v.tableRemark==''?'-':v.tableRemark}</td>
                        </tr>`
                    } else {

                        str += `<tr>
                            <td>---</td>
                            <td>---</td>
                        </tr>`
                    };
                });
                if (str.indexOf('null') >= 0) {
                    str = str.replace(/null/g, '---')
                };
                $('.second').find('tbody').html(str)
            }
        },
        error: function(res) {
            console.log(res.statusText)
        }
    })
};

function setIntHtml(tabname, dataname) {
    var url = `${dataUrl}/tables/${tabname}?user=hadoop&password=default&databaseName=${dataname}&limit=10`
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success: function(data) {
            if (data.code == 10200) {
                var str = '';
                var data = data.data;
                var arr = [];
                $.each(data.columns, function(i, v) {
                    str += `<tr>
                            <td>${v.originalColumnName==''?'-':v.originalColumnName}</td>
                            <td>${v.columnName==''?'-':v.columnName}</td>
                            <td>${v.columnRemark==''?'-':v.columnRemark}</td>
                            <td>${v.columnType==''?'-':v.columnType}</td>
                            <td>${v.isNull==false?'否':'是'}</td>
                            <td>${v.exception_handling==''?'-':v.exception_handling}</td>
                        </tr>`
                });
                if (str.indexOf('null') >= 0) {
                    str = str.replace(/null/g, '---')
                };
                $('.third .tablebox').find('tbody').html(str);
                data.samples.length > 0 ? $('.sample-tab').show().prev().show() : $('.sample-tab').hide().prev().hide()
                var strr = `<table border="1">
                                <thead>
                                    <tr>`
                for (var i in data.samples[0]) {
                    strr += `<th>${i}</th>`;
                    arr.push(i);
                };
                var strlen = arr.length;
                strr += `</tr>
                                </thead>
                                <tbody>`;
                $.each(data.samples, function(index, val) {
                    strr += `<tr>`
                    for (var k = 0; k < strlen; k++) {
                        strr += `<td>${val[arr[k]]==''?'-':val[arr[k]]}</td>`;
                    };
                    strr += `</tr>`

                });
                strr += `</tbody>
                            </table>`;
                if (strr.indexOf('null') >= 0) {
                    strr = strr.replace(/null/g, '---')
                };
                $('.sample-tab').html(strr);

            };


        },
        error: function(res) {
            console.log(res.statusText)
        }
    })
};

//获取任务空间信息
function getWorkDom(workspaceId) {
    var url = `${domUrl}/taskspaces_menu/${workspaceId}`;
    $.ajax({
        url: url,
        type: 'get',
        success: function(data) {
            if (data.code == 10200) {
                var data = data.data;
                var str = ``;
                $.each(data, function(index, val) {
                    str += ` <tr>
                                <td>${val.databaseId}</td>
                                <td>${val.name}</td>
                            </tr>`
                });
                if (str.indexOf('null') >= 0) {
                    str = str.replace(/null/g, '---')
                };
                $('.first tbody').html(str);
            }
        },
        error: function() {
            console.log('error')
        }
    })
}
//获取任务空间信息
function getTaskDom(workspaceId, status) {
    var url = `${databaseUrl}/me/backend/dbs/${workspaceId}?status=${status?status:'ALL'}`;
    $.ajax({
                url: url,
                type: 'get',
                success: function(data) {
                        if (data.code == 10200) {
                            var data = data.data;
                            if (data.length > 0) {
                                var str = ``;
                                $.each(data, function(index, val) {
                                            str += ` <tr>
                                <td>${val.jobName?val.jobName:'-'}</td>
                                <td>${val.status?val.status=='ACTIVE'?'运行':'停止':'-'}</td>
                                <td><span>${val.description?val.description:'-'}</span></td>
                                <td>
                                    <span class="check" taskId="${val.jobId}">查看</span>
                                </td>
                                <td>${val.updatedTime?val.updatedTime:'-'}</td>
                                <td>
                                    <span class="${val.status==`PAUSED`?`resume`:`stop`}" jobId="${val.jobId}">${val.status==`PAUSED`?`启动`:`停止`}</span>
                                </td>
                            </tr>`
                    });
                    if (str.indexOf('null') >= 0) {
                        str = str.replace(/null/g, '---')
                    };
                    $('.second tbody').html(str);
                    tabSelect('.selects', 'td', '.option');
                    tabSelect('.downdrop', 'td.widt', '.down');
                    /* init alert*/
                    alertFn('stop', '确定停止任务吗？');
                    alertFn('resume', '确定启动任务吗？');
                    // alertFn('change', '确定修改任务吗？');
                    //alertFn('delete', '确定删除任务吗？');
                } else {
                    str += `<tr>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>`
                    $('.second tbody').html(str);
                }

            } else {
                str += `<tr>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>`
                $('.second tbody').html(str);
            }
        },
        error: function() {
            console.log('error')
        }
    })
};
//获取指定任务数据
function getTaskData(jobId, jobname) {
    var url = `${jobUrl}/job_info?jobId=${jobId}&jobName=${jobname}`;
    $.ajax({
        url: url,
        type: 'get',
        success: function(data) {
            if (data.code == 10200) {
                data = data.data;
                $('.third .select').find('input[type=date]').val(data.startDate.split('T')[0]);
                $('.datedom').find('span').text(`${data.period}小时/次`);
                $('.timedom').find('span').text(`${data.executeTime.split('T')[1]}`);
                $('.datalist').find('input').val(`${data.dataLocation}`);

                var str = `<table>
                                <thead>
                                    <tr>
                                        <th>原始字段名</th>
                                        <th>字段名</th>
                                        <th class="widt">备注</th>
                                        <th>字段类型</th>
                                        <th>是否为空</th>
                                        <th class="widt">校验规则及异常处理方式</th>
                                    </tr>
                                </thead>
                                <tbody>`;

                $.each(data.lists, function(ind, val) {
                    str += `<tr>`;
                    str += `<td>${val.srcField}</td>`;
                    str += `<td contenteditable>${val.field}</td>`;
                    str += `<td contenteditable class="widt">${val.comment}</td>`;
                    str += `<td>
                                <div class="selects">
                                    <i>${val.type}</i>
                                    <ul class="option">
                                        <li>INT</li>
                                        <li>DOUBLE</li>
                                        <li>STRING</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div class="selects">
                                    <i>${val.allowNull==1?'是':'否'}</i>
                                    <ul class="option">
                                        <li >是</li>
                                        <li>否</li>
                                    </ul>
                                </div>
                            </td>
                            <td class="widt">
                                <div class="downdrop">
                                    <i>${val.onException}</i>
                                    <ul class="down">
                                        <li>
                                            <em></em>字段类型异常时，停止任务
                                        </li>
                                        <li>
                                            <em></em>字段出现空值时，停止任务
                                        </li>
                                    </ul>
                                </div>
                            </td></tr>`;

                });



                str += `</tbody></table>`;
                if (str.indexOf('null') >= 0) {
                    str = str.replace(/null/g, '---')
                };
                $('.third .tab-box').html(str);
            } else {
                $('.third .select').find('input[type=date]').val('');
                $('.datedom').find('span').text(`-小时/次`);
                $('.timedom').find('span').text(`---`);
                $('.datalist').find('input').val(`---`);
                var str = `<table>
                                <thead>
                                    <tr>
                                        <th>原始字段名</th>
                                        <th>字段名</th>
                                        <th class="widt">备注</th>
                                        <th>字段类型</th>
                                        <th>是否为空</th>
                                        <th class="widt">校验规则及异常处理方式</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                str += `<tr>`;
                str += `<td>---</td>`;
                str += `<td contenteditable></td>`;
                str += `<td contenteditable class="widt"></td>`;
                str += `<td>
                                <div class="selects">
                                    <i>---</i>
                                    <ul class="option">
                                        <li>INT</li>
                                        <li>DOUBLE</li>
                                        <li>STRING</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div class="selects">
                                    <i>否</i>
                                    <ul class="option">
                                        <li >是</li>
                                        <li>否</li>
                                    </ul>
                                </div>
                            </td>
                            <td class="widt">
                                <div class="downdrop">
                                    <i>选择</i>
                                    <ul class="down">
                                        <li>
                                            <em></em>字段类型异常时，停止任务
                                        </li>
                                        <li>
                                            <em></em>字段出现空值时，停止任务
                                        </li>
                                    </ul>
                                </div>
                            </td></tr>`;
                str += `</tbody></table>`;
                if (str.indexOf('null') >= 0) {
                    str = str.replace(/null/g, '---')
                };
                $('.third .tab-box').html(str);
            }
        },
        error: function() {
            console.log('error')
        }
    })
};

//获取任务执行详情
function gettaskDetail(taskDetailUrl) {
    $.ajax({
                url: taskDetailUrl,
                type: 'get',
                success: function(data) {
                        if (data.code == 10200) {
                            var data = data.data;
                            var str = ``;
                            $.each(data, function(ind, val) {
                                        str += ` <tr>
                                    <td>${val.workspaceName}</td>
                                    <td>${val.jobName}</td>
                                    <td>${val.status}</td>
                                    <td><span class="links" log="${val.log}">链接</span></td>
                                    <td>${val.recentExecTime}</td>
                                    <td>${val.execPeriod}</td>
                                    <td>${val.status==''?'':`<span class="delalert" workspaceId="${val.workspaceId}">消除报警</span>`}</td>
                                </tr>`;

                });
                if (str.indexOf('null') >= 0) {
                    str = str.replace(/null/g, '---')
                };
                $('.tablebox tbody').html(str);
                alertFn('delalert', '确定消除报警？');
            }
        },
        error: function() {
            console.log('error');
        }
    });
};

function getstatus(val) {
    var st;
    if (val == '运行') {
        st = "ACTIVE"
    } else if (val == '停止') {
        st = 'PAUSED'
    } else if (val == '删除') {
        st = "REMOVED"
    } else if (val == '全部') {
        st = "ALL"
    };
    return st;

}
