var pageIndex = 0, //当前页面索引
musicUrl = $('body').attr('music-url') || '', firstPage = $('.page').eq(pageIndex).children('div').eq(0), cdnUrl = "http://1251027630.cdn.myqcloud.com/1251027630/zhichi_frontend", bg_music, soundeffect = {}, //背景音乐、音效
intId, slider_arr = {}, category_id = 0, flipPageConstant;
//判断是否
var agent = navigator.userAgent.toLowerCase()
  , useragent = navigator.userAgent
  , isApple = false
  , //是否在iPhone
isWeiXin = false
  , //是否在微信
isYunzhijia = false;
//是否在云之家
if (agent.indexOf('iphone') != -1 || agent.indexOf('ipad') != -1) {
    isApple = true;
}
if (useragent.match(/MicroMessenger/i) == 'MicroMessenger') {
    isWeiXin = true;
}
if (useragent.match(/Qing\/.*;(iPhone|Android).*/)) {
    isYunzhijia = true;
}
$(function() {
    var isAudio = true
      , section_len = $('.page').length
      , commondata = $('body').attr('data') || '{}';
    intId = GetQueryString('id');
    category_id = $("body").attr('category_id');
    if (isWeiXin) {
        // 配置微信
        asyLoadScript(cdnUrl + '/static/invitation/js/jweixin-1.0.0.js', 'js', function() {
            configWxSDK();
            setShare();
        });
    } else if (isYunzhijia && window.location == parent.window.location) {
        //云之家
        asyLoadScript('http://do.yunzhijia.com/pub/js/qingjs.js', 'js', function() {
            asyLoadScript(cdnUrl + '/static/weiye/js/yunzhijia.js', 'js', function() {
                configYzjTitle(document.title);
                configInEditOptMenu([{
                    'text': "分享到云之家",
                    'callBackId': 'shareyzj'
                }], ['share'], function(id) {
                    if (id == 'shareyzj') {
                        configYzjShare({
                            title: share_title,
                            desc: share_desc,
                            link: share_link,
                            imgUrl: share_img,
                            success: function() {
                                $.ajax({
                                    url: '/index.php?r=Share/share',
                                    type: 'post',
                                    data: {
                                        share_url: share_link
                                    },
                                    dataType: 'json'
                                });
                            }
                        });
                    }
                });
            });
        });
    }
    // 打开flip中的某一个弹出页
    var intpageArr = [];
    bg_music = document.getElementById("bg_music");
    var $page = $('.page');
    if (window.location.hash) {
        pageIndex = +window.location.hash.slice(1);
        if (isNaN(pageIndex) || pageIndex >= $page.length) {
            pageIndex = 0;
            window.location.hash = 0;
        }
        firstPage = $page.eq(pageIndex).children('div').eq(0);
        $page.eq(pageIndex).addClass('current-page');
    } else {
        $page.eq(0).addClass('current-page');
    }
    if (commondata) {
        commondata = $.parseJSON(commondata) || {};
    }
    //初始化分享数据
    var share_img = commondata['share-img'] ? commondata['share-img'] : ($('.page').eq(0).attr('share-img') || cdnUrl + '/static/pc/invitation/images/share_feng.jpg')
      , share_title = $("#head-title").text()
      , share_desc = unescape(commondata['share-desc']) || $('.page').eq(0).attr('share-desc') || ''
      , share_link = $('.flip').attr('url');
    var act_id = (commondata.activity && commondata.activity.id) ? commondata.activity.id : (GetQueryString('actId') || '');
    // 兼容前面版本分享图片
    if (share_img.substr(0, 1) == '/') {
        share_img = 'http://www.zhichiwangluo.com' + share_img;
    }
    var data = {}
      , aside_case = commondata.aside_case || 1
      , aside_show = +$('body').attr('aside_show');
    //侧边栏显示方式 aside_show 0: 尾页显示，1: 首尾显示，2: 一直显示，3: 不显示
    if (aside_case == 0) {
        $('.aside-example').css('display', 'none');
    }
    $('body').attr('cre_ut', commondata.cre_user_token);
    $("#int-page").height(window.innerHeight);
    //底部标签判断
    if ($('body').attr('clean-link') == 0) {
        var combine_logo = $('body').attr('combine-logo');
        if (combine_logo) {
            $("#tip-off").css("bottom", '5%');
            combine_logo = JSON.parse(combine_logo);
            $('<div class="mobile-combine-bottom-logo" style="background:' + combine_logo.bgColor + '"><a class="mobile-combine-bottom-logo-name" href=' + combine_logo.link + '>' + combine_logo.name + '</a><span>|</span><label class="mobile-combine-bottom-logo-weiye">&rarr; 微页技术支持 &larr;</label></div>').appendTo($('.flip')).on('click', '.mobile-combine-bottom-logo-weiye', function(event) {
                event.preventDefault();
                click_focus();
            });
        } else {
            $('<a class="last_bottom" href="javascript:;">点击免费制作→<span>微页</span></a>').appendTo($('.flip')).on('click', function() {
                event.preventDefault();
                click_focus();
            });
        }
    }
    //最美青春比赛
    if (category_id == 13 || category_id == 14) {
        $("#invitation-container").find('.last_bottom').remove();
        $("#invitation-container").find('.mobile-combine-bottom-logo').remove();
        $("#tip-off").css("bottom", '5%');
        $('<div class="mobile-combine-bottom-logo" style="background:#e73a68">' + '<a class="mobile-combine-bottom-logo-name" href="http://www.bloves.com/">BLOVES婚戒定制中心' + '</a><span>|</span><label class="mobile-combine-bottom-logo-weiye">&rarr; 微页技术支持 &larr;</label></div>').appendTo($('.flip')).on('click', '.mobile-combine-bottom-logo-weiye', function(event) {
            event.preventDefault();
            click_focus();
        });
    }
    var weizhan_ty = commondata['weizhan-ty'];
    weizhan_ty && $('body').attr('weizhan-ty', weizhan_ty);
    if (commondata.isphone == 1) {
        $("#invitation-container").find('.last_bottom').addClass('last_phone').html("");
    }
    var textillateLoad = false;
    if ($(".textanimate").length > 0) {
        asyLoadScript(cdnUrl + '/static/invitation/css/text_animate.css', 'css', function() {
            textillateLoad = true;
        });
        asyLoadScript(cdnUrl + '/static/invitation/js/textillate.js', 'js', function() {});
    }
    var svgAnimateLoad = false;
    if ($(".svg").length > 0) {
        asyLoadScript(cdnUrl + '/static/pc/invitation/js/svgAnimate.js', 'js', function() {
            svgAnimateLoad = true;
        });
    }
    if ($(".form-imgupload").length > 0) {
        $("#cropper_iframe").attr('src', '/index.php?r=Invitation/showCropper');
    }
    var videoIframe = {};
    // SVG动画
    var timing = [];
    //滑动事件
    var flipDirection = commondata['flip-direction'] || true
      , flipType = commondata['flip-type'] || 'normal'
      , flipDirection = eval(flipDirection)
      , autoTurnPage = commondata['auto-turn-page'] ? (+commondata['auto-turn-page']['is_on'] ? parseFloat(commondata['auto-turn-page']['time']) : 0) : 0;
    // 横滑图标、手势改变
    if (!flipDirection) {
        $('#next').removeClass('vertical-next').addClass('horizontal-next');
        // $('.hand').attr('src',cdnUrl+'/static/invitation/images/left.png')
        // $('.hand').removeClass('vertical-hand').addClass('horizontal-hand');
    }
    var flipPage_para = {
        selector: '.page',
        isVertical: flipDirection,
        type: flipType,
        currentPage: pageIndex,
        aside_show: aside_show,
        autoTurnPage: autoTurnPage,
        isphone: commondata.isphone || 0,
        loopTurnPage: commondata['loop-turn-page'] ? commondata['loop-turn-page'] : 0,
    };
    // 参数 翻页后回调函数 翻页前回调函数
    flipPageConstant = $('.flip').flipPage(flipPage_para, afterFlipFn, beforeFlipFn);
    // 音效
    $(".has-sound-effect").each(function(index, val) {
        var soundurl = $(val).attr("musicurl");
        if (/baiduMusic\-[0-9]+/.test(soundurl)) {
            getBaiduMusicUrl(soundurl, function(su) {
                setSoundEffect(su);
            });
        } else {
            setSoundEffect(soundurl);
        }
        function setSoundEffect(surl) {
            var au = new Audio();
            au.src = surl;
            var _id = "sound" + index;
            $(val).attr("soundid", _id);
            soundeffect[_id] = au;
        }
    });
    $(document).on('click', '.has-sound-effect', function(event) {
        var _id = $(this).attr("soundid");
        if (soundeffect[_id] && soundeffect[_id].paused) {
            soundeffect[_id].play();
            bg_music.src && $('#music').addClass('toggleMusic');
            bg_music.src && bg_music.pause();
        } else {
            soundeffect[_id] && soundeffect[_id].load();
        }
    });
    //关闭Loading
    var loadTime = 3000 + startTime - (new Date()).getTime();
    if (loadTime <= 0) {
        loadTime = 500;
    }
    ;if ($('#spinner').length == 0) {
        loadTime = 500;
    }
    setTimeout(function() {
        $('#spinner').css('display', 'none').remove();
        firstPage.css('display', 'none');
        if ($('.barrage-container').length) {
            $('.barrage-container').html('');
            $.fn.danmu ? loadDanmu() : asyLoadScript(cdnUrl + '/static/pc/invitation/js/danmu.js', 'js', loadDanmu);
        } else {
            firstPageStart();
        }
        if ($('.form-imgupload').length) {
            asyLoadScript(cdnUrl + '/static/invitation/js/imgUpload.js', 'js');
        }
        loadTime = startTime = null ;
    }, loadTime);
    //开关音乐
    $('#music').on('click', function(event) {
        var _this = $(this);
        if (!_this.hasClass('phone-baiduMusic')) {
            return;
        }
        if (_this.hasClass('will-paused')) {
            _this.removeClass('will-paused');
        } else {
            _this.addClass('will-paused');
        }
    }).on('click', '.bg-icon', function(event) {
        var _music = $('#music');
        if (!_music.hasClass('will-paused') && _music.hasClass('phone-baiduMusic')) {
            return;
        }
        if (bg_music.paused) {
            _music.removeClass('toggleMusic paused');
            bg_music.play();
        } else {
            _music.addClass('toggleMusic paused');
            bg_music.pause();
            pauseAllSound();
        }
    });
    $(document).one("touchstart", function() {
        if (isAudio) {
            bg_music && bg_music.play();
        }
    });
    $(bg_music).on('play', function(event) {
        isAudio = false;
    });
    document.addEventListener("WeixinJSBridgeReady", function() {
        if (isAudio) {
            bg_music && bg_music.play();
        }
    }, false);
    function setBaiduMusic(weburl) {
        $("#baidu-a").attr("href", weburl + '&fr=weiye&zhichi_url=' + encodeURIComponent(window.location.href));
        $(document).on('touchstart mousedown', function(event) {
            var _music = $('#music')
              , _target = $(event.target);
            if (_music.hasClass('will-paused') && !_target.closest('.phone-music').length) {
                _music.removeClass('will-paused');
            }
        });
    }
    //全局功能按钮
    if ($('#aside-btn')) {
        $('#aside-btn').click(function() {
            $(this).css('display', 'none');
            $('.aside-function').addClass('aside-function-right');
        });
    }
    $('.page').click(function() {
        if ($('.aside-function').hasClass('aside-function-right')) {
            $('.aside-function').removeClass('aside-function-right');
            $('#aside-btn').css('display', 'block');
        }
    });
    // 判断是否是活动邀请函
    function setShare() {
        if (act_id) {
            var isRequestAct = commondata.activity ? commondata.activity.isRequestAct : 0;
            var current_user = ''
              , is_participant = 0
              , current_tel = ''
              , is_audit = 0
              , sign_status = 0;
            $.ajax({
                url: '/index.php?r=Activity/getDetail',
                type: 'get',
                data: {
                    id: act_id,
                },
                dataType: 'json',
                success: function(data) {
                    if (data.status == 0) {
                        is_participant = data.data.is_participant;
                        current_user = data.data.nickname || '姓名';
                        current_tel = data.data.phone || '电话';
                        share_img = share_img || data.data.cover_thumb;
                        share_title = share_title || data.data.title;
                        is_audit = data.data.is_audit;
                        sign_status = data.data.apply_status || 0;
                        if (isRequestAct != 1) {
                            $('title').text(share_title);
                            $('.act-title > div').html(share_title);
                            $('.act-time > div').html(data.data.start_time);
                            $('.act-address > div').html(data.data.address);
                            $('.act-abstract > div').html(data.data.description);
                            $('.act-cover').find('img').attr('src', data.data.cover_thumb);
                        }
                        var _input = '<input type="text"  value=' + current_user + '>';
                        $(data.data.custom_field).each(function(index, item) {
                            _input += '<input type="text"  placeholder=' + item + '>';
                        });
                        $('.act-list > div').html(_input);
                        // 活动邀请函分享数据
                        data = {
                            title: share_title,
                            desc: share_desc,
                            link: share_link,
                            imgUrl: share_img,
                            success: function() {
                                $.ajax({
                                    url: 'http://www.zhichiwangluo.com/index.php?r=Share/share',
                                    type: 'post',
                                    data: {
                                        share_url: share_link
                                    },
                                    dataType: 'json'
                                });
                            }
                        };
                        wxshare(data);
                    }
                }
            });
            //跳转到活动详情
            $('.act-detail').click(function() {
                recordPageIndex();
                window.location.href = "/index.php?r=Home/showActivityDetail&id=" + act_id;
            });
            //发送报名数据
            $('.act-submit').click(function() {
                if (is_participant == 1) {
                    if (sign_status == 0) {
                        alertTip('活动主办方正在审核你的报名');
                        return;
                    }
                    alertTip('你已经报过名了！')
                } else {
                    var custom_arr = {};
                    $('.act-list input').each(function(index, item) {
                        if ($(item).val() == '') {
                            $(item).addClass('red');
                        }
                        if ($(item).val() != '') {
                            $(item).removeClass('red');
                        }
                        if (index > 1) {
                            var inpA = $('.act-list').find('input').eq(index).attr('placeholder');
                            var inpB = $('.act-list').find('input').eq(index).val();
                            custom_arr[inpA] = inpB;
                        }
                    })
                    if ($('.red').length > 0) {
                        alertTip('请输入报名选项!');
                        return;
                    }
                    var nickname = $('.act-list input').eq(0).val();
                    var phone = $('.act-list input').eq(1).val();
                    if (nickname == undefined || phone == undefined) {
                        alertTip('请输入报名选项!');
                        return;
                    }
                    $.ajax({
                        url: '/index.php?r=Activity/ApplyJoinActivity',
                        type: 'post',
                        data: {
                            activity_id: act_id,
                            nickname: nickname,
                            phone: phone,
                            custom_field: custom_arr
                        },
                        dataType: 'json',
                        success: function(data) {
                            if (data.status === 0) {
                                alertTip('报名成功！')
                                is_participant = 1;
                                recordPageIndex();
                                window.location.href = "/index.php?r=Home/showActivityDetail&id=" + act_id;
                            } else {
                                alertTip(data.data);
                            }
                        }
                    });
                }
            })
        } else {
            // 普通邀请函分享数据
            data = {
                title: share_title,
                desc: share_desc,
                link: share_link,
                imgUrl: share_img,
                success: function() {
                    $.ajax({
                        url: 'http://www.zhichiwangluo.com/index.php?r=Share/share',
                        type: 'post',
                        data: {
                            share_url: share_link
                        },
                        dataType: 'json'
                    });
                }
            };
            if (commondata.high_share_front || commondata.high_share_behind) {
                setsShareTitle(data);
            } else {
                wxshare(data);
            }
        }
    }
    // 判断是否投票
    if ($('.cast-vote').length) {
        //已经投过票的
        if ($('title').attr('isVote') == 1) {
            $.ajax({
                url: '/index.php?r=pc/InvitationData/GetVoted',
                dataType: 'json',
                type: 'get',
                data: {
                    invitation_id: intId
                },
                success: function(data) {
                    $(data.data).each(function(index, item) {
                        var amount = item.amount;
                        var questionId = item.question_id;
                        if (item.has_set == 1) {
                            var _el = $('.cast-vote' + questionId);
                            _el.attr('isVote', '1');
                            _el.find('button').css('display', 'none');
                            _el.find('h2 > small').text('(' + amount + ')');
                            _el.find('li p:last-child').css('display', 'block');
                            _el.find('.vote-count').css('display', 'inline-block');
                            _el.find('li p:last-child > span').each(function(index, im) {
                                var voteNum = item.stat[index].num;
                                var percent = (voteNum / amount * 100).toFixed(1) + '%';
                                if (item.stat[index].is_set == 1) {
                                    $(im).parent().prev().find('b').addClass('Color');
                                }
                                $(im).css('width', percent);
                                $(im).parent().prev().find('.vote-count > small').eq(0).text(percent);
                                $(im).parent().prev().find('.vote-count > small').eq(1).text('(' + voteNum + '票)');
                            })
                        }
                    })
                }
            })
        }
        $(document).on('click', '.cast-vote li', function() {
            var checkLen = $(this).parent().find('.Color').length || 0;
            var len = $(this).parent().siblings('h2').attr('num');
            var _this = $(this);
            if (_this.closest(".cast-vote").attr('isVote') == 1) {
                return;
            }
            if (checkLen == len) {
                if (_this.find('b').hasClass('Color')) {
                    _this.find('b').toggleClass('Color');
                } else {
                    alertTip('只能选择' + len + '个');
                }
            } else {
                _this.find('b').toggleClass('Color');
            }
        }).on('click', '.cast-vote button', function() {
            var checkLen = $(this).parents('.cast-vote').find('.Color').length || '';
            var _parent = $(this).parents('.cast-vote');
            var _this = $(this);
            if (_this.closest(".cast-vote").attr('isVote') == 1) {
                return;
            }
            if (checkLen) {
                var checkIndex = [];
                var question_id = _parent.attr('questionId');
                var answer_count = $(this).siblings('ul').children('li').length;
                _parent.find('.Color').each(function(index, item) {
                    checkIndex.push($(item).parents('li').index() + 1);
                })
                $(this).css('display', 'none');
                $.ajax({
                    url: '/index.php?r=pc/InvitationData/vote',
                    data: {
                        invitation_id: intId,
                        question_id: question_id,
                        answer_list: checkIndex,
                        answer_count: answer_count
                    },
                    dataType: 'json',
                    type: 'post',
                    success: function(data) {
                        _parent.attr('isVote', '1');
                        var amount = data.data.amount;
                        _parent.find('li p:last-child').css('display', 'block');
                        _parent.find('.vote-count').css('display', 'inline-block');
                        setTimeout(function() {
                            _parent.find('li p:last-child > span').each(function(index, item) {
                                var voteNum = data.data.stat[index];
                                var percent = (voteNum / amount * 100).toFixed(1) + '%';
                                $(item).css('width', percent);
                                $(item).parent().prev().find('.vote-count > small').eq(0).text(percent);
                                $(item).parent().prev().find('.vote-count > small').eq(1).text('(' + voteNum + '票)');
                            })
                        }, 200)
                        _this.parent().find('h2 > small').text('(' + amount + ')');
                        shareVote(amount);
                    }
                })
            } else {
                alertTip('请投票！');
            }
        })
    }
    // 判断是点赞
    if ($('.cast-like').length) {
        $.each($('.cast-like'), function(index, item) {
            $(item).find('.animate-contain').css('background-image', '');
            if (!$(item).find('span').length) {
                $(item).find('.animate-contain').prepend('<span></span>');
            }
        });
        $.ajax({
            url: '/index.php?r=pc/InvitationData/GetLiked',
            dataType: 'json',
            type: 'get',
            data: {
                invitation_id: intId
            },
            success: function(data) {
                $(data.data).each(function(index, item) {
                    var count = item.count;
                    var likeId = item.like_id;
                    // var likeItem = $('.cast-like'+likeId);
                    var likeItem = $('.cast-like').filter('[likeId="' + likeId + '"]');
                    if (item.is_liked == 1) {
                        likeItem.attr('isLike', '1');
                        var _span = likeItem.find('span');
                        if (_span.hasClass('like-svg')) {
                            _span.css("color", _span.attr("data-color-af") || '#ff0000')
                        } else {
                            _span.css({
                                'background-position': '5px -27px'
                            });
                        }
                    }
                    likeItem.find('p').text(count);
                })
            }
        })
        $(document).on('click', '.cast-like', function() {
            if ($(this).attr('isLike') == 1) {
                alertTip('你已经点过!');
            } else {
                var likeId = $(this).attr('likeId');
                var _this = $(this);
                _this.attr('animateName') && _this.removeClass(_this.attr('animateName')).addClass('more_jump_single');
                setTimeout(function() {
                    _this.removeClass('more_jump_single');
                }, 1000)
                _this.attr('isLike', 1);
                $.ajax({
                    url: '/index.php?r=pc/InvitationData/like',
                    data: {
                        invitation_id: intId,
                        like_id: likeId
                    },
                    dataType: 'json',
                    type: 'post',
                    success: function(data) {
                        if (data.status == 0) {
                            _this.find('p').text(parseInt(_this.find('p').text()) + 1);
                            // _this.find('span').css('background-position','5px -27px');
                            var _span = _this.find('span');
                            if (_span.hasClass('like-svg')) {
                                _span.css("color", _span.attr("data-color-af") || '#ff0000')
                            } else {
                                _span.css('background-position', '5px -27px');
                            }
                        } else {
                            _this.attr('isLike', 0);
                        }
                    }
                })
            }
        })
    }
    // 跳链接
    var tempType = 2344;
    $("#invitation-container , #int-page").on('click', 'div[href],a', function(event, isform) {
        //链接网址、电话
        if ($(this).attr('href') && !$(this).attr('href').match(/^(javascript)|(tel:)/) && !$(this).hasClass('trigger-observer') && (!$(this).hasClass('form-submit-btn') || isform)) {
            recordPageIndex();
            if ($(this).attr("httpisblank") == "false") {
                var iframeSrc = $(this).attr('href') || '';
                if (iframeSrc) {
                    ShowNewPage('#iframe');
                    $('.iframe-container').html('');
                    var iframe = document.createElement("iframe");
                    iframe.src = iframeSrc;
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";
                    iframe.setAttribute('frameborder', 'no');
                    iframe.setAttribute('border', '0');
                    iframe.setAttribute('marginwidth', '0');
                    iframe.setAttribute('marginheight', '0');
                    $('.iframe-container').append(iframe);
                }
            } else {
                window.location.href = $(this).attr('href');
            }
        } else if ($(this).is("div") && $(this).attr('href').match(/^(tel:)/)) {
            window.location.href = $(this).attr('href');
        }
    }).on('click', '.int-game', function(event, isform) {
        //游戏
        event.preventDefault();
        if ((!isform) && $(this).hasClass('form-submit-btn')) {
            return;
        }
        if ($(this).attr("game-url")) {
            window.location.href = $(this).attr("game-url");
        }
    }).on('click', '.form-imgupload', function() {
        //表单图片上传
        $(this).find('.form-img-wrap').imgUpload();
    }).on('click', ".pop", function(event) {
        //弹窗
        var _imgurl = '';
        var type = $(this).attr("data-pop-type") ? $(this).attr("data-pop-type") : 0;
        if (type == 0) {
            _content = '<img src="' + $(this).attr("data-pop-img") + '" alt="" />';
            _class = "phone_pop_img";
        } else {
            _content = $(this).attr("data-pop-text");
            _class = "phone_pop_text";
        }
        var _html = '<section class="pop_section"><div class="' + _class + '"><div class="pop_content">' + _content + '</div></div><span class="close_pop" id="close_pop">×</span></section>';
        $("#invitation-container").after(_html);
        $("#close_pop").on('click', function(event) {
            $(this).parent().remove();
        });
    }).on('click', '.trigger-observer', function(event, isform) {
        //触发的事件绑定
        if ((!isform) && $(this).hasClass('form-submit-btn')) {
            return;
        }
        var _this = $(this), receiver_arr = _this.parent().find('.trigger-receiver'), sender_array;
        if (!_this.attr('data-trigger-arr')) {
            return;
        }
        sender_array = _this.attr('data-trigger-arr').split(',');
        for (var j = 0; j < sender_array.length; j++) {
            for (var k = 0; k < receiver_arr.length; k++) {
                var _target = $(receiver_arr[k])
                  , _receover_id = _target.attr('data-receiver-id').split(',');
                if (_receover_id.indexOf(sender_array[j]) > -1) {
                    if (!_target.hasClass('trigger-hide')) {
                        _target.addClass('trigger-hide').addClass('js-double-trigger');
                        setTimeoutTrigger(_target);
                    } else {
                        _target.removeClass('trigger-hide');
                    }
                }
            }
        }
        _this.attr('data-trigger-disappear') && _this.addClass('trigger-hide');
    }).on('click', '.cont-map', function(event) {
        //点击地图控件
        if (isWeiXin) {
            var data = {
                lat: $(this).attr('lat'),
                lng: $(this).attr('lng'),
                address: $(this).attr('address')
            }
            OpenWeixinMap(data);
        } else {
            mapModule.setPhoneMap($(this));
            $("#phone-map-wrap").show();
        }
    }).on('click', '.int-toPage', function(event, isform) {
        // 微页内部页面跳转
        var _this = $(this);
        if (_this.hasClass('form-submit-btn') && (!isform)) {
            return;
        }
        var _topage = $('.' + _this.attr('toPageIndex')).eq(0);
        if (_topage.hasClass('page')) {
            // 跳到非隐藏页
            if ($("#int-page").css('display') != 'none') {
                CloseNewPage('#int-page');
                intpageArr = [];
            }
            var index;
            if (_topage.length > 0) {
                index = $('.page').index(_topage);
            } else {
                index = Number(_this.attr('toPageIndex'));
                _topage = $('.page').eq(index);
            }
            // 跳转前初始化目标页的动画状态
            flipPageConstant.setNearbyPageAni(flipType, pageIndex, index);
            (function(tarPageIndex) {
                setTimeout(function() {
                    // 直接代码调用滑页
                    flipPageConstant.flipNext(tarPageIndex);
                    _topage.addClass('current-page').siblings('.page').removeClass('current-page');
                }, 500);
            })(index);
            pageIndex = index;
            var curPage = $('.page').index(_this.parents('.page'));
            beforeFlipFn(curPage, index);
            traverseNav(pageIndex);
        } else {
            //跳到隐藏页
            popPage(_this.attr('toPageIndex'));
        }
    }).on('click', '.int-newpage', function(event, isform) {
        //跳圈子、活动、文章
        if ((!isform) && $(this).hasClass('form-submit-btn')) {
            return;
        }
        var isNeedLoad = 0;
        //是否需要加载
        var typeMix = $(this).attr('type')
          , type = typeMix.substr(0, 2)
          , typeid = $(this).attr('typeid');
        if (type == 'ar') {
            type = "article";
            $('#self-iframe').css('overflow', 'hidden');
        } else if (/g/.test(type)) {
            type = 'group';
        } else {
            type = 'activity';
        }
        ShowNewPage('#self-iframe');
        if (tempType != typeMix) {
            $('.self-iframe').html('');
            setTimeout(function() {
                getNewPageData(type, typeid);
            }, 800)
        }
        tempType = typeMix;
    }).on('click', '.int-iframe', function() {
        //打开iframe页面 旧的 现在与跳链接合并  与跳链接的不跳出微页做相同处理
        var iframeSrc = $(this).attr('data-src') || '';
        if (iframeSrc) {
            ShowNewPage('#iframe');
            $('.iframe-container').html('');
            // var iframe = '<iframe id="iframes"  src='+iframeSrc+' width="100%" height="100%"></iframe>';
            var iframe = document.createElement("iframe");
            iframe.src = iframeSrc;
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.setAttribute('frameborder', 'no');
            iframe.setAttribute('border', '0');
            iframe.setAttribute('marginwidth', '0');
            iframe.setAttribute('marginheight', '0');
            $('.iframe-container').append(iframe);
        }
    }).on('click', '.int-page', function() {
        //弹出页 旧  现在为隐藏页
        popPage($(this).attr('data-index'));
    }).on('click', '.int-gzh', function(event, isform) {
        //快速关注公众号
        if ((!isform) && $(this).hasClass('form-submit-btn')) {
            return;
        }
        var _this = $(this);
        var obj;
        if (_this.data('gzhobj-url')) {
            obj = {
                id: _this.data('gzhobj-id') || 0,
                name: _this.data('gzhobj-name') || '我的公众号',
                url: _this.data('gzhobj-url')
            };
        } else {
            obj = _this.data('gzhobj');
        }
        oneKey(obj).Event();
    })
    function setTimeoutTrigger(target) {
        setTimeout(function() {
            target.removeClass('trigger-hide').removeClass('.js-double-trigger');
            if (target.hasClass('int-animate')) {
                ContinuousAnimate(target);
            } else if (target.hasClass('int-disappear')) {
                target.css("display", "block");
            }
        }, 100);
    }
    // 将所有被触发元素隐藏
    $('.trigger-receiver').addClass('trigger-hide');
    //地图阻止冒泡
    $(".cont-map").on('touchend mouseup', '.map-wrap', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });
    window.onhashchange = function() {
        var hash = window.location.hash;
        // 返回操作
        if (hash == '') {
            $('.nav-circle').css('display', 'none');
            $('#self-iframe').is(":visible") && CloseNewPage('#self-iframe');
            //活动
            // $('.current-element').hasClass('int-newpage') && CloseNewPage('#self-iframe');
            // $('.current-element').hasClass('int-iframe') && CloseNewPage('#iframe');
            $('#iframe').is(":visible") && CloseNewPage('#iframe');
            //链接
            // $('.current-element').attr('httpisblank') == "false" && CloseNewPage('#iframe');
            $('#int-page').is(":visible") && CloseNewPage('#int-page');
            //隐藏页
            // $('.current-element').hasClass('int-page') && CloseNewPage('#int-page');
            $('#user_promotion_container').css('display') == 'block' && (CloseNewPage('#user_promotion_container'),
            $('#user_promotion_container').removeClass('showAnimation'));
        }
    }
    // 返回操作
    $(document).on('click', ".back-to-int", function() {
        if ($(this).hasClass('int-special')) {
            intpageArr.pop();
            if (intpageArr.length == 0) {
                CloseNewPage('#int-page');
                return;
            } else {
                var _intpage = intpageArr[intpageArr.length - 1];
                var targetPage = $('.' + _intpage);
                if (targetPage.length < 1) {
                    return;
                }
                ShowNewPage('#int-page');
                // $('.int-page-container').css('background-image',targetPage[0].style.backgroundImage);
                $('.int-page-container').html(targetPage.prop("outerHTML"));
                setTimeout(function() {
                    $('.int-page-container .pageshow').css('display', 'block');
                }, 500);
            }
            return;
        } else {
            window.location.hash = '';
        }
    });
    // 微站弹出
    $('#weizhan_btn').on('click', function() {
        getNewPageData('weizhan', $('body').attr('cre_ut'));
    });
    //动画消失隐藏
    $('.int-disappear').on("webkitAnimationEnd", function() {
        $(this).hide();
    });
    $.each($('.int-disappear'), function(index, item) {
        if (($(item).hasClass('int-animate') && $(item).attr('animate-arr')) || $(item).attr('disappear-animation')) {
            return '';
        }
        $(item).on("webkitAnimationEnd", function() {
            $(item).removeClass($(item).attr('animateName')).addClass('fadeOutCenter');
        });
    });
    //当前元素
    $('.pageshow > div').on('click', function() {
        $('.current-element').removeClass('current-element');
        $(this).addClass('current-element');
    });
    $('.pageshow > div.nav a').on('click', function() {
        $('.current-element').removeClass('current-element');
        $(this).addClass('current-element');
    });
    $('.tab-fix > a').on('click', function() {
        $('.current-element').removeClass('current-element');
        $(this).addClass('current-element');
    });
    //图片轮播
    imgPlay($(".slide-new"), $('.slide'));
    //需要连续动画的元素添加类名int-animate和动画属性animate-arr="fadeInUp,fadeInDown"
    $.each($('.int-animate'), function(index, item) {
        var _div = $(item);
        if (!_div.attr('animate-arr')) {
            return '';
        }
        if (!getFirstObject(JSON.parse(_div.attr('animate-arr')))) {
            return '';
        }
        _div.removeClass('fadeOutCenter');
        // ContinuousAnimate(_div);
    });
    // tab点击后icon切换
    $('.tab-fix').on('click', 'a img', function() {
        $(this).siblings('img').attr('src') && $(this).css('display', 'none').siblings('img').css('display', 'block');
        $(this).closest('a').siblings().find('.after-tap-icon').css('display', 'none').siblings('img').css('display', 'block');
    });
    $(document).on('click', '.form .form-ul li[data-ty="checkbox"] .form-option , .form-checkbox .form-option', function(event) {
        // 表单多选选择
        var $checkboxs_li = $(this).closest('.form-ele').length ? $(this).closest('.form-ele')/*新版*/
        : $(this).parents('li[data-ty="checkbox"]')/*老版*/
        ;
        checkNumLimit = $checkboxs_li.find('small').data('num');
        $checkboxs_li.find('input[type="checkbox"]').attr('disabled', 'disabled');
        if ($checkboxs_li.find('input:checked').length === checkNumLimit) {
            $checkboxs_li.find('input:checked').removeAttr('disabled');
        } else {
            $checkboxs_li.find('input[type="checkbox"]').removeAttr('disabled');
        }
        if ($(this).children('input').prop('disabled')) {
            return;
        }
        $(this).children('.checkbox-after-select').css('display') === 'none' ? $(this).children('.checkbox-after-select').show().siblings('.checkbox-before-select').hide().siblings('input').prop('checked', true) : $(this).children('.checkbox-before-select').show().siblings('.checkbox-after-select').hide().siblings('input').prop('checked', false);
    }).on('click', '.form .form-ul li[data-ty="radio"] .form-option, .form-radio .form-option', function(event) {
        // 表单单选选择
        $(this).siblings('.form-option').children('.radio-before-select').show().siblings('.radio-after-select').hide();
        $(this).children('.radio-after-select').show().siblings('.radio-before-select').hide().siblings('input').prop('checked', true);
    });
    // 表单输入框获取焦点、失去焦点和标题点击事件
    $('.form input, .form textarea, .form-ele input, .form-ele textarea').prop('disabled', false);
    $(document).on('focus', '.form-ul li[data-ty="input"] input, .form-ul li[data-ty="input"] textarea, .form-input input, .form-input textarea', function() {
        $(this).siblings().hide();
    }).on('blur', '.form-ul li[data-ty="input"] input, .form-ul li[data-ty="input"] textarea, .form-input input, .form-input textarea', function() {
        $(this).val() || $(this).siblings().show();
    });
    $(document).on('click', '.form-ul li[data-ty="input"] h2, .form-input h2', function() {
        $(this).siblings('input, textarea').focus();
    });
    // 地图js加载
    if ($("#flip .cont-map").length > 0) {
        asyLoadScript('http://map.qq.com/api/js?v=2.exp&callback=mapModule.initMap', 'js', function() {});
    }
    $("#phone-map-wrap").on('click', '.map-close', function(event) {
        $("#phone-map-wrap").hide();
    });
    //呱呱卡 和 点击 、碎屏、滑动特效
    $.each($('.page'), function(index, item) {
        if ($(item).data('effect')) {
            var option = $(item).data('effect');
            switch (option.type.split('-')[1]) {
            case 'guagua':
                $(item).addClass('page-guagua');
                break;
            case 'background':
                $(item).addClass('page-background');
                break;
                //碎屏
            case 'brokenglass':
                $(item).addClass('page-brokenglass');
                break;
            default:
                break;
            }
        }
    });
    //刮刮卡特效
    if ($(".page-guagua").length > 0) {
        asyLoadScript(cdnUrl + '/static/invitation/js/scratch.js', 'js', function() {
            $.each($(".page-guagua"), function(index, item) {
                var option = $(item).data('effect')
                  , id = 'eraser' + index
                  , img = $('<img id="' + id + '" src="' + option.background + '" style="width: 100%;height: 100%;"/>')
                  , _div = $(item).children('div').eq(0);
                $(item).prepend(img);
                var _ind = $('.page').index($(item));
                if (_ind == 0) {
                    var data = $.extend({
                        completeFunction: function() {
                            $('#' + id).eraser('destroy');
                            _div.show();
                        },
                    }, option);
                    img[0].onload = function() {
                        setTimeout(function() {
                            img.eraser(data);
                            _div.hide();
                        }, loadTime);
                    }
                }
            });
        });
    }
    if ($(".page-background").length > 0) {
        asyLoadScript(cdnUrl + '/static/invitation/js/websnow.js', 'js', function() {
            $.each($(".page-background"), function(index, el) {
                var option = $(el).data('effect');
                $(el).websnowjq(option);
                $(el).websnowjq("stop");
            });
        });
    }
    if ($(".page-brokenglass").length > 0) {
        asyLoadScript(cdnUrl + '/static/invitation/js/broken.js', 'js', function() {
            $.each($(".page-brokenglass"), function(index, el) {
                var option = $(el).data('effect');
                option = $.extend({
                    beforeFun: function() {
                        bg_music.pause();
                        $('#music').addClass('toggleMusic paused');
                    },
                    afterFun: function() {
                        bg_music.play();
                        $('#music').removeClass('toggleMusic paused');
                    }
                }, option);
                $(el).broken(option);
            });
        });
    }
    if ($('.int-goods').length) {
        $(document).on('click', '.int-goods', function(event, isform) {
            if ((!isform) && $(this).hasClass('form-submit-btn')) {
                return;
            }
            var buyGoodsDialog = $('#buy-goods-dialog');
            if (!buyGoodsDialog.hasClass('js-initial')) {
                buyGoodsDialog.addClass('js-initial');
                initialBuyGoodsDialog();
            }
            var goods_id = $(this).attr('goods-id');
            buyGoodsDialog.attr('goods-id', goods_id);
            $ajax('/index.php?r=shop/getGoods', 'get', {
                goods_id: goods_id
            }, 'json', function(data) {
                if (data.status == 0) {
                    var info = data.data;
                    $('#goods-price').text(info.price);
                    $('#goods-price-amount').text(info.price);
                    $('#goods-stock').text(info.stock);
                    $('#goods-title').text(info.title);
                    buyGoodsDialog.addClass('dialog-show');
                } else {
                    alertTip('请求商品信息失败，请稍候再试');
                }
            }, function() {
                alertTip('请求商品信息失败，请稍候再试');
            });
        });
    }
    // if(!isApple){
    $.each($(".page .cont-video"), function(index, el) {
        $(el).find('.video-close').remove();
        $(el).append('<span class="video-close">关闭</span>');
    });
    //android手机点击视频时 放大到全屏
    $('.page .cont-video .iframe-mask').show();
    $('.cont-video').on('click', '.iframe-mask', function() {
        if (musicUrl != 'ittsharemusic' && musicUrl != '') {
            bg_music.pause();
            $('#music').hide();
        }
        $(this).closest('.cont-video').addClass('full-screen');
    }).on('click', '.video-close', function() {
        var _video = $(this).closest('.cont-video');
        var src = _video.find('iframe').attr('src');
        _video.removeClass('full-screen');
        _video.find('iframe').attr('src', src);
        if (musicUrl != 'ittsharemusic' && musicUrl != '') {
            $('#music').show();
            if (!$('#music').hasClass('paused')) {
                bg_music.play();
                $('#music').removeClass('toggleMusic');
            }
        }
    });
    // }
    //收藏
    if ($("body").attr("isCollect") == 0) {
        $(".collect-it").html('<img src="' + cdnUrl + '/static/weiye/images/collect.png" > 收藏微页');
    } else {
        $(".collect-it").html('<img src="' + cdnUrl + '/static/weiye/images/collected.png" > 已收藏');
    }
    ;$("#collect-close").click(function() {
        $(".collect-back").hide();
    })
    $(".collect-it").click(function() {
        if ($(".collect-it").text().trim() == "已收藏") {
            alertTip("已经收藏过了");
        } else {
            $(".collect-back").show();
        }
    });
    $(".type-sure").click(function() {
        var id = parseInt(GetQueryString('id'));
        var Val = parseInt($("#type_val").children('option:selected').val());
        var remarks = $("#remarks").val();
        $ajax('/index.php?r=pc/InvitationNew/AddInvCollect', 'get', {
            inv_id: id,
            cate_id: Val,
            remark: remarks
        }, 'json', function(data) {
            if (data.status == '0') {
                alertTip('收藏成功');
                $(".collect-back").hide();
                $(".collect-it").html('<img src="' + cdnUrl + '/static/weiye/images/collected.png" > 已收藏');
            } else {
                alertTip(data.data);
            }
        });
    });
    $(".type-dele").click(function() {
        var id = parseInt(GetQueryString('id'));
        if (confirm('确定删除此微页？')) {
            $ajax('/index.php?r=pc/InvitationNew/DeleteInvitation', 'post', {
                id: id
            }, 'json', function(data) {
                if (data.status == 0) {
                    alertTip('删除成功');
                    if (window.history.length != 1) {
                        window.history.back();
                    } else {
                        if (isWeiXin) {
                            window.history.back();
                            WeixinJSBridge.call('closeWindow');
                        } else {
                            window.close();
                        }
                    }
                } else {
                    alertTip(data.data);
                }
            }, function(data) {
                alertTip(data.data);
            })
        }
    })
    $(document).on('click', '.form-submit', function() {
        // 表单提交(老版: 表单作为一个整体)
        var $this = $(this), invitation_id = GetQueryString('id'), form_id = $this.parents('.form').attr('id'), necessary = $this.siblings('.form-ul').children('li.form-necessary-item'), not_necessary = $this.siblings('.form-ul').children('li').not('.form-necessary-item'), url = '/index.php?r=pc/InvitationData/addForm', data = {
            invitation_id: invitation_id,
            form_id: /^f_\d+$/g.test(form_id) ? form_id : (pageIndex + '_' + form_id),
            form_value: {}
        }, complete_info = true, form_item_val, key;
        $.each(necessary, function(index, item) {
            key = $(item).attr('id');
            form_item_val = getFormItemValue(item);
            if (form_item_val) {
                data.form_value[key] = form_item_val;
            } else {
                complete_info = false;
                return false;
            }
        });
        if (!complete_info) {
            alertTip('信息填写不完整');
            return;
        }
        $.each(not_necessary, function(index, item) {
            key = $(item).attr('id');
            form_item_val = getFormItemValue(item);
            data.form_value[key] = form_item_val;
        });
        $ajax(url, 'post', data, 'json', function(data) {
            if (data.status !== 0) {
                alertTip(data.data);
                return;
            }
            alertTip($this.attr('tip-text') || '提交成功');
        });
    }).on('click', '.form-submit-btn', function(event, isform) {
        // 表单提交(新版：表单元素各自独立)
        if (isform) {
            return;
        }
        var $this = $(this), page = $this.closest('.pageshow'), necessary = page.find('.form-necessary-item'), not_necessary = page.find('.form-ele .form-ele-content-wrap').not('.form-necessary-item'), url = '/index.php?r=pc/InvitationData/addForm', data = {
            invitation_id: GetQueryString('id'),
            form_id: $this.attr('id'),
            is_repeat: $this.attr('data-repeat') || 0,
            form_value: {}
        }, complete_info = true, form_item_val, key;
        $.each(necessary, function(index, item) {
            key = $(item).attr('data-id');
            form_item_val = getFormItemValue(item);
            if (form_item_val) {
                data.form_value[key] = form_item_val;
            } else {
                complete_info = false;
                return false;
            }
        });
        if (!complete_info) {
            alertTip('信息填写不完整');
            return;
        }
        $.each(not_necessary, function(index, item) {
            key = $(item).attr('data-id');
            form_item_val = getFormItemValue(item);
            data.form_value[key] = form_item_val;
        });
        $ajax(url, 'post', data, 'json', function(data) {
            if (data.status !== 0) {
                alertTip(data.data);
                return;
            }
            alertTip($this.attr('tip-text') || '提交成功');
            if ($this.attr("href") || $this.hasClass('int-toPage') || $this.hasClass('int-game') || $this.hasClass('trigger-observer') || $this.hasClass('int-newpage') || $this.hasClass('int-goods') || $this.hasClass('int-gzh')) {
                $this.trigger('click', true);
            }
        });
    });
    function popPage(th) {
        var targetPage = $('.' + th), $currentBarrage;
        intpageArr.push(th);
        if (targetPage.length < 1) {
            return;
        }
        ShowNewPage('#int-page');
        $("#invitation-container").hide();
        $('.int-page-container').html(targetPage.prop("outerHTML"));
        setTimeout(function() {
            var _section = $(".int-page-container").children('section');
            _intpage = _section.children('.pageshow');
            _section.addClass('page');
            _intpage.css('display', 'block');
            _section.children('.background-animate').css('display', 'block');
            showTextAnimate(_intpage.find('.textanimate'));
            showSVGAnimate(_intpage);
            playAutoPlaySound(_intpage.find('.has-sound-effect'));
            imgPlay($("#int-page .slide-new"), $('#int-page .slide'));
            _intpage.find('.int-animate').each(function(index, item) {
                var _div = $(item);
                _div.removeClass('fadeOutCenter');
                var animation = _div.attr('disappear-animation');
                animation ? _div.removeClass(animation) : '';
                ContinuousAnimate(_div);
            });
            _intpage.find('.int-disappear').each(function(index, item) {
                $(item).removeClass('fadeOutCenter').addClass($(item).attr('animateName'));
            })
            if (($currentBarrage = $('.int-page-container .barrage-container')).length) {
                $currentBarrage.each(function(i, curBar) {
                    getDanmuData($(curBar));
                });
            }
        }, 500);
    }
    function wxshare(data) {
        if (isWeiXin) {
            wx.ready(function() {
                configWxShare(data);
            });
        }
    }
    // 拼接分享数
    var shareJson;
    function setsShareTitle(sharedata) {
        var _type = commondata.high_share_type;
        if (_type) {
            switch (_type) {
            case "like":
                $.ajax({
                    url: '/index.php?r=pc/InvitationData/GetLiked',
                    dataType: 'json',
                    type: 'get',
                    data: {
                        invitation_id: intId
                    },
                    success: function(data) {
                        if (data.status == 0) {
                            // console.log(data);
                            // var _count = data.data.length > 0 ? parseInt(data.data[0].count) + 1 : 2;
                            var _count = 1;
                            if (data.data.length > 0) {
                                var _count = parseInt(data.data[0].count) + 1;
                            }
                            sharedata.title = unescape(commondata.high_share_front) + _count + unescape(commondata.high_share_behind);
                            wxshare(sharedata);
                        }
                    }
                })
                break;
            case "share":
                sharedata.title = unescape(commondata.high_share_front) + (parseInt($("body").attr("share_count")) + 1) + unescape(commondata.high_share_behind);
                wxshare(sharedata);
                break;
            case "view":
                sharedata.title = unescape(commondata.high_share_front) + (parseInt($("#preview_num").text()) + 1) + unescape(commondata.high_share_behind);
                wxshare(sharedata);
                break;
            case "vote":
                $.ajax({
                    url: '/index.php?r=pc/InvitationData/GetVoted',
                    dataType: 'json',
                    type: 'get',
                    data: {
                        invitation_id: intId
                    },
                    success: function(data) {
                        if (data.status == 0) {
                            // console.log(data);
                            // var _count = data.data.length > 0 ? parseInt(data.data[0].amount) + 1 : 2;
                            if (data.data.length > 0) {
                                var _count = parseInt(data.data[0].amount) + 1;
                                sharedata.title = unescape(commondata.high_share_front) + _count + unescape(commondata.high_share_behind);
                            }
                            wxshare(sharedata);
                        }
                    }
                })
                shareJson = sharedata;
                break;
            }
        }
    }
    function shareVote(_count) {
        if (shareJson) {
            shareJson.title = unescape(commondata.high_share_front) + _count + unescape(commondata.high_share_behind);
            wxshare(shareJson);
        }
    }
    function firstPageStart() {
        var $barrageContainer;
        // setTimeout(function(){
        // 第一页动画开启
        var _Page = firstPage.parent();
        if (_Page.children('.my_rubber_eraser').length) {
            //判断第一页是否是擦除特效
            var img = _Page.children('img').eq(0);
        } else {
            var background_animate = firstPage.siblings('.background-animate');
            background_animate.length && background_animate.css('display', 'block')
            firstPage.css('display', 'block');
            // if (section_len > 1) {
            //   $('.hand').css('display', 'block');
            // }
            // setTimeout(function(){
            //   $('.hand').css('display', 'none');
            // }, 4000);
        }
        if (musicUrl != 'ittsharemusic' && musicUrl != '') {
            $('#music').css('display', 'block');
            if (/baiduMusic\-[0-9]+/.test(musicUrl)) {
                $("#music").addClass('phone-baiduMusic');
                getBaiduMusicUrl(musicUrl, setBgMusic, true);
            } else {
                setBgMusic(musicUrl);
            }
        }
        firstPage.find('.int-animate').each(function(index, item) {
            var _div = $(item);
            if (_div.hasClass('int-animate-disappear')) {
                $(item).removeClass('fadeOutCenter').removeClass(_div.attr('disappear-animation'));
            }
            ContinuousAnimate(_div);
        });
        firstPage.find('.int-disappear').css('display', 'block');
        showTextAnimate(firstPage.find('.textanimate'));
        showSVGAnimate(firstPage);
        playAutoPlaySound(firstPage.find('.has-sound-effect'));
        //showParticleText($('.particleText'));
        if (($barrageContainer = firstPage.find('.barrage-container')).length) {
            $barrageContainer.each(function(i, curBar) {
                getDanmuData($(curBar));
            });
        }
        traverseNav(pageIndex);
        setAsideAndBottomSign(pageIndex);
        $.each(slider_arr, function(index, el) {
            slider_arr[index].stop();
        });
        imgPlayStart(firstPage.find('.slide-new'));
        if (_Page.hasClass('page-background')) {
            _Page.websnowjq('start');
        }
        // 第一页展示后初始化前后页动画
        flipPageConstant.setNearbyPageAni(flipType, pageIndex);
        // 判断是否设置自动翻页
        autoTurnPage && flipPageConstant.autoTurnPageFn();
        asyLoadScript(cdnUrl + '/static/invitation/js/svg4everybody.min.js', 'js', function() {
            svg4everybody();
        });
        // }, 200);
    }
    function setBgMusic(murl) {
        bg_music.onerror = function(event) {
            // console.log(event);
            var code = event.target.error.code;
            if (code == 4) {
                alertTip("音乐链接无效！");
            } else if (code == 2) {
                alertTip("网络不给力哦，音乐加载错误！");
            } else if (code == 3) {
                alertTip("解码错误!");
            }
        }
        bg_music.onprogress = function(event) {
            // console.log(event);
            // console.log(this.buffered);
            // console.log(this.buffered.length);
            // console.log(this.buffered.end(this.buffered.length - 1));
            var buff = this.buffered
              , bufferPercent = 0;
            if (buff.length > 0) {
                bufferPercent = parseInt(buff.end(buff.length - 1) / this.duration * 100);
            }
            console.log(bufferPercent);
            if (bufferPercent == 100) {
                bg_music.onprogress = '';
            }
            ;
        }
        bg_music.src = murl;
        bg_music.play();
        if (commondata.musicisloop == "false") {
            $(bg_music).removeAttr("loop");
        }
    }
    function pauseAllSound() {
        $.each(soundeffect, function(index, val) {
            // val.load();
            val.pause && val.pause();
            val.currentTime && (val.currentTime = 0);
        });
    }
    function playAutoPlaySound(soundDom) {
        var ishassound = false;
        if (soundDom.length > 0) {
            $.each(soundDom, function(index, val) {
                if ($(val).attr("musicautoplay") == "true") {
                    var soundid = $(val).attr("soundid");
                    soundeffect[soundid] && soundeffect[soundid].play();
                    ishassound = true;
                    isAudio = false;
                }
            });
        }
        if (ishassound && bg_music.src) {
            $('#music').addClass('toggleMusic');
            bg_music.pause();
        } else if ((!$('#music').hasClass('paused')) && (!bg_music.ended) && bg_music.src) {
            bg_music.play();
            $('#music').removeClass('toggleMusic');
        }
    }
    function removeAndStoreVideo(curPage) {
        var $this = $('.page').eq(curPage);
        if (!isApple && $this.find('.cont-video').length) {
            if (!videoIframe[curPage]) {
                videoIframe[curPage] = [];
                $this.find('.cont-video').each(function(index, video) {
                    videoIframe[curPage].push($(video).html());
                });
            }
            $this.find('.cont-video').html('');
        }
    }
    function getBaiduMusicUrl(dataid, sfn, isbg) {
        var _songid = dataid.split('-')[1];
        var url = 'http://www.zhichiwangluo.com/index.php?r=pc/BaiduMusic/GetAudition'
          , data = {
            songid: _songid,
            bit: 128
        };
        $.ajax({
            url: url,
            type: 'get',
            data: data,
            timeout: 30000,
            dataType: 'json',
            success: function(data) {
                if (data.status == 0) {
                    sfn && sfn(data.data.file_link);
                    isbg && setBaiduMusic(data.data.web_url);
                } else {
                    alertTip(data.data);
                }
            },
            error: function(xhr, errorType, error) {
                alertTip("音乐链接获取有问题，请重试！");
            }
        });
    }
    function putVideoBack(curPage) {
        var $this = $('.page').eq(curPage);
        if (!isApple && $this.find('.cont-video').length) {
            if (videoIframe[curPage]) {
                $.each(videoIframe[curPage], function(index, video) {
                    $this.find('.cont-video').eq(index).html(video);
                });
            }
        }
    }
    // 展示文字动画
    function showTextAnimate(txt) {
        if (!textillateLoad) {
            return;
        }
        txt.each(function(index, el) {
            var _animate = $(el).find(".animate-contain")
              , _text = _animate.attr("textcontent")
              , _html = '';
            $(_text).each(function(ind, item) {
                _html += $(item).html($(item).text()).prop("outerHTML");
            });
            _animate.html(_html);
            _animate.find("p").textillate({
                initialDelay: $(el).attr("textdelay"),
                in: {
                    effect: $(el).attr("textanimate"),
                    duration: $(el).attr("textduration")
                }
            })
        });
    }
    // 展示SVG动画
    function showSVGAnimate(ch) {
        if (!svgAnimateLoad) {
            return;
        }
        var _svg_dom = ch.find(".svg");
        $.each(_svg_dom, function(index, el) {
            var svgoptions = {
                type: $(el).attr('timing_type'),
                duration: $(el).attr('timing_duration'),
                delay: $(el).attr('timing_delay'),
                speed_type: $(el).attr('timing_speedtype') || $(el).attr("pathTimingFunction"),
                dasharray: ($(el).attr('timing_dasharray') ? $(el).attr('timing_dasharray') : 100) + "%," + ($(el).attr('timing_dasharray2') ? $(el).attr('timing_dasharray2') : 100) + "%",
                loop: $(el).attr('timing_loop'),
            };
            var _id = $(el).find("svg").attr("id");
            timing[_id] && timing[_id].destroy();
            timing[_id] = $("#" + _id).svgAnimation(svgoptions);
        });
    }
    // 加载弹幕内容
    function loadDanmu() {
        var $container = $('.page').eq(pageIndex).find('.barrage-container');
        if ($container.length) {
            // 当前页面如果有弹幕，加载弹幕数据后再执行第一页动画
            $.each($container, function(index, con) {
                getDanmuData($(con), firstPageStart, $container.length);
            });
        } else {
            // 当前页面没有弹幕，直接展示第一页
            firstPageStart();
        }
        $('.barrage-container').not($container).each(function() {
            getDanmuData($(this));
        });
        // 添加评论
        $(document).on('click', '.barrage-submit', function() {
            var comment = $(this).siblings('.barrage-input').val().trim()
              , bar_contain = $(this).parent().siblings('.barrage-container')
              , article_id = bar_contain.attr('data-dm-id') || bar_contain.attr('data-id');
            if (comment == '') {
                alertTip('评论不能为空');
                return;
            }
            $(this).siblings('.barrage-input').val('');
            $.ajax({
                url: '/index.php?r=ArticleBbs/DiscussDanmu',
                type: 'post',
                data: {
                    article_id: article_id,
                    inv_id: intId,
                    content: comment
                },
                dataType: 'json',
                success: function(data) {
                    if (data.status !== 0) {
                        alertTip(data.data);
                        return;
                    }
                    var data = data.data;
                    bar_contain.data('danmuInstance') && bar_contain.data('danmuInstance').add({
                        imgSrc: data.headimgurl,
                        text: data.content
                    }).start();
                }
            });
        });
    }
    // 获取弹幕评论
    function getDanmuData($container, fn, danmuCount) {
        var para;
        if ($container.data('danmuPara')) {
            //如果元素保存过弹幕数据就不再请求
            if ($container.attr('data-noanimate')) {
                //如果弹幕没有动画 则等待0.5s后加载，有动画时会在动画结束时加载
                setTimeout(function() {
                    danmuStart($container);
                }, 500);
            }
            // bindDanmuAnimateEndFn($container.closest('.barrage'));
            return;
        }
        para = {
            article_id: $container.attr('data-dm-id') || $container.attr('data-id'),
            inv_id: intId,
            page_num: 1,
            page_size: 100
        };
        $.ajax({
            url: '/index.php?r=ArticleBbs/ShowDanmuDiscussion',
            type: 'get',
            data: para,
            dataType: 'json',
            success: function(data) {
                if (data.status !== 0) {
                    alertTip(data.data);
                    $.isFunction(fn) && fn();
                    return;
                }
                var danmuArray = [], comments = data.data, transform = $container.closest('.pageshow').css('-webkit-transform'), scale, danmuPara, loadedDanmuCount;
                transform && (scale = /scale\((\S+)\)/.exec(transform));
                scale && scale[1] && (scale = Number(scale[1]));
                if ($container.length) {
                    $.each(comments, function(index, c) {
                        danmuArray.push({
                            imgSrc: c.headimgurl || cdnUrl + '/static/invitation/images/default_photo.jpg',
                            text: c.content
                        });
                    });
                    danmuPara = {
                        danmuArray: danmuArray,
                        content: '<span><img src="${imgSrc}"></span><span>${text}</span>',
                        danmuHeight: 40,
                        rowcount: $container.attr('data-count'),
                        color: $container.attr("data-style") == "barrage-text" ? 'random' : '',
                        scale: scale || 1
                    };
                    $container.data('danmuPara', danmuPara);
                    bindDanmuAnimateEndFn($container.closest('.barrage'));
                }
                loadedDanmuCount = $('.page').eq(pageIndex).attr('loadDanmu') || 0;
                $('.page').eq(pageIndex).attr('loadDanmu', ++loadedDanmuCount);
                if (loadedDanmuCount >= danmuCount) {
                    $.isFunction(fn) && fn();
                }
            },
            error: function() {
                $.isFunction(fn) && fn();
            }
        });
    }
    function bindDanmuAnimateEndFn($barrage) {
        if ($barrage.hasClass('int-animate') && $barrage.attr('animate-arr')) {
            //如果弹幕有连续动画 已经在ContinuousAnimate里处理 此处返回
            return;
        }
        if ($barrage.attr('animatename') || $barrage.hasClass('fadeInUp')) {
            //如果只有单个动画 则动画结束加载弹幕
            $barrage.off('webkitAnimationEnd').on('webkitAnimationEnd', function() {
                danmuStart($barrage.find('.barrage-container'));
            });
        } else {
            //如果弹幕没有加动画 添加标识
            $barrage.find('.barrage-container').attr('data-noanimate', 'true');
        }
    }
    function danmuStart($barrContainer) {
        var danmuInstance = $barrContainer.data('danmuInstance');
        danmuInstance && danmuInstance.destroy();
        danmuInstance = $barrContainer.danmu($barrContainer.data('danmuPara'));
        $barrContainer.data('danmuInstance', danmuInstance);
        danmuInstance.start();
    }
    function getFormItemValue(item) {
        var type = $(item).closest('.form-ele').attr('data-ty')/*新版*/
        || $(item).data('ty')/*老版*/
          , value = '';
        switch (type) {
        case 'input':
            value = $(item).find('input').length ? $(item).find('input').val() : ($(item).find('textarea').length ? $(item).find('textarea').val() : '');
            break;
        case 'radio':
            $(item).find('.form-option').each(function() {
                if ($(this).children('input').prop('checked')) {
                    value = $(this).children('label').text();
                }
            });
            break;
        case 'checkbox':
            $(item).find('.form-option').each(function() {
                if ($(this).children('input').prop('checked')) {
                    value += ((value ? ';' : '') + $(this).children('label').text());
                }
            });
            break;
        case 'select':
            $(item).find('.form-option').each(function() {
                if ($(this).prop('selected') && !$(this).hasClass('ittwrap-form-item-title')) {
                    value = $(this).text();
                }
            });
            break;
        case 'imgupload':
            value = $(item).find('img').attr('src');
            break;
        }
        return value;
    }
    function initialBuyGoodsDialog() {
        if (intId == 1396533) {
            $('#goods-address').closest('li').children(".left-text").text("QQ：");
            $("#goods-address").attr("placeholder", "请输入QQ");
        }
        $('#goods-amount').change(function(event) {
            var goodsAmount = +$(this).val().trim()
              , price = +$('#goods-price').text();
            if (!/^[0-9]*$/.test(goodsAmount)) {
                alertTip('商品数量请输入数字');
                $('#goods-amount').focus();
                return;
            } else {
                $('#goods-price-amount').text(price * goodsAmount);
            }
        });
        $('#buy-goods-dialog .zhichi-submit-btn').on('click', function(event) {
            var goodsAmount = $('#goods-amount').val().trim()
              , goodsReceiver = $('#goods-receiver').val().trim()
              , goodsAddress = $('#goods-address').val().trim()
              , goodsPhone = $('#goods-phone').val().trim();
            if (!/^[0-9]*$/.test(goodsAmount)) {
                alertTip('商品数量请输入数字');
                $('#goods-amount').focus();
                return;
            }
            if (goodsReceiver.length <= 0) {
                alertTip('请输入收件人');
                $('#goods-receiver').focus();
                return;
            }
            if (goodsAddress.length <= 0) {
                alertTip('请输入收件人地址');
                $('#goods-address').focus();
                return;
            }
            var regmTel = /^1\d{10}$/
              , regmPhone = /^0\d{2,3}-?\d{7,8}$/;
            if (!regmTel.test(goodsPhone) && !regmPhone.test(goodsPhone)) {
                alertTip('请输入正确格式的手机号或固话');
                $('#goods-phone').focus();
                return;
            }
            $ajax('/index.php?r=shop/addOrder', 'post', {
                inv_id: intId,
                goods_id: $('#buy-goods-dialog').attr('goods-id'),
                num: goodsAmount,
                name: goodsReceiver,
                address: goodsAddress,
                phone: goodsPhone
            }, 'json', function(data) {
                if (data.status == 0) {
                    window.location.href = '/index.php?r=shop/ShowOrder&id=' + data.data.order_id;
                } else {
                    alertTip('请求订单失败，请稍候再试');
                }
            }, function() {
                alertTip('请求订单失败，请稍候再试');
            });
        });
        $('#buy-goods-dialog .zhichi-close').on('click', function(event) {
            $('#buy-goods-dialog').removeClass('dialog-show');
        });
    }
    // 翻页动画后回调, curPage是进入的那一页页码
    function afterFlipFn(curPage) {
        pageIndex = curPage;
        traverseNav(curPage);
        var _thisPage = $('.page').eq(curPage);
        var $currentBarrage, danmuContainer;
        // 单动画是消失动画则需要展示元素display block
        _thisPage.find('.int-disappear').each(function(index, item) {
            if ($(item).hasClass('int-animate')) {
                return '';
            }
            $(item).removeClass('fadeOutCenter').addClass($(item).attr('animateName')).css('display', 'block');
        });
        // 多动画里有消失动画也需要展示动画display block
        _thisPage.find('.int-animate').each(function(index, item) {
            var _div = $(item);
            if (_div.hasClass('int-animate-disappear')) {
                $(item).removeClass('fadeOutCenter').removeClass(_div.attr('disappear-animation'));
            }
            ContinuousAnimate(_div);
        });
        if (_thisPage.children('img').length) {
            //刮刮卡特效
            var _img = _thisPage.children('img').eq(0);
            var id = _img.attr('id');
            var data = $.extend({
                completeFunction: function() {
                    $('#' + id).remove();
                    _thisPage.children('.pageshow').length ? _thisPage.children('.pageshow').css('display', 'block') : _thisPage.children().eq(0).addClass('pageshow').css('display', 'block');
                    _thisPage.siblings().children('div').css('display', 'none');
                }
            }, _thisPage.data('effect'));
            _img.eraser(data);
        } else {
            _thisPage.children('.pageshow').length ? _thisPage.children('.pageshow').css('display', 'block') : _thisPage.children().eq(0).addClass('pageshow').css('display', 'block');
            _thisPage.siblings().children('div').css('display', 'none');
        }
        _thisPage.find('.trigger-receiver').addClass('trigger-hide');
        _thisPage.find('.trigger-observer:not(.trigger-receiver)').removeClass('trigger-hide');
        showTextAnimate(_thisPage.find('.textanimate'));
        showSVGAnimate(_thisPage);
        imgPlayStart(_thisPage.find('.slide-new'));
        playAutoPlaySound(_thisPage.find('.has-sound-effect'));
        putVideoBack(curPage);
        if (_thisPage.hasClass('page-background')) {
            _thisPage.websnowjq('start');
        }
        //showParticleText($('.particleText'));
        if ((danmuContainer = $(this).find('.barrage-container')).length) {
            $(danmuContainer).each(function() {
                $(this).data('danmuInstance') && $(this).data('danmuInstance').destroy();
            });
        }
        if (($currentBarrage = _thisPage.find('.barrage-container')).length) {
            $currentBarrage.each(function(i, curBar) {
                getDanmuData($(curBar));
            });
        }
        // 页面切换后回调函数里只判断是否展示: 侧边栏、微站按钮、向上滑指示箭头
        setAsideAndBottomSign(curPage);
    }
    // 翻页动画执行前回调，curPage是准备离开的页面页码，targetPage是准备进入的页面页码
    function beforeFlipFn(curPage, targetPage) {
        var _oldpage = $('.page').eq(curPage)
          , _targetPage = $('.page').eq(targetPage);
        _targetPage.children('.background-animate').css('display', 'block');
        _targetPage.find('.int-disappear, .int-animate-disappear').css('display', 'none');
        pauseAllSound();
        // 页面切换前回调函数里 隐藏侧边栏 微站按钮 向上滑指示箭头
        $('.last_bottom').hide();
        $('#aside-btn').css('display', 'none');
        $('#tip-off').css('display', 'none');
        $('body').attr('weizhan-ty') === 'click' && $('#weizhan_btn').hide();
        $('#next').css('display', 'none');
        hideCombineLogo();
        // 如果不是苹果手机 翻页时要把视频元素删除 解决翻页时视频无法隐藏的问题
        removeAndStoreVideo(curPage);
        imgPlayStop(_oldpage.find('.slide-new'));
        if (_oldpage.hasClass('page-background')) {
            _oldpage.websnowjq('stop');
        }
    }
    // 判断是否展示: 侧边栏、微站按钮、向上滑指示箭头
    function setAsideAndBottomSign(curPage) {
        if (curPage == 0 && curPage !== section_len - 1) {
            // 进入第一页
            (aside_show == 1 || aside_show == 2) && $('#aside-btn').css('display', 'block');
            // flipPage_para.isphone && $('.last_bottom').css('display', 'block');
            $('#next').css('display', 'block');
        } else if (curPage == section_len - 1) {
            // 进入最后一页
            (aside_show == 0 || aside_show == 1 || aside_show == 2) && $('#aside-btn').css('display', 'block');
            $('.last_bottom').css('display', 'block');
            $('#tip-off').css('display', 'block');
            showCombineLogo();
            // 设置微站
            if ($('body').attr('weizhan-ty') === 'click') {
                $('#weizhan_btn').show();
                // getNewPageData('weizhan', $('body').attr('cre_ut'));
            } else if ($('body').attr('weizhan-ty') === 'pull') {
                $('#next').css('display', 'block');
                // getNewPageData('weizhan', $('body').attr('cre_ut'));
            }
        } else {
            // 进入除第一页最后一页外的其他页面
            aside_show == 2 && $('#aside-btn').css('display', 'block');
            $('#next').css('display', 'block');
        }
    }
    function traverseNav(curPage) {
        $('.current-page .nav').each(function(index, item) {
            var $this = $(item)
              , nav_in_page = $this.attr('nav-in-page') || -1;
            if (nav_in_page >= 0) {
                curPage == nav_in_page ? $this.css('display', 'block') : $this.css('display', 'none');
            } else {
                $this.css('display', 'block');
            }
        });
    }
    // 连续动画，清除DIV本身附带的动画
    function cleanTarget(selector) {
        var animateType = ['fadeIn', 'bounceIn', 'rotateIn', 'translate', 'scale', 'more_', 'disappear_'];
        for (var i = 0; i < animateType.length; i++) {
            var type = animateType[i];
            var _that = $(selector);
            var _classes = (_that.attr('class')).split(' ');
            if (i < 4) {
                _that.removeClass(type + 'Up').removeClass(type + 'Down').removeClass(type + 'Left').removeClass(type + 'Right');
            } else if (i == 4) {
                _that.removeClass(type + 'InCenter').removeClass(type + 'OutCenter').removeClass(type + 'OutSlow').removeClass(type + 'InSlow').removeClass(type + 'X').removeClass(type + 'Y');
            } else if (i == 5) {
                for (var j = 0; j < _classes.length; j++) {
                    if (/more_/.test(_classes[j])) {
                        _that.removeClass(_classes[j]);
                    }
                }
            } else if (i == 6) {
                for (var j = 0; j < _classes.length; j++) {
                    if (/disappear_/.test(_classes[j])) {
                        _that.removeClass(_classes[j]);
                    }
                }
            }
        }
    }
    function ContinuousAnimate(selector) {
        //先引入第一个动画，与之前的动画兼容;
        if (!$(selector).attr('animate-arr')) {
            return '';
        }
        cleanTarget(selector);
        $(selector).unbind('webkitAnimationEnd');
        var first_animation_detail = getFirstObject(JSON.parse($(selector).attr('animate-arr')));
        var first_animation = first_animation_detail['animation-name'];
        $(selector).css({
            'animation-duration': first_animation_detail['animation-duration'] + 's' || '1s',
            '-webkit-animation-duration': first_animation_detail['animation-duration'] + 's' || '1s',
            'animation-delay': first_animation_detail['animation-delay'] + 's' || '1s',
            '-webkit-animation-delay': first_animation_detail['animation-delay'] + 's' || '1s',
            'animation-iteration-count': first_animation_detail['animation-iteration-count'] || '1',
            '-webkit-animation-iteration-count': first_animation_detail['animation-iteration-count'] || '1',
            "transform-origin": '',
            "-webkit-transform-origin": ''
        });
        var num = 0;
        //开始连续动画
        selector.on("webkitAnimationEnd", function() {
            var arrStr = JSON.parse($(this).attr('animate-arr'));
            var arr = [];
            var duration = [];
            var iteration = [];
            var delay = [];
            //4个参数
            for (var item in arrStr) {
                if (item != 'undefined') {
                    arr.push((arrStr[item])['animation-name']);
                    duration.push((arrStr[item])['animation-duration']);
                    iteration.push((arrStr[item])['animation-iteration-count']);
                    delay.push((arrStr[item])['animation-delay']);
                }
            }
            num++;
            if (num > arr.length - 1) {
                if ($(this).hasClass('barrage')) {
                    danmuStart($(this).find('.barrage-container'));
                }
                $(this).unbind('webkitAnimationEnd');
                if ($(this).hasClass('int-animate-disappear') && !$(this).attr('disappear-animation')) {
                    $(this).addClass('fadeOutCenter');
                } else if (!$(this).hasClass('int-animate-disappear')) {
                    $(this).removeClass(arr[num - 1]);
                }
                if (arr[num - 1].substring(0, 10) === 'disappear_' || $(this).attr('disappear-animation')) {
                    $(this).hide();
                }
                // else if($(this).hasClass('int-animate-disappear')){
                //     $(this).hide();
                // }
                num = 0;
                return;
            } else {
                $(this).removeClass(arr[num - 1]);
            }
            $(this).css({
                'animation-duration': duration[num] + 's',
                '-webkit-animation-duration': duration[num] + 's',
                'animation-delay': delay[num] + 's',
                '-webkit-animation-delay': delay[num] + 's',
                'animation-iteration-count': iteration[num],
                '-webkit-animation-iteration-count': iteration[num],
            });
            // if (arr[num] == arr[num - 1]) {
            //   $(selector).css('display', 'none');
            //   $(selector).css('display', 'block');
            // }
            $(this).addClass(arr[num]).css('display', 'block');
        });
        $(selector).addClass(first_animation).css('display', 'block');
    }
    function recordPageIndex() {
        var href = window.location.href;
        if (window.location.hash) {
            href = href.slice(0, href.indexOf('#'));
        }
        window.history.replaceState(null , null , href + '#' + pageIndex);
    }
    function imgPlayStart(slidenewDom) {
        slidenewDom.each(function(index, el) {
            var id = $(el).children('.animate-contain').attr("id");
            slider_arr[id] && slider_arr[id].play();
        });
    }
    function imgPlayStop(slidenewDom) {
        slidenewDom.each(function(index, el) {
            var id = $(el).children('.animate-contain').attr("id");
            slider_arr[id] && slider_arr[id].stop();
        });
    }
    function imgPlay(slidenewDom, slideDom) {
        if (slidenewDom.length) {
            asyLoadScript(cdnUrl + '/static/pc/invitation/js/flux.min.js', 'js', function() {
                slidenewDom.each(function(index, el) {
                    var option = $(el).children('.animate-contain').data('initial');
                    var _that = $(el);
                    var _li = '', target, src_arr = [];
                    target = $(el).find('.animate-contain').find('section');
                    src_arr = target.attr('data-src').trim();
                    if (!src_arr) {
                        return;
                    }
                    src_arr = src_arr.split(' ');
                    // src_arr.pop();
                    for (var i = 0; i < src_arr.length; i++) {
                        _li += '<img src="' + src_arr[i] + '" alt="图片加载中" />';
                    }
                    target.children().remove();
                    target.append(_li);
                    // $(_li)[0].onload = function() {
                    slider_arr[target.parent().attr('id')] = new flux.slider(target,option);
                    // }
                });
            })
        }
        if (slideDom.length) {
            asyLoadScript(cdnUrl + '/static/invitation/js/swipeslide.js', 'js', function() {
                slideDom.each(function(index, el) {
                    var option = $(el).children('.animate-contain').data('initial');
                    var _that = $(el);
                    var type = $(el).hasClass('slide-new') ? 1 : '';
                    var _li = '', target, src_arr = [];
                    if (type) {} else {
                        option = $.extend({
                            callback: function(i) {
                                _that.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
                            }
                        }, option);
                        _that.children('.animate-contain').attr('style', '');
                        option.continuousScroll ? _that.find('ul').children().first().remove() && _that.find('ul').children().last().remove() : '';
                        _that.children('.animate-contain').swipeSlide(option);
                    }
                });
            });
        }
    }
    // 展示联合底标
    var showCombineLogo = (function() {
        var ml = $('.mobile-combine-bottom-logo');
        if (ml.length > 0) {
            return function() {
                ml.css('display', 'block').children().show();
            }
        } else {
            return function() {
                return;
            }
        }
    })();
    // 隐藏联合底标
    var hideCombineLogo = (function() {
        var ml = $('.mobile-combine-bottom-logo');
        if (ml.length > 0) {
            return function() {
                ml.css('display', 'none').children().hide();
            }
        } else {
            return function() {
                return;
            }
        }
    })();
    $("#tip-off").on('click', function(event) {
        $("#tip-off-wrap").show();
    });
    $("#tip-off-wrap").on('click', 'li', function(event) {
        $(this).addClass('active').siblings().removeClass('active');
    }).on('click', '.tip-off-can', function(event) {
        $("#tip-off-wrap").hide();
    }).on('click', '.tip-off-con', function(event) {
        var _this = $(this);
        if (_this.hasClass('js-ajax')) {
            return;
        }
        _this.addClass('js-ajax');
        var _reason = $("#tip-off-wrap").find('.tip-off-reason').find('li.active').text()
          , _desc = '';
        $.ajax({
            url: '/index.php?r=pc/Jubao/jubao',
            type: 'post',
            data: {
                invi_id: intId,
                reason: _reason,
                description: _desc
            },
            dataType: 'json',
            success: function(data) {
                if (data.status === 0) {
                    alertTip('举报成功！');
                    $("#tip-off-wrap").hide();
                } else {
                    alertTip(data.data);
                    _this.removeClass('js-ajax');
                }
            },
            error: function() {
                _this.removeClass('js-ajax');
            }
        });
    });
});
function getNewPageData(type, typeid) {
    var type = type
      , typeid = typeid;
    $('.nav-circle').css('display', 'block');
    if (type === 'weizhan' && $('#user_promotion_content').attr('weizhan-data')) {
        showWeizhan();
        return;
    }
    $.ajax({
        url: '/index.php?r=Home/getDetail',
        type: 'get',
        data: {
            id: typeid,
            type: type
        },
        success: function(data) {
            if (type === 'weizhan') {
                showWeizhan();
                $('#user_promotion_content').append(data).attr('weizhan-data', true);
                return;
            }
            $('.self-iframe').append(data);
        }
    });
}
//显示新页面
function ShowNewPage(selecter) {
    window.location.hash = 0;
    $(selecter).css('display', 'block');
    $('#music').addClass('toggleMusic');
    bg_music.src && bg_music.pause();
    setTimeout(function() {
        $('.page').eq(pageIndex).css('display', 'none').children('div').css('display', 'none');
        $('.page').eq(pageIndex).find('.int-disappear').each(function(index, item) {
            $(item).removeClass('fadeOutCenter').addClass($(item).attr('animateName'));
        })
    }, 500);
}
//关闭新页面
function CloseNewPage(selecter) {
    $(selecter).css('display', 'none');
    $("#invitation-container").css('display', 'block');
    $('.page').eq(pageIndex).css('display', 'block').children('div').css('display', 'block');
    if (musicUrl != 'ittsharemusic' && musicUrl != '') {
        $('#music').removeClass('toggleMusic');
        if (!$('#music').hasClass('paused')) {
            $('#music').removeClass('toggleMusic');
            bg_music.play();
        }
    }
}
//展示微站
function showWeizhan() {
    $('#invitation-container').hide();
    if ($('#user_promotion_content').html()) {
        $('#user_promotion_container').scrollTop(0);
        $('#user_promotion_container').addClass('showAnimation');
        ShowNewPage('#user_promotion_container');
    } else {
        $('#user_promotion_container').css('height', window.innerHeight).addClass('showAnimation');
        ShowNewPage('#user_promotion_container');
    }
}
var mapModule = {
    setPhoneMap: function(el, fn) {
        var _self = this
          , lat = el.attr("lat")
          , lng = el.attr("lng")
          , zoom = parseInt(el.attr("mapzoom")) || 13
          , latLng = new qq.maps.LatLng(lat,lng)
        geocoder = new qq.maps.Geocoder();
        _self.clearOverlays();
        geocoder.getAddress(latLng);
        geocoder.setComplete(function(result) {
            _self.qqMapMarker = new qq.maps.Marker({
                position: latLng,
                map: _self.map
            });
            _self.map.panTo(latLng);
            fn && fn(result);
        });
        _self.map.zoomTo(zoom);
    },
    clearOverlays: function(id) {
        //清除地图覆盖物
        this.qqMapMarker && this.qqMapMarker.setMap(null );
    },
    initPhoneMap: function() {
        var _self = this;
        _self.map = new qq.maps.Map(document.getElementById("phone-map"),{
            zoom: 13,
            zoomControl: false,
            panControl: false,
            mapTypeControl: false
        });
    },
    createMap: function(id) {
        var _self = this;
        _self[id] = {};
        _self[id].map = new qq.maps.Map(document.getElementById(id),{
            zoom: 13,
            zoomControl: false,
            panControl: false,
            mapTypeControl: false
        });
        var _curch = $("#" + id).parent().parent()
          , lat = _curch.attr("lat")
          , lng = _curch.attr("lng")
          , zoom = parseInt(_curch.attr("mapzoom")) || 13;
        if (lat && lng) {
            var latLng = new qq.maps.LatLng(lat,lng);
            _self[id].qqMapMarker = new qq.maps.Marker({
                map: _self[id].map,
                position: latLng
            });
            _self[id].map.setCenter(latLng);
            _self[id].map.zoomTo(zoom);
        }
    },
    initMap: function() {
        var _self = this;
        if (!isWeiXin) {
            _self.initPhoneMap();
        }
        ;$.each($(".cont-map"), function(index, el) {
            var _el = $(el).find('.map-wrap');
            if (_el.length > 0) {
                _el.html("");
                _self.createMap(_el.attr("id"));
            }
        });
    }
};
