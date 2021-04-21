//'use strict';
window.siteMapFn = siteMapFn;
function siteMapFn() {
    jQuery('#headerTitle').siblings('#siteMap').show();
    jQuery('#fogbg').show();
    jQuery("body").addClass("scrlOff");
}

window.close_sitemapFn = close_sitemapFn;
function close_sitemapFn() {
    jQuery('#fogbg').hide();
    jQuery('#headerTitle').siblings('#siteMap').hide();
    jQuery("body").removeClass("scrlOff");
}

jQuery(function ($) {
    $('[data-sitemap]').on({
        click : function (e) {
            var isSitemapState = $(this).data('sitemap') || false;
            if (isSitemapState) {
                $('#headerTitle').siblings('#siteMap').show();
                $('#fogbg').show();
                $("body").addClass("scrlOff");
            } else { // Close
                $('#fogbg').hide();
                $('#headerTitle').siblings('#siteMap').hide();
                $("body").removeClass("scrlOff");
            }
        }
    });

    $.fn.fnFooter = function (_target) {
        var target = jQuery(_target).parent('dt');
        if (!target.hasClass('active')) {
            target.siblings().slideDown(function () {
                target.addClass('active');
            });
        } else {
            target.siblings().slideUp(function () {
                target.removeClass('active');
            });
        }
    }
    /*
     * S 팝업 Description: 1. property 'data-popup-direction' 값에 따라 애니메이션 다름 - UP : bottom -> top - DOWN : top -> bottom - RIGHT : left -> right - LEFT : right -> left 2. property 'data-popup-depth' 값에 따라 2중 이상 팝업 처리가능
     *
     * 3. property 'data-popup-onclick' 값에 따라 onclick 이벤트로 팝업 open 사용가능 - data-popup-onclick = false (기본 false 세팅) onclick 삭제처리 - data-popup-onclick = true onclick 에 jQuery.fn.openPopup(this)에 처리
     *
     * 3. 팝업내 class 'btn_close', 'btnPopClose' 둘중 하나인경우 property 'data-popup-onclick' 값에 따라 onclick 이벤트로 팝업 close 사용가능 - data-popup-onclick = false (기본 false 세팅) onclick 삭제처리 - data-popup-onclick = true onclick 에 jQuery.fn.closePopup( popupID )에 처리
     *
     * 4. 수동으로 팝업 열기 처리 $.fn.openPopup( popupID, popupDir, popupDepth ); - popupID : 열고 싶은 팝업 아이디 - popupDir : 열고 싶은 팝업 방향 'UP', 'DOWN', 'RIGHT', 'LEFT', 'CENTER' - popupDepth : 팝업의 Depth (다중팝업일 경우 기존 팝업을 안닫고 열경우 설정)
     *
     * 5. 수동으로 팝업 닫기 처리 $.fn.closePopup( popupID )
     *
     * 6. Filter 의 경우 - data-popup-type="filter" 처리시 팝업의 텍스트 값이 필터버튼에 입력됨
     */
    $.setClosePopup = function (_target, _popupDir) {
        var _depth = _target.data('popup-depth') || null;
        _target.removeAttr('activePopup');

        if (_target.data('popup-depth') != null) {
            // console.log(_target, _popupDir)
            _target.css({
                'z-index' : Number(_target.css('zIndex')) - Number(_depth)
            });
        }

        switch (_popupDir) {
        case 'UP':
            _target.children('.popup').animate({
                bottom : '-100%'
            }, 300);
            break;
        case 'RIGHT':
            _target.children('.popup').animate({
                left : '-100%'
            }, 300);
            break;
        case 'DOWN':
            _target.children('.popup').animate({
                top : '-100%'
            }, 300);
            break;
        case 'LEFT':
            _target.children('.popup').animate({
                right : '-100%'
            }, 300);
            break;
        case 'CENTER':
            break;
        default:
            break;
        }

        _target.animate({
            opacity : '0'
        }, 300, function () {
            $(this).css({
                'top' : '-100%'
            });
            if ($('.popup_dim[activePopup]').length == 0) {
                $("body").removeClass("scrlOff");
            }
        });
    };

    $('[data-popup]').on({
        click : function (e) {
            var isOnclick = $(this).data('popupOnclick') || false;

            if (!isOnclick) {
                var popupTarget = $(this).data('popup') || null;
                var popupDir = $(this).attr('data-popup-direction') || null;
                var popupDepth = $(this).data('popup-depth') || null;
                $.fn.openPopup(popupTarget, popupDir, popupDepth);
            }
        }
    });

    $('.popup_dim').find('.btn_close, .btnPopClose').on('click', function (e) {
        e.stopPropagation();

        var isOnclick = $(this).data('popupOnclick') || false;
        if (!isOnclick) {
            var $target = jQuery(this).closest('.popup_dim');
            var popupDir = $target.attr('data-popup-direction') || null;

            $.setClosePopup($target, popupDir);

            var _type = $(this).data('type') || null;
            switch (_type) {
            case 'select':
                $('.' + this.id).addClass('active').siblings().removeClass('active');
                $('.' + this.id).parents('.select_area').addClass('selected');
                break;
            default:
                break;
            }
        }
    });

    $('.popup_dim').on('click', function (e) {
        var isOnclick = $(this).data('popupOnclick') || false;
        if (!isOnclick) {
            if (e.currentTarget === e.target) {
                var popupDir = $(this).attr('data-popup-direction');
                $.setClosePopup($(this), popupDir);
            }
        }
    });

    $.fn.closePopup = function (_targetId, _click) {
        var $target = $("#" + _targetId);
        var popupDir = $target.attr('data-popup-direction');
        var popupType = $target.attr('data-popup-type');
        if (popupType == 'filter') {
            if (_click != null) {
                $("[data-popup='" + _targetId + "']").text($(_click).text());
                $(_click).addClass('active').siblings().removeClass('active');
            }
        }
        $.setClosePopup($target, popupDir);
    };

    $.fn.openPopup = function (_target, _dir, _depth, _click) {
        var popupTarget = _target || null;
        var popupDir = _dir || null;
        var popupDepth = _depth || null;
        var popupBtn = _click || null;
        if (popupDepth != null) {
            $('#' + popupTarget).css({
                'z-index' : Number($('.popup_dim[activePopup]').css('zIndex') || $('#' + popupTarget).css('zIndex')) + Number(_depth)
            });
        }

        if (popupBtn != null) {
            var popupTitle = $(popupBtn).attr('data-popup-title') || null;
            if (popupTitle != null) {
                $('#' + popupTarget).find('.container_header h1').text(popupTitle);
            } else {
                $('#' + popupTarget).find('.container_header h1').text('');
            }
        }

        // $('#' + popupTarget).
        $('#' + popupTarget).css({ 'top' : '0' });
        $('#' + popupTarget).attr('data-popup-direction', popupDir);
        $('#' + popupTarget).attr('activePopup', 'Y');
        $('[data-popup="' + popupTarget + '"]').attr('data-popup-direction', popupDir);

        switch (popupDir) {
        case 'UP':
            $('#' + popupTarget).children('.popup').css({
                'position' : 'absolute',
                'top' : 'auto',
                'right' : '0',
                'bottom' : '-100vh',
                'left' : '0',
                'transform' : 'none'
            });
            $('#' + popupTarget).children('.popup').stop().animate({
                bottom : '0'
            }, 300);
            break;
        case 'RIGHT':
            $('#' + popupTarget).children('.popup').css({
                'position' : 'absoulte',
                'top' : 'auto',
                'right' : 'auto',
                'bottom' : 'auto',
                'left' : '-100vw',
                'transform' : 'none'
            });
            $('#' + popupTarget).children('.popup').animate({
                left : '0'
            }, 300);
            break;
        case 'DOWN':
            $('#' + popupTarget).children('.popup').css({
                'position' : 'absoulte',
                'top' : '-100vh',
                'right' : '0',
                'bottom' : 'auto',
                'left' : '0',
                'transform' : 'none'
            });
            $('#' + popupTarget).children('.popup').animate({
                top : '0'
            }, 300);
            break;
        case 'LEFT':
            $('#' + popupTarget).children('.popup').css({
                'position' : 'absoulte',
                'top' : 'auto',
                'right' : '-100vw',
                'bottom' : 'auto',
                'left' : 'auto',
                'transform' : 'none'
            });
            $('#' + popupTarget).children('.popup').animate({
                right : '0'
            }, 300);
            break;
        case 'CENTER':
        default: /* D 'transform':'translate(0, -50.2%)' 흐릿한 현상 해결을 위한 예외처리 */
            $('#' + popupTarget).children('.popup').css({
                'position:' : 'relative',
                'top' : '50%',
                'right' : '0',
                'bottom' : '0',
                'left' : '0',
                'transform' : 'translate(0, -50.2%)'
            });
            break;
        }

        if (popupDepth != null) { // 2Depth 이상 처리를 위한 값 세팅
            $('#' + popupTarget).attr('data-popup-depth', popupDepth);
        }

        $('#' + popupTarget).show().animate({
            opacity : '1'
        }, 300, function () {
            $("body").addClass("scrlOff");
        });
    };
    /* E 팝업 */

    /*
     * S Tab $('[data-tab]').on('click', function (e) { var target = e.target; if (target.tagName == "A") { var $btnTarget = $(target); var tabTarget = $(this).data('tab') || null; var currentIdx = $btnTarget.parent().index();
     *
     * $btnTarget.parent().addClass('active').siblings().removeClass('active');
     *
     * $('#' + tabTarget).children('li').eq(currentIdx).addClass('active').siblings().removeClass('active'); } }); E Tab
     */
    $('.tabSortMenu').on({
        click : function (e) {
            e.stopPropagation();
            var _target = e.target;
            var _tagName = _target.tagName;
            if (_tagName == 'A') {
                $(_target).parent().addClass('active').siblings().removeClass('active');

                var _property = $(_target).data('fn') || null;
                if (_property != null && typeof $.fn[_property] == 'function') {
                    $.fn[property]();
                }
            }
        }
    });

    $('[data-drop-menu]').on('click', function (e) {
        var $btnTarget = $(e.target);
        var dropTarget = $(this).data('dropMenu') || null;
        var $dropTarget = $('#' + dropTarget);
        var isHidden = $dropTarget.is(':hidden');
        if (isHidden) {
            $('html').animate({
                'scrollTop' : $btnTarget.offset().top - $('#header_box').outerHeight()
            });

            $dropTarget.slideDown(function () {
                $btnTarget.addClass('active');
            });
        } else {
            $dropTarget.slideUp(function () {
                $btnTarget.removeClass('active');
            });
        }
    });

    $('[data-drop-down-menu] a').on('click', function (e) {
        var $btnTarget = $(e.target);
        var $dropTarget = $btnTarget.parent('dt').next('dd');
        var isHidden = $btnTarget.parent('dt').hasClass('active');
        if (isHidden) {
            $('html').animate({
                'scrollTop' : $btnTarget.offset().top - $('#header_box').outerHeight()
            });

            $dropTarget.slideUp(function () {
                $btnTarget.parent('dt').removeClass('active');
            });
        } else {
            $dropTarget.slideDown(function () {
                $btnTarget.parent('dt').addClass('active');
            });
        }
    });

    $('[data-terms]').on({
        change : function (e) {
            var $target = $(e.target);
            var txtTermsType = $(this).data('terms');
            var txtTermsName = $(this).data('termsName');
            var isChecked = $(this).is(':checked');

            switch (txtTermsType) {
            case 'allChecker':
                $('[data-terms-name = ' + txtTermsName + ']').prop('checked', isChecked);
                $('[data-terms-name = ' + txtTermsName + '][data-terms = allChecker').attr('data-required', isChecked);
                break;
            case 'checker':
                var isRequired = $target.prop('required');
                var isAllChecked = $.fnAllChecker($('[data-terms-name = ' + txtTermsName + '][data-terms = ' + txtTermsType + ']'));

                if (isAllChecked) {
                    $('[data-terms-name = ' + txtTermsName + ']').prop('checked', isAllChecked);
                } else {
                    $('[data-terms-name = ' + txtTermsName + '][data-terms = allChecker]').prop('checked', isAllChecked);
                }

                if (isRequired) {
                    var isRequiredChecked = $.fnRequiredChecker($('[data-terms-name = ' + txtTermsName + '][data-terms = ' + txtTermsType + '][required]'));
                    $('[data-terms-name = ' + txtTermsName + '][data-terms = allChecker').attr('data-required', isRequiredChecked);
                }
                break;
            default:
                break;
            }
        }
    });

    $.fnAllChecker = function (obj) { // 전체 체크여부
        var totalLen = obj.length;
        var isState = totalLen;

        obj.each(function (idx) {
            if (obj.eq(idx).is(':checked')) {
            } else {
                isState--;
            }
        });
        return (totalLen == isState);
    }

    $.fnRequiredChecker = function (obj) {
        var totalLen = obj.length;
        var isState = totalLen;

        obj.each(function (idx) {
            if (obj.eq(idx).is(':checked')) {
            } else {
                isState--;
            }
        });
        return (totalLen == isState);
    }

    $('.wrap_radio_check input[type="radio"]').on({
        change : function (e) {
            var _activeOptType = $(e.target).data('optType');

            $(e.target).parents('.wrap_radio_check').removeClass('ispp_active norm_active inst_active spay_active nhcu_active');
            $(e.target).parents('.wrap_radio_check').addClass(_activeOptType + '_active');

            if ($(e.target).parents('.wrap_radio_check').next('.wrap_first_desc').children('li').hasClass(_activeOptType)) {
                $(e.target).parents('.wrap_radio_check').next('.wrap_first_desc').addClass('active');
            } else {
                $(e.target).parents('.wrap_radio_check').next('.wrap_first_desc').removeClass('active');
            }
        }
    });

    $.fn.maxLengthCheck = function (obj) {
        if (obj.value.length > obj.maxLength) {
            obj.value = obj.value.slice(0, obj.maxLength);
        }
    }

    $.fn.hiddenUi = function (obj) {
        var idx = obj.value.length;
        if (idx == 0) {
            $(obj).next('.hiddenTxtUi').find('li:not(.fixed)').removeClass('active')
        } else {
            $(obj).next('.hiddenTxtUi').find('li').eq(idx - 1).addClass('active').nextAll(':not(.fixed)').removeClass('active');
        }
    }
});