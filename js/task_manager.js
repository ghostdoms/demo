;
(function($) {
    /* init alert*/
    //alertFn('stop', '确定停止任务吗？');
   // alertFn('change', '确定修改任务吗？');
   // alertFn('delete', '确定删除任务吗？');

    logFn('check');

    selects('select', 'timedom');
    selects('select', 'datedom');
    selects('select', 'statusdom');


    var init = 0;
    $('.selects').on('click', function(e) {
        e.stopPropagation();
        if (init == 0) {
            $(this).find('ul').show();
            init = 1;
        } else {
            $(this).find('ul').hide();
            init = 0;       
        }
    });

    $('.selects ul').find('li').on('click', function(e) {
        e.stopPropagation();
        $(this).parent().prev().html($(this).html());
        $(this).parent().hide();
        init = 0;
    });

    $(document).not($('.selects'), $('.choose')).on('click', function() {
        $('.selects').find('ul').hide();
        $('.choose').find('ul').hide();
        init = 0;
    })

    $('.choose').on('click', function(e) {
        e.stopPropagation();
        $(this).find('ul').toggle();
    })

    $('.choose ul').find('li span').on('click', function(e) {
        e.stopPropagation();
        $(this).toggleClass('on').parent().siblings().find('span').removeClass('on');
        $(this).parents('ul').prev('span').html($(this).parent().text());
    });
    var url = `${domUrl}/workspaces_menu`;
    $.ajax({
        url: url,
        type: 'get',
        success: function(data) {
            if (data.code == 10200) {
                var data = data.data;
                var str = ``;
                $.each(data, function(ind, val) {
                    str += `<ul class="workdom">`;
                    str += `<li class="one" wid="${val.workspaceId}">${val.name}</li>`;
                    str += `</ul>`;
                });

                $('.first .title').find('span').html(data[0].name);
                getWorkDom(data[0].workspaceId);
            };
            //$('.one').navcli();
            $('.leftnav').delegate('.one', 'click', function() {
                var that = $(this);
                var url = `${domUrl}/taskspaces_menu/${$(this).attr('wid')}`;
                $(this).parent().find('.taskdom').toggle();
                $(this).addClass('on').parent().siblings().find('li').removeClass('on');
                $('.first .title').find('span').html($(this).text());
                $('.first').fadeIn().siblings().fadeOut();
                location.pathname.indexOf('table') >= 0 ? setBaseHtml($(this).attr('workid')) : getWorkDom($(this).attr('wid'));
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data) {
                        if (data.code == 10200) {
                            if (data.data.length > 0) {
                                var str = `<ul class="taskdom">`;
                                $.each(data.data, function(ind, val) {
                                    str += `<li class="two" did="${val.databaseId}">${val.name}</li>`
                                });
                                str += `</ul>`;
                                if (that.parent().find('.taskdom').length == 0) {
                                    that.parent().append(str);
                                }
                                //$('.two').navcli();
                                $('.leftnav').delegate('.two', 'click', function() {
                                    var _self = $(this);
                                    var urls = `${domUrl}/jobs_menu/${$(this).attr('did')}`;
                                    $(this).parent().find('.tasklist').toggle();
                                    $(this).addClass('on').parent().siblings().find('li').removeClass('on');
                                    $('.second .title').find('span').eq(0).html($(this).parents('.workdom').find('.one').text());
                                    $('.second .title').find('span').eq(1).html($(this).text()).attr('uuid',$(this).attr('did'));
                                    $('.second').fadeIn().siblings().fadeOut();
                                    location.pathname.indexOf('table') >= 0 ? setTableHtml($(this).text()) : getTaskDom($(this).attr('did'));
                                    $.ajax({
                                        url: urls,
                                        type: 'get',
                                        success: function(res) {
                                            if (res.code == 10200) {
                                                if (res.data.length > 0) {
                                                    var strr = `<ul class="tasklist">`;
                                                    $.each(res.data, function(ind, val) {
                                                        strr += `<li class="three" jid="${val.job_id}">${val.job_name}</li>`
                                                    });
                                                    strr += `</ul>`;
                                                    if (_self.parent().find('.tasklist').length == 0) {
                                                        _self.parent().append(strr);
                                                    };
                                                    $('.leftnav').delegate('.three', 'click', function() {
                                                        $(this).addClass('on').siblings().removeClass('on');
                                                        $('.third .title').find('span').eq(0).html($(this).parents('.workdom').find('.one').text());
                                                        $('.third .title').find('span').eq(1).html($(this).parents('.taskdom').find('.two').text());
                                                        $('.third .title').find('span').eq(2).html($(this).text());
                                                        $('.third').fadeIn().siblings().fadeOut();
                                                        location.pathname.indexOf('table') >= 0 ? setIntHtml($(this).text(), $(this).parents('.taskdom').find('.two').text()) : getTaskData($(this).attr('jid'),$(this).text());
                                                    })
                                                }
                                            }
                                        },
                                        error: function() {
                                            console.log('error')
                                        }
                                    })
                                })
                            }
                        }
                    },
                    error: function() {
                        console.log('error')
                    }
                })
            })
            $('.leftnav').html(str);
        },
        error: function() {
            console.log('error')
        }
    });
})(jQuery)
