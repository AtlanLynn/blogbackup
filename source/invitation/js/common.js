// 滑动组件
// (function($) {
$(function() {
    /*
		 * flipPage('选择器'，'滑动方向'，'动画类型'，'动画切换时间','初始化当前页','侧边栏的显示方式'，'定时翻页','自动翻页','回调函数');
		 *
		 * aside_show 0: 尾页显示，1: 首尾显示，2: 一直显示，3: 不显示
		 */
    $.fn.flipPage = function(flipPage_para, afterCallback, beforeCallback) {
        var selector = flipPage_para.selector
          , isVertical = flipPage_para.isVertical
          , type = flipPage_para.type
          , autoTurnPage = flipPage_para.autoTurnPage
          , currentPage = flipPage_para.currentPage
          , aside_show = flipPage_para.aside_show
          , loop = flipPage_para.loopTurnPage
          , ismakebyphone = flipPage_para.isphone;
        var children = selector ? this.children(selector) : this.children();
        var childrenArray = [];
        var cssDirection = isVertical ? 'translateY' : 'translateX';
        var rotateDirection = isVertical ? 'rotateX' : 'rotateY';
        var switchType = type ? type : 'normal';
        var time = 600;
        //动画切换时间
        children.each(function() {
            // 把 selector 转换成数组，方便调用
            childrenArray.push($(this));
        });
        var childCount = childrenArray.length;
        var autoTurnTime = autoTurnPage * 1000;
        var auto_swipe, targetPage, cycleFlipTip, pageFlipDirection;
        var _translatez = window.innerHeight / 2;
        children.css({
            '-webkit-transition': '-webkit-transform ' + time + 'ms linear',
            'transition': 'transform ' + time + 'ms linear'
        });
        if (type == 'cube') {
            time = 1000;
            children.css({
                '-webkit-transition': '-webkit-transform ' + time + 'ms ease',
                //cubic-bezier(0.175, 0.885, 0.32, 1.175)',
                'transition': 'transform ' + time + 'ms ease',
                //cubic-bezier(0.175, 0.885, 0.32, 1.175)',
            });
        }
        (type == 'cube' || type == 'rotate' || type == 'card' || type == 'cutcard' || type == 'falldown' || type == 'fadeInOut') && $('#invitation-container').addClass('cube-flip-page');
        if (currentPage == 0) {
            if (type == 'cube') {
                var rotateStr = rotateDirection == 'rotateY' ? '(90deg) ' : '(-90deg) ';
                children.not(children.eq(0)).css({
                    opacity: 0,
                    '-webkit-transform': rotateDirection + rotateStr + cssDirection + '(50%) translateZ(' + _translatez + 'px)',
                    'transform': rotateDirection + rotateStr + cssDirection + '(50%) translateZ(' + _translatez + 'px)',
                });
            } else if (type == 'rotate') {
                children.not(children.eq(0)).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(200%) translateZ(-1000px) rotateZ(180deg)',
                    'transform': cssDirection + '(200%) translateZ(-1000px) rotateZ(180deg)'
                });
            } else if (type == 'card') {
                var rotateStr = rotateDirection == 'rotateY' ? '(180deg) ' : '(-180deg) ';
                children.not(children.eq(0)).css({
                    opacity: 0,
                    '-webkit-transform': rotateDirection + rotateStr + ' scale(1.0)',
                    'transform': rotateDirection + rotateStr + ' scale(1.0)',
                    'z-index': 11,
                });
            } else if (type == 'cutcard' || type == 'falldown' || type == "fadeInOut") {
                children.css({
                    display: 'none',
                    transition: 'none',
                    '-webkit-transition': 'none',
                }).eq(0).css('display', 'block');
            } else if (type == 'cover') {
                children.not(children.eq(0).css('z-index', 11)).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(100%)',
                    'transform': cssDirection + '(100%)',
                })
            } else {
                children.not(children.eq(0)).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(100%) scale(1)',
                    'transform': cssDirection + '(100%) scale(1)'
                });
            }
        } else {
            childrenArray[currentPage].css({
                '-webkit-transform': cssDirection + '(0) scale(1) rotateY(0)',
                'transform': cssDirection + '(0) scale(1) rotateY(0)',
                'display': 'blcok',
            });
            type == 'cover' && childrenArray[currentPage].css('z-index', 11);
            for (var i = 0; i < currentPage; i++) {
                if (type == 'cube') {
                    var rotateStr = rotateDirection == 'rotateY' ? '(-90deg) ' : '(90deg) ';
                    childrenArray[i].css({
                        opacity: 0,
                        '-webkit-transform': rotateDirection + rotateStr + cssDirection + '(-50%) translateZ(' + _translatez + 'px)',
                        'transform': rotateDirection + rotateStr + cssDirection + '(-50%) translateZ(' + _translatez + 'px)',
                    })
                } else if (type == 'rotate') {
                    childrenArray[i].css({
                        opacity: 0,
                        '-webkit-transform': cssDirection + '(-100%) translateZ(-1000px) rotateZ(180deg)',
                        'transform': cssDirection + '(-100%) translateZ(-1000px) rotateZ(180deg)',
                    })
                } else if (type == 'card') {
                    var rotateStr = rotateDirection == 'rotateY' ? '(-180deg) ' : '(180deg) ';
                    childrenArray[i].css({
                        opacity: 0,
                        '-webkit-transform': rotateDirection + rotateStr + ' scale(1.0)',
                        'transform': rotateDirection + rotateStr + ' scale(1.0)',
                        'z-index': 11,
                    });
                } else if (type == 'cutcard' || type == 'falldown' || type == "fadeInOut") {
                    childrenArray[i].css({
                        display: 'none',
                        'transition': 'none',
                        '-webkit-transition': 'none',
                    })
                } else if (type == 'cover') {
                    childrenArray[i].css({
                        opacity: 0,
                        '-webkit-transform': cssDirection + '(0)',
                        'transform': cssDirection + '(0)',
                    })
                } else {
                    childrenArray[i].css({
                        '-webkit-transform': cssDirection + '(-100%) scale(1)',
                        'transform': cssDirection + '(-100%) scale(1)'
                    });
                }
            }
            ;for (var j = currentPage + 1; j < childCount; j++) {
                if (type == 'cube') {
                    var rotateStr = rotateDirection == 'rotateY' ? '(90deg) ' : '(-90deg) ';
                    childrenArray[j].css({
                        opacity: 0,
                        '-webkit-transform': rotateDirection + rotateStr + cssDirection + '(50%) translateZ(' + _translatez + 'px)',
                        'transform': rotateDirection + rotateStr + cssDirection + '(50%) translateZ(' + _translatez + 'px)',
                    })
                } else if (type == 'rotate') {
                    childrenArray[j].css({
                        opacity: 0,
                        '-webkit-transform': cssDirection + '(200%) translateZ(-1000px) rotateZ(180deg)',
                        'transform': cssDirection + '(200%) translateZ(-1000px) rotateZ(180deg)',
                    })
                } else if (type == 'card') {
                    var rotateStr = rotateDirection == 'rotateY' ? '(180deg) ' : '(-180deg) ';
                    childrenArray[j].css({
                        '-webkit-transform': rotateDirection + rotateStr + ' scale(1.0)',
                        'transform': rotateDirection + rotateStr + ' scale(1.0)',
                        'z-index': 11,
                    });
                } else if (type == 'cutcard' || type == 'falldown' || type == "fadeInOut") {
                    childrenArray[j].css({
                        display: 'none',
                        'transition': 'none',
                        '-webkit-transition': 'none',
                    })
                } else if (type == 'cover') {
                    childrenArray[i].css({
                        opacity: 0,
                        '-webkit-transform': cssDirection + '(100%)',
                        'transform': cssDirection + '(100%)',
                    })
                } else {
                    childrenArray[j].css({
                        opacity: 0,
                        '-webkit-transform': cssDirection + '(100%) scale(1)',
                        'transform': cssDirection + '(100%) scale(1)'
                    });
                }
            }
            ;
        }
        // 设置外层flip的css： { overflow:hidden; position:relative; }
        this.css({
            'overflow': 'hidden',
            'position': 'absolute',
            'left': '0%',
            'top': '0%'
        });
        // 滑向下一页
        var flipNext = function(e) {
            pageFlipDirection = 'down';
            autoTimer && clearTimeout(autoTimer);
            if ($('.moving').length) {
                return '';
            }
            currentPage = $('.page').index($('.current-page') || $(this));
            targetPage = currentPage + 1;
            // 自动翻页时e为undefined, 滑动翻页时e为event事件, 页面跳转时e为targetpage(页面跳转如果没有传targetpage 则默认滑到下一页)
            if (e != undefined) {
                // 手动翻页
                if (e.target) {
                    e.preventDefault();
                    e.stopPropagation();
                    // 最后一页再往下滑一页
                    if (currentPage == childCount - 1) {
                        // 如果设置了微站 则加载微站
                        if ($('body').attr('cre_ut') && $('body').attr('weizhan-ty') === 'pull') {
                            getNewPageData('weizhan', $('body').attr('cre_ut'));
                            // showWeizhan();
                            return '';
                        }
                        // 页数少于3 不能循环
                        if (childCount < 3) {
                            return;
                        }
                        // 未提示过回到第一页时
                        if (!cycleFlipTip) {
                            alertTip('再次滑动 回到第一页');
                            cycleFlipTip = true;
                            return;
                        }
                    }
                } else {
                    // 调接口跳转翻页
                    targetPage = e;
                }
            } else {
                // 自动翻页或页内跳转到下一页
                if (currentPage == childCount - 1 && childCount < 3) {
                    return;
                }
            }
            // 倒数第二页向最后一页滑动时 或者页内跳转到最后一页取消自动翻页
            if (currentPage == childCount - 2 || targetPage == childCount - 1) {
                $('.page').off('webkitAnimationStart webkitAnimationIteration webkitAnimationEnd');
                autoTurnTime = 0;
            }
            // 设置进入页面的页码
            targetPage = targetPage > childCount - 1 ? 0 : targetPage;
            // 页面切换动画执行前回调函数
            beforeCallback && beforeCallback(currentPage, targetPage);
            type == 'cover' && CoverSlider();
            type == 'normal' && NormalSlider();
            type == 'scale' && ScaleSlider();
            type == 'cube' && CubeSlider();
            type == 'rotate' && RotateSlider();
            type == 'card' && CardSlider();
            type == 'cutcard' && CutCardTransform();
            type == 'falldown' && falldownSlider();
            type == 'fadeInOut' && fadeInOutSlider();
            if (e && e.target) {
                // 如果是滑动页面翻页 不用等到翻页动画结束初始化前后页的动画 如果是页内跳转 必须等到翻页动画结束后再初始化
                setNearbyPageAni(type, targetPage);
            }
        }
        // 滑向上一页
        var flipPrev = function(e) {
            pageFlipDirection = 'up';
            autoTimer && clearTimeout(autoTimer);
            if ($('.moving').length) {
                return '';
            }
            currentPage = $('.page').index($('.current-page') || $(this));
            if (e && e.target) {
                e.preventDefault();
                e.stopPropagation();
            }
            // 第一页再往上滑一页
            if (currentPage == 0) {
                // 页数少于3 不能循环
                if (childCount < 3) {
                    return;
                }
                // 未提示过上滑回到第一页时
                if (!cycleFlipTip) {
                    alertTip('再次滑动 回到最后一页');
                    cycleFlipTip = true;
                    return;
                }
                // 从第一页往上滑到最后一页 取消自动翻页
                $('.page').off('webkitAnimationStart webkitAnimationIteration webkitAnimationEnd');
                autoTurnTime = 0;
            }
            // 设置进入页面的页码
            targetPage = currentPage - 1;
            targetPage = targetPage < 0 ? childCount - 1 : targetPage;
            // 页面切换动画执行前回调函数
            beforeCallback && beforeCallback(currentPage, targetPage);
            type == 'cover' && CoverSlider();
            type == 'normal' && NormalSlider();
            type == 'scale' && ScaleSlider();
            type == 'cube' && CubeSlider();
            type == 'rotate' && RotateSlider();
            type == 'card' && CardSlider();
            type == 'cutcard' && CutCardTransform();
            type == 'falldown' && falldownSlider();
            type == 'fadeInOut' && fadeInOutSlider();
            if (e && e.target) {
                // 如果是滑动页面翻页 不用等到翻页动画结束初始化前后页的动画 如果是页内跳转 必须等到翻页动画结束后再初始化
                setNearbyPageAni(type, targetPage);
            }
        }
        function NormalSlider() {
            //平滑切换
            var translateDistance = '-100%';
            if (pageFlipDirection == 'up') {
                translateDistance = '100%';
            }
            // 设置当前页动画
            $(childrenArray[currentPage]).removeClass('current-page moving').css({
                opacity: 1,
                '-webkit-transform': cssDirection + '(' + translateDistance + ')',
                'transform': cssDirection + '(' + translateDistance + ')'
            });
            // 设置进入页动画
            $(childrenArray[targetPage]).addClass('current-page moving').css({
                opacity: 1,
                '-webkit-transform': cssDirection + '(0)',
                'transform': cssDirection + '(0)'
            });
            setTimeout(function() {
                afterCallback && afterCallback(targetPage);
                $('.moving').removeClass('moving');
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, time + 100);
        }
        function CoverSlider() {
            //覆盖切换
            var curTranslateDistance = 0, $currentPage, $targetPage;
            if (pageFlipDirection == 'up') {
                curTranslateDistance = '100%';
            }
            // 设置当前页动画
            $currentPage = $(childrenArray[currentPage]).removeClass('current-page moving').css({
                opacity: 1,
                'z-index': pageFlipDirection == 'up' ? 12 : 11,
                '-webkit-transform': cssDirection + '(' + curTranslateDistance + ')',
                'transform': cssDirection + '(' + curTranslateDistance + ')'
            });
            // 设置进入页的动画
            $targetPage = $(childrenArray[targetPage]).addClass('current-page').addClass('moving').css({
                opacity: 1,
                'z-index': pageFlipDirection == 'up' ? 11 : 12,
                '-webkit-transform': cssDirection + '(0)',
                'transform': cssDirection + '(0)',
            });
            setTimeout(function() {
                $currentPage.css({
                    opacity: 0
                });
                $('.moving').removeClass('moving');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, time + 100);
        }
        function ScaleSlider() {
            // 缩放切换
            var translateDistance = '-100%'
              , scaleClass = isVertical ? 'scaleUp' : 'scaleLeft'
              , scaleClassTwo = isVertical ? 'scaleDown' : 'scaleRight';
            if (pageFlipDirection == 'up') {
                translateDistance = '100%';
                scaleClass = scaleClassTwo;
            }
            // 设置当前页动画
            $(childrenArray[currentPage]).removeClass('current-page moving').addClass(scaleClass).css({
                opacity: 1,
            });
            // 设置进入页动画
            $targetPage = $(childrenArray[targetPage]).addClass('current-page moving').css({
                opacity: 1,
                '-webkit-transform': cssDirection + '(0%)',
                'transform': cssDirection + '(0%)',
            });
            setTimeout(function() {
                $('.' + scaleClass).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(' + translateDistance + ')',
                    'transform': cssDirection + '(' + translateDistance + ')'
                }).removeClass(scaleClass);
                $('.moving').removeClass('moving');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, time + 100);
        }
        function CubeSlider() {
            // 翻书切换
            var rotateDistance, translateDistance, $currentPage;
            if (pageFlipDirection == 'up') {
                translateDistance = '50%';
                if (rotateDirection == 'rotateX') {
                    rotateDistance = '-90deg';
                } else {
                    rotateDistance = '90deg';
                }
            } else {
                translateDistance = '-50%';
                if (rotateDirection == 'rotateY') {
                    rotateDistance = '-90deg';
                } else {
                    rotateDistance = '90deg';
                }
            }
            // 设置当前页动画
            $currentPage = $(childrenArray[currentPage]).removeClass('current-page moving').css({
                opacity: 1,
                'z-index': 30,
                '-webkit-transform': rotateDirection + '(' + rotateDistance + ') ' + cssDirection + '(' + translateDistance + ') translateZ(' + _translatez + 'px)',
                'transform': rotateDirection + '(' + rotateDistance + ') ' + cssDirection + '(' + translateDistance + ') translateZ(' + _translatez + 'px)',
            });
            // 设置进入页动画
            $(childrenArray[targetPage]).addClass('current-page moving').css({
                opacity: 1,
                '-webkit-transform': rotateDirection + '(0) ' + cssDirection + '(0) translateZ(0)',
                'transform': rotateDirection + '(0) ' + cssDirection + '(0) translateZ(0)',
            });
            setTimeout(function() {
                $currentPage.css({
                    'z-index': 9,
                });
            }, time / 2);
            setTimeout(function() {
                $currentPage.css({
                    'opacity': 0,
                    'z-index': 10,
                });
                $('.moving').removeClass('moving');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, time + 100);
        }
        function RotateSlider() {
            // 旋转切换
            var translateDistance = '-100%', $currentPage;
            if (pageFlipDirection == 'up') {
                translateDistance = '100%';
            }
            // 设置当前页动画
            $currentPage = $(childrenArray[currentPage]).removeClass('current-page moving').css({
                opacity: 1,
                '-webkit-transform': cssDirection + '(' + translateDistance + ')' + 'translateZ(-1000px) rotateZ(180deg)',
                'transform': cssDirection + '(' + translateDistance + ')' + 'translateZ(-1000px) rotateZ(180deg)',
                'z-index': 9
            })
            // 设置进入页动画
            $(childrenArray[targetPage]).addClass('current-page').addClass('moving').css({
                opacity: 1,
                '-webkit-transform': cssDirection + '(0%) translateZ(0px) rotateZ(0deg)',
                'transform': cssDirection + '(0%) translateZ(0px) rotateZ(0deg)',
                'z-index': 10
            });
            setTimeout(function() {
                $currentPage.css('opacity', 0);
                // $('.removeSwith').removeClass('removeSwith');
                $('.moving').removeClass('moving');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, time + 100);
        }
        function CardSlider() {
            // 翻牌切换
            var rotateD = pageFlipDirection == 'down' ? (rotateDirection == 'rotateY' ? -180 : 180) : (rotateDirection == 'rotateY' ? 180 : -180), $currentPage;
            // 设置当前页动画
            $currentPage = $(childrenArray[currentPage]).removeClass('current-page moving').css({
                opacity: 1,
                '-webkit-transform': rotateDirection + '(' + rotateD + 'deg)',
                'transform': rotateDirection + '(' + rotateD + 'deg)',
                'z-index': '11',
            });
            // 设置进入页动画
            $(childrenArray[targetPage]).addClass('current-page').addClass('moving').css({
                opacity: 1,
                '-webkit-transform': rotateDirection + '(0deg)',
                'transform': rotateDirection + '(0deg)',
                'z-index': '11',
            });
            setTimeout(function() {
                $currentPage.css('opacity', 0);
                $('.moving').removeClass('moving');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, time + 100);
        }
        function CutCardTransform() {
            // 切牌切换
            var tempFlipAniClass, curFlipAniClass, $currentPage, $targetPage;
            if (pageFlipDirection == 'down') {
                if (rotateDirection == 'rotateY') {
                    tempFlipAniClass = 'flippage-cutCard-left-downward';
                    curFlipAniClass = 'flippage-cutCard-right-upward';
                } else {
                    tempFlipAniClass = 'flippage-cutCard-top-downward';
                    curFlipAniClass = 'flippage-cutCard-bottom-upward';
                }
            } else {
                if (rotateDirection == 'rotateY') {
                    tempFlipAniClass = 'flippage-cutCard-right-downward';
                    curFlipAniClass = 'flippage-cutCard-left-upward';
                } else {
                    tempFlipAniClass = 'flippage-cutCard-bottom-downward';
                    curFlipAniClass = 'flippage-cutCard-top-upward';
                }
            }
            // 设置当前页动画
            $currentPage = $(childrenArray[currentPage]).removeClass('current-page moving').css({
                display: 'block'
            }).addClass(tempFlipAniClass);
            // 设置进入页动画
            $targetPage = $(childrenArray[targetPage]).addClass('current-page moving').css({
                display: 'block'
            }).addClass(curFlipAniClass);
            setTimeout(function() {
                $currentPage.css({
                    display: 'none'
                }).removeClass(tempFlipAniClass);
                $targetPage.removeClass(curFlipAniClass);
                $('.moving').removeClass('moving');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, 1000);
        }
        function falldownSlider() {
            // 掉落切换
            var $currentPage, $targetPage;
            cleanSectionHtml(childrenArray[currentPage]);
            cleanSectionHtml(childrenArray[targetPage]);
            // 设置当前页动画
            $currentPage = $(childrenArray[currentPage]).addClass('flippage-falldown').removeClass('current-page moving').css({
                display: 'block',
                'z-index': 10
            });
            // 设置进入页动画
            $targetPage = $(childrenArray[targetPage]).addClass('moving current-page flippage-normalTranslateInUp').css({
                display: 'block',
                'z-index': 11
            });
            setTimeout(function() {
                $currentPage.css({
                    'display': 'none'
                }).removeClass('flippage-falldown');
                $targetPage.removeClass('flippage-normalTranslateInUp moving');
                // $('.removeSwith').removeClass('removeSwith');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, 1000);
        }
        function fadeInOutSlider() {
            // 淡入淡出切换
            var $currentPage, $targetPage;
            cleanSectionHtml(childrenArray[currentPage]);
            cleanSectionHtml(childrenArray[targetPage]);
            // 设置当前页动画
            $currentPage = $(childrenArray[currentPage]).removeClass('current-page moving flippage-fadeIn').css({
                'display': 'block',
                'z-index': '11',
            }).addClass('flippage-fadeOut');
            // 设置进入页动画
            $targetPage = $(childrenArray[targetPage]).css({
                display: 'block',
            }).removeClass('flippage-fadeOut').addClass('moving current-page flippage-fadeIn');
            setTimeout(function() {
                $currentPage.css({
                    'display': 'none',
                    'z-index': '0'
                }).removeClass('flippage-fadeOut');
                $targetPage.removeClass('flippage-fadeIn');
                // $('.removeSwith').removeClass('removeSwith');
                $('.moving').removeClass('moving');
                afterCallback && afterCallback(targetPage);
                // 翻页动画结束后，初始化进入页面的下一页或上一页动画状态
                setNearbyPageAni(type, targetPage);
                autoTurnPageFn();
                // 自动翻页
            }, 1000);
        }
        function cleanSectionHtml(selector) {
            var _that = $(selector);
            var _classes = (_that.attr('class')).split(' ');
            for (var j = 0; j < _classes.length; j++) {
                if (/flippage-/.test(_classes[j])) {
                    _that.removeClass(_classes[j]);
                }
            }
        }
        // 绑定手指滑动事件
        // if (isVertical) {
        // 		$('.page').on('swipeUp', flipNext);
        // 		$('.page').on('swipeDown', flipPrev);
        // } else {
        // 		$('.page').on('swipeLeft', flipNext);
        // 		$('.page').on('swipeRight', flipPrev);
        // }
        $("#flip").gesture(function(event, dir) {
            if (isVertical) {
                if (dir == "Up") {
                    flipNext(event);
                } else if (dir == "Down") {
                    flipPrev(event);
                }
            } else {
                if (dir == "Left") {
                    flipNext(event);
                } else if (dir == "Right") {
                    flipPrev(event);
                }
            }
        });
        //绑定自动翻页
        //定时器
        var autoTimer, isInfiniteAnimation;
        if (autoTurnTime != 0) {
            $('.page').on('webkitAnimationStart', function(e) {
                autoTimer && clearTimeout(autoTimer);
                isInfiniteAnimation = false;
            });
            $('.page').on('webkitAnimationEnd webkitAnimationIteration', autoTurnPageFn);
        }
        function autoTurnPageFn(e) {
            if (autoTurnTime == 0 || currentPage == (childCount - 1) || isInfiniteAnimation) {
                // 正在翻页或者已到最后一页则停止翻页
                return '';
            }
            e && e.type == 'webkitAnimationIteration' && (isInfiniteAnimation = true);
            autoTimer && clearTimeout(autoTimer);
            autoTimer = setTimeout(flipNext, autoTurnTime);
        }
        // 修复 Android 4.0.X 触摸事件的 Bug
        // 参考：Android Issue 19827、152913
        // https://code.google.com/p/android/issues/detail?id=19827
        // https://code.google.com/p/chromium/issues/detail?id=152913
        this.on('touchstart', function(e) {// e.preventDefault();
        });
        this.on('touchmove', function(e) {
            e.preventDefault();
        });
        this.on('touchend', function(e) {});
        function setNearbyPageAni(flipAniType, curPage, tarPage) {
            var curNextPage, curPrePage;
            if (childCount < 3) {
                return;
            }
            curPage = isNaN(curPage) ? currentPage : curPage;
            if (isNaN(tarPage)) {
                // 没有传tarPage时 初始化curPage的相邻页动画状态
                (pageFlipDirection == 'down' || pageFlipDirection == undefined) && (curNextPage = curPage + 1 <= childCount - 1 ? curPage + 1 : 0);
                (pageFlipDirection == 'up' || pageFlipDirection == undefined) && (curPrePage = curPage - 1 >= 0 ? curPage - 1 : childCount - 1);
            } else {
                // 有传tarPage时 为页内跳转
                curNextPage = tarPage;
                curPrePage = tarPage - 1 >= 0 ? tarPage - 1 : childCount - 1;
                // 页内跳转如果跳转页面是当前页下一页 则不再初始化当前页动画状态
                curPrePage == curPage && (curPrePage = '');
            }
            switch (flipAniType) {
            case 'normal':
            case 'scale':
                //下一页初始化
                isNaN(curNextPage) || $(childrenArray[curNextPage]).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(100%)',
                    'transform': cssDirection + '(100%)',
                });
                //上一页初始化
                isNaN(curPrePage) || $(childrenArray[curPrePage]).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(-100%)',
                    'transform': cssDirection + '(-100%)',
                });
                break;
            case 'cover':
                //下一页初始化
                isNaN(curNextPage) || $(childrenArray[curNextPage]).css({
                    opacity: 0,
                    transform: cssDirection + '(100%)',
                    '-webkit-transform': cssDirection + '(100%)',
                    'z-index': 10,
                });
                //上一页初始化
                isNaN(curPrePage) || $(childrenArray[curPrePage]).css({
                    opacity: 0,
                    transform: cssDirection + '(0)',
                    '-webkit-transform': cssDirection + '(0)',
                    'z-index': 10,
                });
                break;
            case 'cube':
                var rotateDeg = rotateDirection == 'rotateY' ? 90 : -90;
                //下一页初始化
                isNaN(curNextPage) || $(childrenArray[curNextPage]).css({
                    opacity: 0,
                    '-webkit-transform': rotateDirection + '(' + rotateDeg + 'deg) ' + cssDirection + '(50%) translateZ(' + _translatez + 'px)',
                    'transform': rotateDirection + '(' + rotateDeg + 'deg) ' + cssDirection + '(50%) translateZ(' + _translatez + 'px)',
                });
                //上一页初始化
                isNaN(curPrePage) || $(childrenArray[curPrePage]).css({
                    opacity: 0,
                    '-webkit-transform': rotateDirection + '(' + (-rotateDeg) + 'deg) ' + cssDirection + '(-50%) translateZ(' + _translatez + 'px)',
                    'transform': rotateDirection + '(' + (-rotateDeg) + 'deg) ' + cssDirection + '(-50%) translateZ(' + _translatez + 'px)',
                });
                break;
            case 'rotate':
                //下一页初始化
                isNaN(curNextPage) || $(childrenArray[curNextPage]).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(100%) translateZ(-1000px) rotateZ(180deg)',
                    'transform': cssDirection + '(100%) translateZ(-1000px) rotateZ(180deg)',
                    'z-index': 9
                });
                //上一页初始化
                isNaN(curPrePage) || $(childrenArray[curPrePage]).css({
                    opacity: 0,
                    '-webkit-transform': cssDirection + '(-100%) translateZ(-1000px) rotateZ(180deg)',
                    'transform': cssDirection + '(-100%) translateZ(-1000px) rotateZ(180deg)',
                    'z-index': 9
                });
                break;
            case 'card':
                //下一页位置
                var rotateDeg = rotateDirection == 'rotateY' ? 180 : -180;
                isNaN(curNextPage) || $(childrenArray[curNextPage]).css({
                    opacity: 0,
                    '-webkit-transform': rotateDirection + '(' + rotateDeg + 'deg)',
                    'transform': rotateDirection + '(' + rotateDeg + 'deg)'
                });
                //上一页初始化
                isNaN(curPrePage) || $(childrenArray[curPrePage]).css({
                    opacity: 0,
                    '-webkit-transform': rotateDirection + '(-' + rotateDeg + 'deg)',
                    'transform': rotateDirection + '(-' + rotateDeg + 'deg)'
                });
                break;
            case 'cutcard':
                break;
            case 'falldown':
                break;
            case 'fadeInOut':
                break;
            }
        }
        function FlipPageIns() {
            this.setNearbyPageAni = setNearbyPageAni;
            this.autoTurnPageFn = autoTurnPageFn;
            this.flipNext = flipNext;
            this.flipPrev = flipPrev;
        }
        return new FlipPageIns();
    }
    // })(Zepto);
});
$.fn.gesture = function(func) {
    var isiphone = ('ontouchstart'in window)
      , eventArr = isiphone ? ["touchstart", "touchend"] : ["mousedown", "mouseup"]
      , sP = {
        x: 0,
        y: 0
    }
      , eP = {
        x: 0,
        y: 0
    };
    this.on(eventArr[0], function(event) {
        if (isiphone) {
            sP.x = event.originalEvent.touches[0].clientX;
            //jquery
            sP.y = event.originalEvent.touches[0].clientY;
            // sP.x = event.touches[0].clientX;   //zepto
            // sP.y = event.touches[0].clientY;
        } else {
            sP.x = event.clientX;
            sP.y = event.clientY;
        }
        // event.stopPropagation();
    }).on(eventArr[1], function(event) {
        if (isiphone) {
            eP.x = event.originalEvent.changedTouches[0].clientX;
            //jquery
            eP.y = event.originalEvent.changedTouches[0].clientY;
            // eP.x = event.changedTouches[0].clientX;   //zepto
            // eP.y = event.changedTouches[0].clientY;
        } else {
            eP.x = event.clientX;
            eP.y = event.clientY;
        }
        if (calculateTouchesDistance(sP, eP) < 25) {
            return;
        }
        var dir = calculateDirection(sP, eP);
        func && func(event, dir);
    });
    function calculateTouchesDistance(startPoint, endPoint) {
        var diffX = Math.abs(startPoint.x - endPoint.x);
        var diffY = Math.abs(startPoint.y - endPoint.y);
        return Math.round(Math.sqrt(diffX * diffX + diffY * diffY));
    }
    function calculateAngle(startPoint, endPoint) {
        var x = startPoint.x - endPoint.x;
        var y = endPoint.y - startPoint.y;
        var r = Math.atan2(y, x);
        //radians
        var angle = Math.round(r * 180 / Math.PI);
        //degrees
        //ensure value is positive
        if (angle < 0) {
            angle = 360 - Math.abs(angle);
        }
        return angle;
    }
    function calculateDirection(startPoint, endPoint) {
        var angle = calculateAngle(startPoint, endPoint);
        if ((angle <= 45) && (angle >= 0)) {
            return "Left";
        } else if ((angle <= 360) && (angle >= 315)) {
            return "Left";
        } else if ((angle >= 135) && (angle <= 225)) {
            return "Right";
        } else if ((angle > 45) && (angle < 135)) {
            return "Down";
        } else {
            return "Up";
        }
    }
}
// 配置页面微信接口
var configWxSDK = function() {
    $.ajax({
        url: 'http://www.zhichiwangluo.com/index.php?r=Share/appJsConfig',
        type: 'get',
        data: null ,
        dataType: 'json',
        success: function(data) {
            if (data.status === 0) {
                wx.config({
                    debug: false,
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId,
                    // 必填，公众号的唯一标识
                    timestamp: data.timestamp,
                    // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr,
                    // 必填，生成签名的随机串
                    signature: data.signature,
                    // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareAppMessage', 'openLocation']// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        }
    });
}
;
//微信分享设置
var configWxShare = function(data) {
    wx.onMenuShareTimeline({
        title: data.title,
        // 分享标题
        link: data.link,
        // 分享链接
        //imgUrl: data.imgUrl, // 分享图标
        imgUrl: data.imgUrl,
        // 分享图标
        type: data.type || '',
        // 分享类型,music、video或link，不填默认为link
        dataUrl: data.dataUrl || '',
        // 如果type是music或video，则要提供数据链接，默认为空
        success: function(msg) {
            // 用户确认分享后执行的回调函数
            $.isFunction(data.success) && data.success();
        },
        cancel: function(msg) {
            // 用户取消分享后执行的回调函数
            $.isFunction(data.cancel) && data.cancel();
        },
        fail: function(msg) {
            console.log(msg);
        }
    });
    wx.onMenuShareAppMessage({
        title: data.title,
        // 分享标题
        desc: data.desc,
        // 分享描述
        link: data.link,
        // 分享链接
        imgUrl: data.imgUrl,
        // 分享图标
        type: data.type || '',
        // 分享类型,music、video或link，不填默认为link
        dataUrl: data.dataUrl || '',
        // 如果type是music或video，则要提供数据链接，默认为空
        success: function(msg) {
            // 用户确认分享后执行的回调函数
            $.isFunction(data.success) && data.success();
        },
        cancel: function(msg) {
            // 用户取消分享后执行的回调函数
            $.isFunction(data.cancel) && data.cancel();
        },
        fail: function(msg) {
            console.log(msg);
        }
    });
    wx.onMenuShareQQ({
        title: data.title,
        // 分享标题
        desc: data.desc,
        // 分享描述
        link: data.link,
        // 分享链接
        imgUrl: data.imgUrl,
        // 分享图标
        success: function() {
            $.isFunction(data.success) && data.success();
        },
        cancel: function() {
            $.isFunction(data.cancel) && data.cancel();
        },
        fail: function(msg) {
            console.log(msg);
        }
    });
}
;
// 调用微信地图
var OpenWeixinMap = function(data) {
    var lat = +data.lat
      , lng = +data.lng
      , address = data.address;
    wx.openLocation({
        latitude: lat,
        longitude: lng,
        name: '',
        address: address,
        scale: 13,
        infoUrl: 'http://weixin.qq.com'
    });
}
// 取URL参数
var GetQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null )
        return unescape(r[2]);
    return null ;
}
function click_focus() {
    // var obj = {
    //     id: 'gh_18e0fff7569c',
    //     url: 'http://img.weiye.me/zcimgdir/album/file_55dbf77b6f476.jpg',
    // }
    // oneKey(obj).Event();
    var useragent = navigator.userAgent;
    if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
        // 这里警告框会阻塞当前页面继续加载
        alert('已禁止本次访问：微信搜索"活动汇"在微信菜单中访问！');
        // 以下代码是用javascript强行关闭当前页面
        var opened = window.open('http://mp.weixin.qq.com/s?__biz=MzA4NTExNjk5Ng==&mid=209792047&idx=1&sn=620735142c44f8a34307304e4765e745&scene=0#rd', '_self');
        opened.opener = null ;
        opened.close();
    }
    // var browser = {
    // 	versions: function() {
    // 		var u = navigator.userAgent,
    // 			app = navigator.appVersion;
    // 		return { //移动终端浏览器版本信息
    // 			ios: !! u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    // 			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
    // 			iPad: u.indexOf('iPad') > -1, //是否iPad
    // 		};
    // 	}(),
    // }
    // var wechat_info = useragent.match(/MicroMessenger\/([\d\.]+)/i);
    // if(browser.versions.iPhone || browser.versions.iPad || browser.versions.ios){
    // ios系统
    window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA4NTExNjk5Ng==&mid=209792047&idx=1&sn=620735142c44f8a34307304e4765e745&scene=0";
    // } else {
    // android系统
    // window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&username=gh_18e0fff7569c&sn=5cfafb3bfc9ce16e7792f236bf843c52&scene=1&uin=ODc3MjI2ODA%3D&key=ac89cba618d2d976961100f3489a077068c672fbc5b63049f3d7924aa0c6da07e14fe30415d32b9c9ac23138ebdb21a9&devicetype=webwx&version=70000001&lang=en&pass_ticket=ATGvAmc95iew6HQ5saFD%2Bn7SD1hiMVvRfqlHgOqKkY4%3D";
    // }
    // if (wechat_info && wechat_info[1] < '6.2'){
    // //微信6.2以下版本
    //   if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
    //   // 如果是ios系统
    //       window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA4NTExNjk5Ng==&mid=209792047&idx=1&sn=620735142c44f8a34307304e4765e745&scene=0";
    //   } else {
    //   // android系统
    //       window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&username=gh_18e0fff7569c&sn=5cfafb3bfc9ce16e7792f236bf843c52&scene=1&uin=ODc3MjI2ODA%3D&key=ac89cba618d2d976961100f3489a077068c672fbc5b63049f3d7924aa0c6da07e14fe30415d32b9c9ac23138ebdb21a9&devicetype=webwx&version=70000001&lang=en&pass_ticket=ATGvAmc95iew6HQ5saFD%2Bn7SD1hiMVvRfqlHgOqKkY4%3D";
    //   }
    // } else {
    //   //微信6.2及以上版本
    //   window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA4NTExNjk5Ng==&mid=209792047&idx=1&sn=620735142c44f8a34307304e4765e745&scene=0";
    // }
}
//数组对象
function objectLength(object) {
    var num = 0;
    for (var i in object) {
        if (i != "undefined") {
            num++;
        }
    }
    return num;
}
function getFirstObject(object) {
    var index = 0;
    for (var i in object) {
        if (i != 'undefined') {
            return object[i];
        }
    }
}
function asyLoadScript(filename, fileType, callback) {
    var container = document.getElementsByTagName('body')[0];
    var node;
    if (fileType == "js") {
        var oJs = document.createElement('script');
        oJs.setAttribute("type", "text/javascript");
        oJs.setAttribute("src", filename);
        //文件的地址 ,可为绝对及相对路径
        container.appendChild(oJs);
        //绑定
        node = oJs;
    } else if (fileType == "css") {
        var oCss = document.createElement("link");
        oCss.setAttribute("rel", "stylesheet");
        oCss.setAttribute("type", "text/css");
        oCss.setAttribute("href", filename);
        container.appendChild(oCss);
        //绑定
        node = oCss;
    }
    node.onload = function() {
        $.isFunction(callback) && callback();
    }
}
// 提示框组件 author: anle
// (function($){
$.tooltip = function(ops) {
    var ops = $.extend({
        html: '',
        delay: 2000,
        callback: null
    }, ops);
    var obj = null
      , text = ops.html
      , html = '<div id="tool_tip" style="position:fixed; max-width:60%; z-index:9999; top:0;' + ' left:0; opacity:1; padding:30px 40px; background:rgba(0,0,0,0.7);' + 'color:#fff; border-radius:8px; text-align:center; font-size:18px; font-weight:bold">' + text + '</div>';
    $('#tool_tip').remove();
    obj = $(html).appendTo('body');
    obj.css({
        'margin-left': '-' + obj[0].offsetWidth / 2 + 'px',
        'margin-top': '-' + obj[0].offsetHeight / 2 + 'px',
        left: '50%',
        top: '50%'
    });
    setTimeout(function() {
        obj.animate({
            opacity: 0
        }, 500, 'linear', function() {
            obj.remove();
            $.isFunction(ops.callback) && ops.callback();
        });
    }, ops.delay);
}
;
$.isEmptyObject = function(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
;
// })(Zepto);
//弹默认提示框
function alertTip(html, callback, delay) {
    $.tooltip({
        'html': html || '',
        'delay': delay || 2000,
        'callback': callback || null
    });
}
;// 展示loading
function showLoading() {
    // var $loading = $('<div id="loading_logo"><div class="double-bounce1"></div>'
    //              + '<div class="double-bounce2"></div></div>');
    var loading = '<div id="loading_logo"><div class="spinner-container container1">' + '<div class="circle1"></div><div class="circle2"></div>' + '<div class="circle3"></div><div class="circle4"></div></div>' + '<div class="spinner-container container2"><div class="circle1"></div>' + '<div class="circle2"></div><div class="circle3"></div>' + '<div class="circle4"></div></div><div class="spinner-container container3">' + '<div class="circle1"></div><div class="circle2"></div><div class="circle3"></div>' + '<div class="circle4"></div></div></div>';
    $('body').append(loading);
}
// 移除loading
function removeLoading() {
    $('#loading_logo') && $('#loading_logo').remove();
}
//请求error提示框
function requestErrorTip() {
    $.tooltip({
        html: '请求异常'
    });
}
// 请求超时提示框
function requestTimeoutTip() {
    $.tooltip({
        html: '网络状况可能不太好喔'
    });
}
// 封装ajax请求
function $ajax(url, type, data, dataType, success, error) {
    removeLoading();
    showLoading();
    $.ajax({
        url: url,
        type: type || 'get',
        data: data || {},
        timeout: 30000,
        dataType: 'json',
        success: function(data) {
            removeLoading();
            $.isFunction(success) && success(data);
        },
        error: function(xhr, errorType, error) {
            removeLoading();
            if (errorType === 'timeout') {
                requestTimeoutTip();
            } else {
                requestErrorTip();
            }
            $.isFunction(error) && error(xhr, errorType, error);
        }
    });
}
// 固定body 禁止滚动
function fixbody() {
    $('body').attr({
        'ontouchmove': 'return false',
        'onmousewheel': 'return false'
    });
}
;// 恢复body滚动
function relievebody() {
    $('body').attr({
        'ontouchmove': '',
        'onmousewheel': ''
    });
}
;
