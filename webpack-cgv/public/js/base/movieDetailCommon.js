//'use strict';
window.clickMult = {
    at : true,
    url : "",
    data : {},
    init : function () {
        this.at = true;
        this.url = "";
        this.data = {};
    }
};

$.ajaxCgv = function (options) {
    var setting = $.extend({
        url : "",
        type : "POST",
        method : "POST",
        contentType : "application/json; charset=UTF-8",
        dataType : "json",
        secure : "N",
        data : {},
        processData : true,
        async : true,
        cache : true,
        global : true,
        jsonp : null,
        jsonpCallback : null,
        complete : null,
        success : null,
        error : null,
        clickMultChk : false,
        delayYn : false,
        delayTime : 300
    }, options);

    if (setting.clickMultChk) {
        if (clickMult.at || clickMult.url != setting.url || setting.data != clickMult.data) {
            clickMult.at = false;
            clickMult.url = setting.url;
            clickMult.data = setting.data;
            setTimeout(clickMult.init, 3 * 1000);
        } else {
            return;
        }
    }

    if (setting.delayYn) {
        setTimeout(function () {
            $.ajax(setting);
        }, setting.delayTime);
    } else {
        $.ajax(setting);
    }

}
$.submitCgv = function (options, data) {
    var setting = {};
    if (typeof options == 'string') {
        setting = {
            url : options,
            data : data,
            method : "POST",
            target : "_self"
        };
    } else if (typeof options == 'object') {
        var setting = $.extend({
            url : "",
            data : {},
            method : "POST",
            target : "_self"
        }, options);
    } else {
        return false;
    }

    if (setting.url) {
        var inputs = Object.mapToInput(setting.data);
        $('<form action="' + setting.url + '" method="' + (setting.method || 'POST') + '" target="' + setting.target + '">' + inputs + '</form>').appendTo('body').submit().remove();
    }
};

window.GaObject = {};
GaObject.selectDupYn = true;
GaObject.selectObject = [];
GaObject.objEvent = {};
GaObject.objIndex = 0;
GaObject.addCgvGaKey = function () {
    return "cgvGaKey" + String(GaObject.objIndex++).padStart(10, "0");
};
GaObject.getCgvGaKey = function ($_obj) {
    return $_obj.closest("[cgvGaKey]").attr("cgvGaKey");
}
GaObject.newCgvGaKey = function ($_obj) {
    $_obj.attr("cgvGaKey", GaObject.addCgvGaKey());
}
GaObject.delCgvGaKey = function ($_obj) {
    $_obj.removeAttr("cgvGaKey").off("click");
}
GaObject.sendLog = function ($_obj, eventFnStr, loginCheckYn, actionGbn, eventLogObject, fnSendLog) {
    $_obj.each(function (i, o) {
        if ((loginCheckYn == "N" || IsLogin) && !GaObject.getCgvGaKey($(o))) {
            eventFnStr = eventFnStr + ".gaFn";
            var cgvGaKey = GaObject.addCgvGaKey();
            $(o).attr("cgvGaKey", cgvGaKey);
            $(o).off(eventFnStr).on(eventFnStr, function () {
                // $("body").on(eventFnStr,"[cgvGaKey='" + cgvGaKey + "']",function(){
                if (GaObject.selectDupYn) {
                    var _this = event.target;
                    var cgvGaKey = GaObject.getCgvGaKey($(_this));
                    var eventLabel = "";
                    if (GaObject.selectObject.indexOf(cgvGaKey) < 0) {
                        GaObject.selectObject.push(cgvGaKey);
                        if (actionGbn == "movieOfficials") {
                            eventLabel = movieGroupTitle + "_" + $(_this).closest("li").find("a strong").text().trim();
                        } else if (actionGbn == "relateMovieInfo") {
                            eventLabel = $(_this).parents("ul.fp_relatedMoviesView_list").find("li a strong").text().trim();
                        } else if (actionGbn == "movieContent") {
                            var $_obj = $(_this).parents("li.contentClass").children("div.reptxt").clone();
                            $_obj.find("span.temp_txt,a.more").remove();
                            eventLabel = movieGroupTitle + "/" + $_obj.text().trim().getContentRp().substr(0, 20);
                        } else if (actionGbn == "openContent") {
                            var $_obj = $(_this).parents("div.cover_list").children("div.reptxt").clone();
                            $_obj.find("span.temp_txt,a.more").remove();
                            eventLabel = movieGroupTitle + "/" + $_obj.text().trim().getContentRp().substr(0, 20);
                        } else {
                            eventLabel = movieGroupTitle;
                        }
                        var eventCategory = null;
                        var eventAction = null;
                        if (typeof (eventLogObject) == "function") {
                            eventLabel = eventLogObject(event) || eventLabel;
                        }
                        if (typeof (eventLogObject) == "object") {
                            eventCategory = typeof (eventLogObject.getCategoryText) == "function" ? eventLogObject.getCategoryText(event) : null;
                            eventAction = typeof (eventLogObject.getActionText) == "function" ? eventLogObject.getActionText(event) : null;
                            eventLabel = typeof (eventLogObject.getLabelText) == "function" ? eventLogObject.getLabelText(event) : eventLabel;
                        }
                        fnSendLog(eventCategory, eventAction, eventLabel);
                    }
                }
            });
        }
    });
};
GaObject.setGaEventTag = function (p_eventAction, p_loginCheckYn, p_eventLogObject, p_checkEventFnStr) {
    var setting = {};
    if (typeof p_eventAction == 'string') {
        setting = {
            eventAction : p_eventAction || "",
            loginCheckYn : p_loginCheckYn || "N",
            checkEventFnStr : p_checkEventFnStr || "click",
            eventLogObject : p_eventLogObject || undefined
        };
    } else if (typeof p_eventAction == 'object') {
        var setting = $.extend({
            eventAction : "",
            loginCheckYn : "N",
            checkEventFnStr : "click",
            eventLogObject : undefined
        }, p_eventAction);
    } else {
        return false;
    }
    var eventActionList = setting.eventAction.split(",");
    var loginCheckYnList = setting.loginCheckYn.split(",");
    var checkEventFnStrList = setting.checkEventFnStr.split(",");
    var loginCheckYnAll = (loginCheckYnList.length == eventActionList.length) ? "N" : loginCheckYnList[0];
    var checkEventFnStrAll = (checkEventFnStrList.length == eventActionList.length) ? "" : "click";
    var eventCategory = (AppVersion_Master >= 448) ? "MA_팬페이지" : "MW_팬페이지";

    $.each(eventActionList, function (i, actionGbn) {
        var $_obj = null;
        var eventLabel = null;
        var eventLabelGbn = "";
        var eventAction = "";
        var loginCheckYn = (loginCheckYnAll != "N" ? loginCheckYnAll : loginCheckYnList[i] || loginCheckYnAll);
        var eventFnStr = (checkEventFnStrAll == "click" ? "click" : checkEventFnStrList[i]);

        if (actionGbn == 'mainTab') {
            $_obj = $('[data-tab] li');
            eventLabelGbn = "movieInfo";
            eventAction = "";
        } else if (actionGbn == 'mainEvent') {
            $_obj = $("ul.fp_event li a");
            eventLabelGbn = "movieInfo";
            eventAction = "이벤트 배너";
        } else if (actionGbn == 'mainMovieWrite') {
            $_obj = $("div.actualAudience a.btn_audienceWrite");
            eventLabelGbn = "movieInfo";
            eventAction = "실관람객 관람평 작성";
        } else if (actionGbn == 'movieOfficials') {
            $_obj = $("ul.fp_movieOfficials_list li a");
            eventLabelGbn = "movieOfficials";
            eventAction = "상세정보_감독/배우";
        } else if (actionGbn == 'movieInfoTrailer') {
            $_obj = $("ul.fp_trailer_list li a");
            eventLabelGbn = "movieInfo";
            eventAction = "상세정보_트레일러";
        } else if (actionGbn == 'movieInfoBanner') { // 처리 할수 없음.
            $_obj = $("div#movieInfoBanner");
            eventLabelGbn = "movieInfo";
            eventAction = "상세정보_광고 배너";
        } else if (actionGbn == 'movieInfoStillCut') {
            $_obj = $("div.movie_gallery ul li");
            eventLabelGbn = "movieInfo";
            eventAction = "상세정보_포스터/스틸컷";
        } else if (actionGbn == 'relatedMoviesView') {
            $_obj = $("ul.fp_relatedMoviesView_list li")
            eventLabelGbn = "relateMovieInfo";
            eventAction = "상세정보_관련영화";
            // var relatedMoviesTitle = $(event.target).parents("ul.fp_relatedMoviesView_list").find("li a strong").text().trim();
        } else if (actionGbn == 'movieInfoWish') {
            $_obj = $("a.btn_fp_expect")
            eventLabelGbn = "movieInfo";
            eventAction = "플로팅버튼";
            eventLabel = movieGroupTitle + "_찜하기";
        } else if (actionGbn == 'movieInfoShare') {
            $_obj = $("a.btn_fp_share")
            eventLabelGbn = "movieInfo";
            eventAction = "플로팅버튼";
            eventLabel = movieGroupTitle + "_공유하기";
        } else if (actionGbn == 'movieInfoTicketing') {
            $_obj = $("a.btn_bookNow");
            eventLabelGbn = "movieInfo";
            eventAction = "플로팅버튼";
            eventLabel = movieGroupTitle + "_지금예매";
        } else if (actionGbn == 'movieContentImageView') {
            $_obj = $("div.cover_list ul li div.cover_img.player a,div.cover_list ul li div.cover_img.player a .btn_fullsize");
            eventLabelGbn = "movieContent";
            eventAction = "관련소식_이미지보기";
        } else if (actionGbn == 'movieContentDetail') {
            $_obj = $("div.cover_list ul li div.detail_btn_area a.btn_reply");
            eventLabelGbn = "movieContent";
            eventAction = "관련소식_반응보기";
        } else if (actionGbn == 'movieContentGood') { // 로그인.
            $_obj = $("div.cover_list ul li div.detail_btn_area a.btn_like");
            eventLabelGbn = "movieContent";
            eventAction = "관련소식_좋아요";
        } else if (actionGbn == 'movieContentComment') { // 로그인. -- 디자인에서 없어짐
            $_obj = $("div.cover_list ul li div.cover_btn_list li.contentComment a");
            eventLabelGbn = "movieContent";
            eventAction = "관련소식_댓글달기";
        } else if (actionGbn == 'movieContentOpt') {
            $_obj = $("div.cover_list ul li div.detail_btn_area a.btn_share");
            eventLabelGbn = "movieContent";
            eventAction = "관련소식_공유하기";
        } else if (actionGbn == 'openContentImageView') {
            $_obj = $("div.cover_list div.cover_img.player a,div.cover_list div.cover_img.player a .btn_fullsize");
            eventLabelGbn = "openContent";
            eventAction = "관련소식_이미지보기";
        } else if (actionGbn == 'openContentGood') { // 로그인.
            $_obj = $("div.fp_contbox div.detail_btn_area a.btn_like");
            eventLabelGbn = "openContent";
            eventAction = "관련소식_좋아요";
        } else if (actionGbn == 'openContentComment') { // 로그인.
            $_obj = $("div.fp_contbox div.actualReview_wrap a");
            eventLabelGbn = "openContent";
            eventAction = "관련소식_댓글달기";
        } else if (actionGbn == 'openContentOpt') {
            $_obj = $("div.fp_contbox div.detail_btn_area a.btn_share");
            eventLabelGbn = "openContent";
            eventAction = "관련소식_공유하기";
        } else if (actionGbn == 'moveCommentWrite') {
            $_obj = $("div.actualReview_wrap a.btn_actualReview");
            eventLabelGbn = "movieComment";
            eventAction = "실관람평_등록하기";
        } else if (actionGbn == 'movieCommentOrder') {
            $_obj = $("div.fp_comment_filterBtn_wrap a.btn_filter.type1");
            eventLabelGbn = "movieComment";
            eventAction = "실관람평_최신순";
        } else if (actionGbn == 'movieCommentFilter') {
            $_obj = $("div.fp_comment_filterBtn_wrap a.btn_filter.type2");
            eventLabelGbn = "movieComment";
            eventAction = "실관람평_전체";
        } else if (actionGbn == 'movieCommentGood') {
            $_obj = $('ul.fp_comment_list li[comment_idx] div.com_checkbox_comment_heart input');
            eventLabelGbn = "movieComment";
            eventAction = "실관람평_공감";
        } else if (actionGbn == 'movieCommentReply') {
            $_obj = $('ul.fp_comment_list li[comment_idx] a.btn_comment');
            eventLabelGbn = "movieComment";
            eventAction = "실관람평_댓글";
        } else if (actionGbn == 'movieCommentReplyView') {
            $_obj = $('ul.fp_comment_list li[comment_idx] a.btn_reply');
            eventLabelGbn = "movieComment";
            eventAction = "실관람평_대댓글보기";
        }
        if (typeof (setting.eventLogObject) == "object") {
            eventCategory = (typeof (setting.eventLogObject.eventCategory) == "string" ? setting.eventLogObject.eventCategory : null) || eventCategory;
            eventAction = (typeof (setting.eventLogObject.eventAction) == "string" ? setting.eventLogObject.eventAction : null) || eventAction;
            eventLabel = (typeof (setting.eventLogObject.eventLabel) == "string" ? setting.eventLogObject.eventLabel : null) || eventLabel;
        }
        GaObject.sendLog($_obj, eventFnStr, loginCheckYn, eventLabelGbn, setting.eventLogObject, function (p_eventCategory, p_eventAction, p_eventLabel) {
            fnSendGALog("1", "", p_eventCategory || eventCategory, p_eventAction || eventAction, eventLabel || p_eventLabel);
        });
    });
};

window.cgvAnimatePlay = function (options, stepFn, duration) {
    var setting = {};
    if (typeof options == 'number') {
        setting = {
            min : 0,
            max : options,
            duration : duration || 1000,
            stepFn : stepFn,
            compFn : stepFn
        };
    } else if (typeof options == 'object') {
        setting = $.extend({
            min : 0,
            max : 100,
            duration : 1000,
            stepFn : null,
            compFn : null
        }, options);

    } else {
        stepFn(options, duration);
        return false;
    }
    if (setting.compFn == null && setting.stepFn == null) {
        return false;
    } else {
        if (setting.compFn == null) {
            setting.compFn = setting.stepFn;
        } else if (setting.stepFn == null) {
            setting.stepFn = setting.compFn;
        }
    }
    $({
        val : setting.min
    }).animate({
        val : setting.max
    }, {
        duration : setting.duration,
        step : function (now, fx) {
            setting.stepFn(Math.floor(now), fx);
        },
        complete : function () {
            setting.compFn(setting.max);
        }

    });
};

window.chartsOption = function (graphs_lineColor) {
    graphs_lineColor = graphs_lineColor || "#FB4357";
    return {
        "valueAxes" : [ {
            "axisTitleOffset" : 5,
            "minimum" : 0,
            "maximum" : 100,
            "axisAlpha" : 0.15,
            "unitPosition" : "right",
            "gridColor" : "#000000",
            "autoGridCount" : false,
            "gridCount" : 5,
            "labelsEnabled" : false,
            "tickLength" : 1
        } ],
        "guides" : [ {
            "fillAlpha" : 0.10,
            "value" : 0,
            "toValue" : 10,
            "color" : "#060"
        } ],
        "balloon" : {
            "enabled" : false
        },
        "startDuration" : 0,
        "graphs" : [ {
            "bullet" : "round",
            "bulletSize" : 5,
            "bulletBorderAlpha" : "1",
            "bulletBorderColor" : "rgb(255,255,255)",
            "bulletBorderThickness" : "1",
            "lineThickness" : 1,
            "lineColor" : graphs_lineColor,
            "fillAlphas" : 0.1,
            "valueField" : "value",
            "lineColorField" : "color"
        } ],
        "categoryField" : "key",
        "export" : {
            "enabled" : false
        },
        "autoResize" : false,
        "color" : "rgb(22,22,22)",
        "fontSize" : 10,
        "fontFamily" : "Helvetica",
        "tapToActivate" : false,
        "rollOverGraphItem" : function () {
            console.log('rollOverGraphItem');
        },
        "chartCursor" : {
            "bulletSize" : 3
        }
    };
}

window.makeChart = function (objName, objDataArray, lineColor, lineArrayColor) {
    lineArrayColor = lineArrayColor || [ "rgb(255,133,179)", "rgb(254,196,70)", "rgb(142,189,255)", "rgb(100,169,178)", "rgb(178,103,183)" ];
    var dataProvider = [];
    objDataArray.forEach(function (o, i) {
        dataProvider.push({
            "key" : o.key,
            "value" : o.value,
            "color" : lineArrayColor[i],
            "rollOverColor" : "rgb(0,0,0)",
            "selectedColor" : "rgb(0,0,0)"
        });
    });
    var option = new chartsOption(lineColor);
    return AmCharts.makeChart(objName, $.extend({
        "type" : "radar",
        "radius" : "28%",
        "dataProvider" : dataProvider
    }, option));
};

window.FileObject = window.FileObject || {};
FileObject = (function () {
    var self = undefined, $_itemFile = undefined, $_itemList = undefined, fnAddFileHtml = "", popFileId = "";
    return {
        fileMap : new Map(),
        init : function ($_fileObject, $_listObject, p_fnAddFileHtml, p_getOldFileUrlID) {
            self = this;
            $_fileObject = $_fileObject || $("#itemFile");
            $_listObject = $_listObject || $("#itemList");
            p_getOldFileUrlID = p_getOldFileUrlID || "div#popCommentReplyWrite.popup_dim";
            if (typeof ($_fileObject) == "string") {
                self.$_itemFile = $($_fileObject);
                self.$_itemList = $($_listObject);
                self.fnAddFileHtml = p_fnAddFileHtml;
                self.popFileId = p_getOldFileUrlID;
            } else if (typeof ($_fileObject) == "object") {
                if (typeof ($_listObject) == "undefined") {
                    self.$_itemFile = $_fileObject.itemFile;
                    self.$_itemList = $_fileObject.itemList;
                    self.fnAddFileHtml = $_fileObject.fnAddFileHtml;
                    self.popFileId = $_fileObject.getOldFileUrlID;
                } else {
                    self.$_itemFile = $_fileObject;
                    self.$_itemList = $_listObject;
                    self.fnAddFileHtml = p_fnAddFileHtml;
                    self.popFileId = p_getOldFileUrlID;
                }
            }
        },
        clearItemFile : function (obj) {
            if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                // Explorer 일때
                $(obj).replaceWith($(obj).clone(true));
            } else {
                // 기타 Browser 일때
                $(obj).val("");
            }
        },
        setFileToMap : function (file) {
            self.fileMap = new Map();
            var attachKeyDate = new Date();
            var attachKey = attachKeyDate.format("yyyyMMddHHmmss") + attachKeyDate.getMilliseconds();
            self.fileMap.put(attachKey, file);
            return attachKey;
        },
        getFileFromMap : function (key) {
            return self.fileMap.get(key);
        },
        registedImgs : function (className) {
            className = className || "registed_list";
            setTimeout(function () {
                var $imgWrap = $('.' + className);
                $imgWrap.imagesLoaded(function () {
                    var _imgNum = $imgWrap.find('li').length;
                    for (var i = 0; i < _imgNum; i++) {
                        self.imgCheckRatio($imgWrap.find('li').eq(i).find('img'));
                    }
                });
            }, 400);
        },
        fnDelItem : function () {
            var $_btnObj = $(self.popFileId).find("button.btn_del");
            var itemIdx = 0;
            var imgCnt = $_btnObj.parent().find("img").length;
            itemIdx = $_btnObj.parent().find("img").attr("itemIdx");
            var addPlusYn = false;
            var vCnt = self.$_itemList.children().length;
            self.$_itemFile.attr('disabled', false); // 등록버튼 활성화
            $(self.popFileId).attr("old_file_url", "");
            var idx = $_btnObj.parent().index();
            $_btnObj.parent().parent().find("li").eq(idx).remove();
        },
        imgCheckRatio : function ($_obj) {
            var boxW = $_obj.parent().width();
            var boxH = $_obj.parent().height();
            var objW = $_obj.width();
            var objH = $_obj.height();
            if (objW > objH) {
                $_obj.parent().addClass('land');
            } else if (objW < objH) {
                $_obj.parent().addClass('port');
            } else {
                $_obj.parent().addClass('stretch');
            }
        },
        readyCommentReplayRegContentsEdit : function (gubun, oldFileUrl) {
            self.$_itemList.empty();
            self.clearItemFile(self.$_itemFile);
            if (gubun == 'R') {
                oldFileUrl = oldFileUrl || "";
                if (oldFileUrl != "") {
                    self.$_itemList.append(self.fnAddFileHtml(oldFileUrl, ""));
                }
            }
            self.fileMap = new Map();
            self.$_itemFile.off('change').on('change', self.fnCommentReplayRegAddAttachFile);
        },
        fnCommentReplayRegAddAttachFile : function () {
            var file = self.$_itemFile[0].files[0];
            if (file) {
                var fileKey = self.setFileToMap(file);
                if (fileKey == null) {
                    alert('파일 키를 찾을 수 없습니다.');
                    return;
                }
                self.$_itemList.html(self.fnAddFileHtml(URL.createObjectURL(file), fileKey));
                vCnt = self.$_itemList.children().length;
            }
            /* 이미지 비율 처리 */
            self.registedImgs();
            // 파일선택 항목 초기화
            self.clearItemFile(self.$_itemFile);
        },
        fnFileSelectBefore : function () {
            if (self.$_itemList.find("li img").length > 0) {
                if (!confirm("이미지는 한 개만 등록 가능합니다.\n이미지를 변경하시겠습니까?")) {
                    event.preventDefault();
                    return false;
                } else {
                    if ($("button.btn_del").length > 0) {
                        self.fnDelItem();
                        return false;
                    }
                }
            }
        }
    }
});

window.gfnGetCommentsCopy = function (copyText, class_name) {
    class_name = class_name || ".btn_copy";
    new Clipboard(class_name, {
        text : function (trigger) {
            return copyText;
        }
    });
};