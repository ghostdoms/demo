;
(function($) {
    

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

    $('.staging tbody').delegate('.selects ul li', 'click', function(e) {
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

    $('.staging tbody').delegate('.choose', 'click', function(e) {
        e.stopPropagation();
        $(this).find('ul').toggle();
    })

    $('.staging tbody').delegate('.choose ul li span', 'click', function(e) {
        e.stopPropagation();
        $(this).toggleClass('on').parent().siblings().find('span').removeClass('on');
        $(this).parents('ul').prev('span').html($(this).parent().text());
    });


    //getinit
    var initUrl = dataUrl + `?user=hadoop`;
    $.ajax({
        url: initUrl,
        dataType: 'json',
        type: 'get',
        success: function(response) {
            if (response.code == 10200) {
                var data = response.data;
                var str = ``;
                $.each(data, function(index, val) {
                    str += `<ul class="workdom"><li class="one" workid="${val.workspaceId}">${val.workspaceName}</li>`;
                    $.each(val.databases, function(index, val) {
                        str += `<ul class="taskdom">`;
                        str += `<li class="two">${val.databaseName}</li>`;
                        $.each(val.tables, function(index, val) {
                            str += `<ul class="tasklist">`;
                            str += `<li class="three" >${val.tableName}</li>`;
                            str += `</ul>`;
                        });
                        str += `</ul>`;
                    });
                    str += `</ul>`
                })
                $('.leftnav').html(str);
                $('.one,.two,.three').navcli();


                var len = data[0].databases.length;
                //获取第一个数据库值
                for (var i = 0; i < len; i++) {
                    $('.taskdom').eq(i).show();
                };

                $('.workdom').eq(0).find('.taskdom').eq(0).fadeIn().find('.two').addClass('on');

                var sjk = $('.workdom').find('.one').eq(0).text();
                var bn = $('.taskdom').eq(0).find('li.two').text();
                $('.second .title').find('span').eq(0).html(sjk);
                $('.second .title').find('span').eq(1).html(bn);
                $('.second').show().siblings().hide();
                setTableHtml(bn);
            };
        },
        error: function(res) {
            console.log(res.statusText)
        }
    });



})(jQuery)
