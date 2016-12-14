(function($) {
    $('.mark,.mark-set').css('top', $('header').height() + $('.one-title').height() + 'px');

    $('.iscancel').on('click', function(e) {
        e.stopPropagation();
    });
    $('.mark').not('.iscancel').on('click', function() {
        $('.mark').hide();
    });
    if (location.href.indexOf('create-hive') < 0) {
        if (localStorage.getItem('local_data')) {
            var newdata = JSON.parse(localStorage.getItem('local_data'));
            $('input[name=jobName]').val(newdata.jobName);
            $('input[name=jobComment]').val(newdata.jobComment);
            $('.parentss i').text(newdata.databaseName);
            $('.parentss i').attr('workspaceid', newdata.workspaceid);
            localStorage.removeItem('local_data');
        };
        if (localStorage.getItem('hivename')) {
            $('.parents i').text(localStorage.getItem('hivename'));
            localStorage.removeItem('hivename');
        };
    }

    /*select*/
    //select($('.select-option'), '.parents', '.option');
    select($('.cycle'), 'li', '.option');
    select($('.select'), 'td', '.option');
    tabSelect('.select', 'td', '.option');
    tabSelect('.downdrop', 'td.widt', '.down');
    var init = 0;
    var inits = 0;
    var initss = 0;
    $('.parents .select').on('click', function(e) {
        initss++;
        e.stopPropagation();
        setTimeout(function() {
            initss = 0;
        }, 10000)
        if (initss <= 1) {
            location.pathname.indexOf('create-hive') < 0 ? create() : hive();
        }
        // location.pathname.indexOf('create-hive') < 0 ? create() : hive();

        function create() {
            hive();
        };

        function hive() {
            var url = `${dataUrl}?user=hadoop`;
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    if (res.code == 10200) {
                        var data = res.data;
                        var str = `<i>选择</i><ul class="option option-first">`;
                        var strr = `<ul class="option option-secend" style="display:none;">`;
                        var strrr = `<ul class="option option-third" style="display:none;">`;
                        $.each(data, function(index, val) {
                            str += `<li workspaceId="${val.workspaceId}">${val.workspaceName}</li>`;

                            $.each(val.databases, function(ind, val) {
                                var databaseName = val.databaseName;
                                strr += `<li class="${val.workspaceId}">${val.databaseName}</li>`;
                                $.each(val.tables, function(ind, val) {
                                    strrr += `<li class="${databaseName}">${val.tableName}</li>`;
                                })
                            })
                        });
                        str += `</ul>`;
                        strr += `</ul>`;
                        strrr += `</ul>`;
                        strr += strrr;
                        str += strr;
                        $('.parents .select').html(str);
                        if (init == 0) {
                            $('.parents .select').find('.option').eq(0).show();
                            $('.parents .select').delegate('.option-first li', 'mouseenter', function(e) {
                                e.stopPropagation();
                                $('.' + $(this).attr('workspaceid')).show().siblings().hide()
                                $('.' + $(this).attr('workspaceid')).parent().show();
                            })
                            if (location.href.indexOf('create-hive') >= 0) {
                                $('.parents .select').delegate('.option-secend li', 'click', function(e) {
                                    e.stopPropagation();
                                    $('.parents .select>i').text($(this).text());
                                    $('.parents .option').hide();
                                    init = 0;
                                });
                            } else {
                                $('.parents .select').delegate('.option-secend li', 'mouseenter', function(e) {
                                    e.stopPropagation();
                                    $(this).parent().next().show()
                                    init = 0;
                                });

                                $('.parents .select').delegate('.option-third li', 'click', function(e) {
                                    e.stopPropagation();
                                    $('.parents .select>i').text($(this).text());
                                    $('.parents .option').hide();
                                    init = 0;
                                });
                            }

                            init = 1;
                        } else {
                            $('.parents .select').find('.option').eq(0).hide();
                            init = 0;
                        };

                    }
                },
                error: function() {
                    console.log('error')
                }
            })
        }


    });

    $('.parentss .select').stop().on('click', function(e) {
        e.stopPropagation();
        var url = `${domUrl}/workspaces_menu`;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(res) {
                if (res.code == 10200) {
                    var data = res.data;
                    var str = `<i>选择</i><ul class="option">`;
                    $.each(data, function(index, val) {
                        str += `<li workspaceId="${val.workspaceId}">${val.name}</li>`;
                    });
                    str += `</ul>`;
                    $('.parentss .select').html(str);

                    if (inits == 0) {
                        $('.parentss .select').find('.option').eq(0).show();
                        $('.parentss .select').delegate('li', 'mouseenter', function(e) {
                            e.stopPropagation();
                            var url = `${domUrl}/taskspaces_menu/${$(this).attr('workspaceid')}`;
                            var workspaceid = $(this).attr('workspaceid');
                            $.ajax({
                                url: url,
                                type: 'get',
                                success: function(data) {
                                    var res = `<ul class="option option-secend">`;
                                    $.each(data.data, function(ind, val) {
                                        res += `<li databaseId="${val.databaseId}" workspaceid="${workspaceid}">${val.name}</li>`
                                    });
                                    res += `</ul>`;
                                    if ($('.parentss .option-secend').length <= 0) {
                                        $('.parentss .select').append(res);
                                        $('.parentss .option-secend').show();
                                    };
                                    $('.parentss .select').delegate('.option-secend li', 'click', function(e) {
                                        e.stopPropagation();
                                        $('.parentss .select>i').text($(this).text()).attr({
                                            'databaseId': $(this).attr('databaseId'),
                                            'workspaceid': $(this).attr('workspaceid')
                                        });
                                        $('.parentss .option').hide();
                                        init = 0;
                                    });
                                },
                                error: function() {
                                    console.log('error');
                                }
                            })
                        })
                        inits = 1
                    } else {
                        $('.parentss .select').find('.option').eq(0).hide();
                        inits = 0;
                    }
                }
            },
            error: function() {
                console.log('error')
            }
        })

    });
    //文件下一步
    $('.file-box').find('input').on('change', function() {
            $(this).parent().prev().html($(this).val());
            $(this).nextAll('div').show();
        })
        //表单提交
    $('.create-hive').on('submit', function() {
        var data = {
            'user': 'hadoop',
            'password': 'default',
            'databaseName': $('.parents .select>i').text(),
            'tableName': $('input[name=tableName]').val(),
            'tableRemark': $('input[name=tableComment]').val(),
            'columns': queding($('.tab-box tbody').find('tr').length, $('.tab-box').find('th').length)
        };
        data = JSON.stringify(data);
        var url = dataUrl + '/tables';

        //判断是否上传文件
        if ($('input[type="file"]').eq(0).val() == '' && $('input[type="file"]').eq(1).val() == '') {
            $('.warning').show();
            setTimeout(function() {
                $('.warning').hide();
            }, 2000);
        } else {
            $('.mark').show();
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: false
                },
                beforeSend: function(request) {
                    request.setRequestHeader('Accept', 'application/json;charset=utf-8');
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                },
                data: data || {},
                success: function(data) {
                    if (data.code == 10200) {
                        $('.warning').html('上传成功').addClass('success').show();
                        if (localStorage.getItem('local_data')) {
                            localStorage.setItem('hivename', $('input[name=tableName]').val());
                            location.href = "create.html";
                        } else {
                            location.href = "table.html";
                        };
                        setTimeout(function() {
                            $('.warning').removeClass('success').hide();
                        }, 2000);
                    } else if (data.code == 70103) {
                        $('.warning').html(data.msg).show();
                        setTimeout(function() {
                            $('.warning').hide();
                        }, 2000);
                    } else {
                        $('.warning').html(data.message).show();
                        setTimeout(function() {
                            $('.warning').hide();
                        }, 2000);
                    }

                },
                error: function(res) {
                    console.log(res.statusText)
                }
            });
            //$('.iscancel .true').attr({ 'status': 'submit', 'path': url, 'data': data });
        };

        return false;
    })
})(jQuery);
//sample 的上传
function handle(files) {
    $('.file-box').eq(0).hide();
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var res = this.result.split('\n');
            var reslen = res[res.length - 1] == '' ? res.length - 1 : res.length
            var arr = [];
            for (var i = 0; i < reslen; i++) {
                var data = res[i].split('\t').length > 1 ? res[i].split('\t') : res[i].split(',');
                var spli = res[i].split('\t').length > 1 ? '\t' : ',';
                arr.push(data);
            };
            var len = arr.length > 40 ? 40 : arr.length;
            // 规则分割函数
            function getreg(fh) {
                var newstr = ``;
                for (var i = 0; i < len; i++) {
                    newstr += `<em>`
                    for (var j = 0; j < arr[i].length; j++) {
                        newstr += arr[i][j] + fh;
                    };
                    newstr += '&nbsp;</em>'
                };
                var reg = '/' + fh + '&nbsp;/g';
                var num;
                if (fh == '\t') {
                    num = 0;
                } else if (fh == ';') {
                    num = 1;
                } else if (fh == ',') {
                    num = 2;
                } else if (fh == ' ') {
                    num = 3;
                };
                $('.f-r em').eq(num).addClass('active').siblings().removeClass('active');
                var newstr = newstr.replace(eval(reg), '');
                var thirdstr = newstr.replace(/em/g, 'kbd');
                $('.third .f-r.preview').html(thirdstr);
                return newstr;
            };
            /*preview*/
            $('.secend').find('em').on('click', function() {
                var ind = $(this).index();
                if (ind == 0) {
                    $('.secend .f-r.preview').html(getreg('\t'));
                } else if (ind == 1) {
                    $('.secend .f-r.preview').html(getreg(';'));
                } else if (ind == 2) {
                    $('.secend .f-r.preview').html(getreg(','));
                } else if (ind == 3) {
                    $('.secend .f-r.preview').html(getreg(' '));
                };
            });
            /*Sample 数据渲染*/
            $('.set').on('click', function() {
                $('.secend .f-r.preview').html(getreg(spli));
                $('.mark-set').show();
                $('.mark-set .secend').show().next().hide();
                $('.mark-set .secend').find('.false').on('click', function() {
                    $(this).parents('.mark-set').hide();
                });
                $('.mark-set .secend').find('.next').on('click', function() {
                    $(this).parents('.secend').hide().next().show();
                    $('.third .false').on('click', function() {
                        $(this).parents('.mark-set').hide();
                    });
                    $('.third .prev').on('click', function() {
                        $(this).parents('.third').hide().prev().show();
                    });
                    $('.third .next').on('click', function() {
                        $(this).parents('.mark-set').hide();
                        $('.set').html('完成解析规则设置').addClass('on');
                        var str = `<table>
                                <thead>
                                    <tr>
                                        <th>样例数据</th>
                                        <th>原始字段名</th>
                                        <th>新字段</th>
                                        <th class="widt">备注</th>
                                        <th>字段类型</th>
                                        <th>是否为空</th>
                                        <th class="widt">校验规则及异常处理方式</th>
                                    </tr>
                                </thead>
                                <tbody>`;

                        var result = '';
                        var nulllen = arr.length;
                        var resultlen = arr[0].length;
                        var count = 0;
                        var count2 = 0;

                        var oldArr = [];
                        for (var z = 0; z < nulllen; z++) {
                            var s = 0;
                            for (var a = 0; a < resultlen; a++) {
                                if (arr[z][a] == '')
                                    s++;
                                //s=0;
                            };
                            oldArr[z] = s;
                        };



                        Array.prototype.min = function() {
                            var min = this[0];
                            var len = this.length;
                            var ind = this[0];
                            for (var i = 1; i < len; i++) {
                                if (this[i] < min) {
                                    min = this[i];
                                    ind = i;
                                }
                            }
                            return ind;
                        };
                        for (let j = 0; j < resultlen; j++) {
                            if (getType(arr[0][j]) !== getType(arr[1][j])) {
                                count++;
                            };
                            if (arr[0][j] == '') {
                                count2++;
                            }
                        };

                        for (let i = 0; i < resultlen; i++) {
                            str += `<tr>`
                            str += `<td>${count>0?arr[oldArr.min()][i]:arr[0][i]}</td>`
                            str += `
                            <td>${count2>0?arr[oldArr.min()][i]:count>0?arr[0][i]:'---'}</td>
                            <td contenteditable></td>
                            <td contenteditable class="widt"></td>
                            <td>
                                <div class="select">
                                    <i>${count>0?getType(arr[oldArr.min()][i]):getType(arr[0][i])}</i>
                                    <ul class="option">
                                        <li>INT</li>
                                        <li>DOUBLE</li>
                                        <li>STRING</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div class="select">
                                    <i>${count>0?arr[oldArr.min()][i]==''?'是':'否':arr[0][i]==''?'是':'否'}</i>
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
                                            <em></em>ABORT_AND_DISCARD_DATA
                                        </li>
                                        <li>
                                            <em></em>ABORT_AND_KEEP_DATA
                                        </li>
                                        <li>
                                            <em></em>IGNORE
                                        </li>
                                    </ul>
                                </div>
                            </td></tr>`
                        };
                        str += `</tbody></table>`
                        $('.tab-box').html(str);
                        //$('.tab').show();

                    });
                });
                $('.mark-set .close').on('click', function() {
                    $(this).parents('.mark-set').hide();
                });
            });

        }
        reader.readAsText(file);
    };
};

$('.settab').on('click', function() {
    if ($('.tab').find('table tr').length > 0) {
        $('.tab').show();
        $('.btn-box').show();
    }

});
//meta 上传函数
function handleFiles(files) {
    $('.file-box').eq(1).hide();
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var res = this.result.split('\n');
            var arr = [];
            for (var i = 0; i < res.length - 1; i++) {
                var data = res[i].split('\t');
                arr.push(data);
            };
            //meta的数据渲染
            var str = `<table>
                                <thead>
                                    <tr>
                                        <th>原始字段名</th>
                                        <th>新字段</th>
                                        <th class="widt">备注</th>
                                        <th>字段类型</th>
                                        <th>是否为空</th>
                                        <th class="widt">校验规则及异常处理方式</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            for (var i = 0; i < arr.length - 1; i++) {
                str += `<tr>`;
                str += `<td>${arr[i][0]}</td>`;
                str += `<td contenteditable>${arr[i][0]}</td>`;
                str += `<td contenteditable class="widt">${arr[i][3]}</td>`;
                str += `<td>
                                <div class="select">
                                    <i>${getType(arr[i][0])}</i>
                                    <ul class="option">
                                        <li>INT</li>
                                        <li>DOUBLE</li>
                                        <li>STRING</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <div class="select">
                                    <i>${arr[i][2].toUpperCase()=='YES'?'是':'否'}</i>
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
                                            <em></em>ABORT_AND_DISCARD_DATA
                                        </li>
                                        <li>
                                            <em></em>ABORT_AND_KEEP_DATA
                                        </li>
                                        <li>
                                            <em></em>IGNORE
                                        </li>
                                    </ul>
                                </div>
                            </td></tr>`;

            };
            str += `</tbody></table>`
            $('.tab-box').html(str);

        };
        reader.readAsText(file);
    }
};
//数据表格遍历
function queding(len, strlen) {
    var str = '{"columns":[';
    var ss = ['originalColumnName', 'columnName', 'columnRemark', 'columnType', 'isNull', 'exception_handling'];
    if (strlen == 6) {
        for (let i = 0; i < len; i++) {
            str += '{';
            for (let j = 0; j < $('.tab-box tbody').find('tr').eq(i).find('td').length; j++) {
                if (j > 2) {
                    str += '"' + ss[j] + '":"' + $('.tab-box tbody').find('tr').eq(i).find('td').eq(j).find('i').text().replace(/(^\s*)|(\s*$)/g, '') + '",'
                } else {
                    str += '"' + ss[j] + '":"' + $('.tab-box tbody').find('tr').eq(i).find('td').eq(j).text().replace(/(^\s*)|(\s*$)/g, '') + '",';
                }
            };
            str += '} ,'
        };
    } else {
        for (let i = 0; i < len; i++) {
            str += '{';
            for (let j = 0; j < $('.tab-box tbody').find('tr').eq(i).find('td').length - 1; j++) {
                if (j > 2) {
                    str += '"' + ss[j] + '":"' + $('.tab-box tbody').find('tr').eq(i).find('td').eq(j + 1).find('i').text().replace(/(^\s*)|(\s*$)/g, '') + '",'
                } else {
                    str += '"' + ss[j] + '":"' + $('.tab-box tbody').find('tr').eq(i).find('td').eq(j + 1).text().replace(/(^\s*)|(\s*$)/g, '') + '",';
                }
            };
            str += '} ,'
        };
    };
    str += ']}';
    var newstr = str.replace(/,}/g, "}").replace(/,]/, "]").replace(/\t|\n |\r/g, "").replace(/是/g, true).replace(/否/g, false);
    return newstr;
};
//获取数据类型
function getType(result) {
    var type = '';
    var datas = result.replace(/\./g, '');
    var regg = /^\d+$/;
    if (result == '') {
        type = "ERROR"
    } else {
        if (!regg.test(datas)) {
            type = "STRING";
        } else {
            if (!isNaN(result)) {
                if (result.indexOf('.') >= 0) {
                    type = "DOUBLE";
                } else {
                    type = "INT";
                };
            } else {
                type = "ERROR"
            };
        };
    };
    return type;
};

$('.totab').on('click', function() {
    var local_data = {
        'jobName': $('input[name=jobName]').val(),
        'jobComment': $('input[name=jobComment]').val(),
        'databaseName': $('.parentss i').text(),
        'workspaceid': $('.parentss i').attr('workspaceid')
    };
    var str_loacl_data = JSON.stringify(local_data);
    localStorage.setItem('local_data', str_loacl_data);
    location.href = 'create-hive.html';
});
$('.new-task').on('submit', function() {
    var url = jobUrl;
    var data = {
        'jobName': $('input[name=jobName]').val(),
        'jobComment': $('input[name=jobComment]').val(),
        'workspaceId': $('.parentss i').attr('workspaceid'),
        'databaseName': $('.parentss i').text(),
        'tableName': $('.parents i').text(),
        'dataLocation': $('input[name=dataLocation]').val(),
        'startDate': $('input[name=taskStartDate]').val().replace(/-/g, '/'),
        'period': parseInt($('.taskPeriod').text()),
        'execTime': $('.taskExecTime').text()
    };
    $.ajax({
        url: url,
        type: 'post',
        data: data || {},
        success: function(data) {
            if (data.code == 10200) {
                $('.warning').html('创建成功').addClass('success').show();
                setTimeout(function() {
                    $('.warning').removeClass('success').hide();
                    location.href = "task_manager.html";
                }, 2000);
            } else {
                console.log('ERROR');
            }
        },
        error: function() {
            console.log('error')
        }
    })
    return false;
})
