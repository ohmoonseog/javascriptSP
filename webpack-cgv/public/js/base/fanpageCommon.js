//'use strict';
/* 팬페이지 공통 기능. ChoiTH */
window.dragonChk = false;
window.naviAgent = window.navigator.userAgent;
// var isIPHONE = naviAgent.indexOf("iPhone") > 0 || naviAgent.indexOf("iPad") > 0;

// 사이트맵 열기. ChoiTH
window.fnSiteMap = function () {
    $("#fogbg").show();
    $("#siteMap").show();
}

// 사이트맵 닫기. ChoiTH
window.fnCloseSiteMap = function () {
    $("#siteMap").hide();
}

// 공유하기. ChoiTH
window.fnShareContents = function (cont, idx, movieIdx, $obj) {
    // 수정 Son.HW
    var url = ""
    if (idx == undefined) {
        url = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx;
    } else {
        url = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "_contentsIdx=" + idx);
    }

    if (idx == undefined) {
        addUrl = window.document.location.href;
    } else {
        addUrl = "contentsDetail?movieIdx=" + movieIdx + "&contentsIdx=" + idx;
    }
    var url = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent(addUrl);
    // var url = "http://devm.cgv.co.kr:8083/WebApp/Fanpage/Gateway.aspx?movieIdx="+strMovieIdx+"&fanpageReturnUrl="+window.document.location.href;
    $.ajax({
        method : "post",
        url : "/fanpage/shortURL",
        dataType : "json",
        data : {
            id : strUserId,
            realUrl : url
        },
        async : false,
        success : function (result) {
            url = result.resultData.shortUrl;
        },
        error : function () {
            alert("처리 중 에러가 발생했습니다.\n잠시 후에 다시 이용해 주세요;")
        }
    })

    // 팬페이지 공유하기일 경우
    if (cont == undefined || cont == '') {
        cont = movieGroupTitle;
        // 팬페이지 컨텐츠 공유하기일 경우
    } else {
        cont = cont.length > 20 ? cont.substr(0, 20) + "..." : cont;
        backgroundUrl = "";
        synopsis = "";
    }

    var stickerUrl = ""
    if (IsWebView_Master) {
        // 4.5.9ver 신규 공유하기 기능 추가
        if (AppVersion_Master >= 459) {
            stickerUrl = "http://img.cgv.co.kr/WebApp/images/common/cgv_logo_w.png";
            // 시놉시스 설정
            var synop = "";
            if (synopsis == undefined || synopsis == '') {
                synop = cont;
            } else {
                synop = synopsis;
            }

            if (backgroundUrl == '') {
                if ($('.cover_img').eq(0).find('img').attr('src') == undefined && $('.video_box video').attr('poster') == undefined) {
                    backgroundUrl = "";
                } else if ($('.cover_img').eq(0).find('img').attr('src') != undefined) {
                    backgroundUrl = $('.cover_img').eq(0).find('img').attr('src');
                } else {
                    backgroundUrl = $('.video_box video').attr('poster');
                }
            }
            CGVFanpageAppInterface.SendAppShareData(strMovieIdx, movieGroupTitle, synop, url, backgroundUrl, stickerUrl, 'movie');
        } else {
            CGVFanpageAppInterface.FanPageRequestSystemShare(strMovieIdx, cont, url);
        }
    }
}

// 영화등급 가져오기
window.fnReserveGrade = function (sGrade) {
    switch (sGrade) {
    case "230":
        return "03";
    case "231":
        return "02";
    case "232":
        return "01";
    case "233":
        return "04";
    case "919":
        return "99";
    }
    return "99";
}

// 예매하기.
window.fnReservation = function (rKind, sm_type, chkYn) {
    if (strMovieIdx == 81589 && dragonChk == false) {
        if (!confirm("선택하신 영화는 드래곤 길들이기 1편입니다.")) {
            var $layer = jQuery('#reserveLayerPop');
            dragonChk = false;
            $layer.hide();
            return;
        } else {
            dragonChk = true;
        }
    }

    if (AppVersion_Master >= 448) {
        fnSendGALog("1", "", "MA_팬페이지", "예매하기", movieGroupTitle);
    } else {
        fnSendGALog("1", "", "MW_팬페이지", "예매하기", movieGroupTitle);
    }

    if (rKind == undefined || rKind == "") {
        rKind = "00";
    }

    // 영화등급 가져오기
    var rateCode = fnReserveGrade(Grade);
    if (chkYn == 'Y') {
        $.fn.openPopup("popSpecialTicketing", "UP", null);
    } else {
        checkReserve(IsWebView_Master, mgCD, movieGroupTitle, rateCode, rKind, sm_type);
    }
}

// 영화 예매 가능 여부 확인
window.checkReserve = function (webViewFlag, mgCD, movTitle, rateCode, rKind, sm_type) {
    var result;

    $('#reserveLayerPop').removeClass('on');
    $('#reserveLayerPop').hide();

    // 페이스북 다이내믹 애드
    callFacebookReserve();

    if (rKind == "00") {
        // 00은 체크하지 않는다.
        if (webViewFlag) {
            CGVFanpageAppInterface.ReserveFromMovieInfoV4(mgCD, encodeURIComponent(movTitle), rateCode, rKind);
        } else {
            // 그냥 예약
            // 함수 재정의가 필요하다. or window.open
            var smtype = sm_type || "";
            // 하드코딩 Son.HW
            goOutLink(ticketURL + "WebApp/Reservation/QuickResult.aspx?MovieIdx=" + strMovieIdx + "&sm_type=" + smtype);
        }
    } else {
        if (webViewFlag) {
            CGVFanpageAppInterface.ReserveFromMovieInfoV4(mgCD, encodeURIComponent(movTitle), rateCode, rKind);
        } else {
            var smtype = sm_type || "";
            goOutLink(ticketURL + "WebApp/Reservation/QuickResult.aspx?MovieIdx=" + strMovieIdx + "&sm_type=" + smtype);
        }
    }
    return result;
}

// 외부 링크 연결. ChoiTH
window.goOutLink = function (url, type) {
    if (IsWebView_Master) {
        CGVFanpageAppInterface.OutLink(url, type);
    } else {
        location.href = url;
    }
}

// 이벤트 링크 연결.
window.eventLink = function (type, url) {
    if (IsWebView_Master) {
        CGVFanpageAppInterface.EventBannerCall(type, encodeURIComponent(url));
    } else {
        location.href = url;
    }
}

// 로그인 화면 이동. ChoiTH
window.fnMoveLoginPage = function () {
    var memberPath = "Member";
    var reUrl = encodeURIComponent(window.document.location.href);

    if (IsWebView_Master) {
        memberPath = "MemberV4";
    }
    location.href = gateURL + memberPath + "/Login.aspx?RedirectUrl=" + gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + reUrl;
}

// 관련소식 컨텐츠 옵션 기능. ChoiTH
// TG : 좋아요 TS : 공유하기
window.fnContentsOpt = function (kind, idx, $obj, contTxt) {
    if (kind == "TS") {
        $.ajax({
            method : "post",
            url : "/fanpage/contentsOpt",
            dataType : "json",
            data : {
                optKind : kind,
                movieIdx : strMovieIdx,
                contentsIdx : idx
            },
            success : function (result) {
                // 웹뷰일 경우 WebToAPP 호출
                if (IsWebView_Master) {
                    fnShareContents(contTxt, idx, strMovieIdx, $(this));
                } else {
                    fnShare_Web(idx, contTxt);
                }
            },
            error : function () {
                var url_chk = window.document.location.href;
                // 컨텐츠 상세일 경우 상세페이지로 이동
                if (url_chk.indexOf('contentsDetail') > -1) {
                    location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl="
                            + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + window.document.location.href.split('contentsIdx=')[1]);
                } else {
                    // 컨텐츠 상세가 아닐 경우 팬페이지 메인으로 이동
                    location.reload();
                }
            }
        });
    }

    if (kind == "TG") {
        if (!IsLogin) {
            if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
                fnMoveLoginPage();
                return;
            }
        } else {
            $.ajax({
                method : "post",
                url : "/fanpage/contentsOpt",
                dataType : "json",
                data : {
                    optKind : kind,
                    movieIdx : strMovieIdx,
                    contentsIdx : idx
                },
                success : function (result) {
                    if (result.result_code == "success") {
                        var goodNumberObj = $obj.find("span");
                        var goodNumber = goodNumberObj.text().replaceAll(",", "");

                        // 컨텐츠 좋아요
                        if (kind == "TG") {
                            if (result.resultCd == "0") {
                                $obj.addClass("on");
                                goodNumberObj.text(changeNumberFormat(goodNumber, 'p'));
                            } else {
                                $obj.removeClass("on");
                                goodNumberObj.text(changeNumberFormat(goodNumber, 'm'));
                            }
                        }
                    }
                },
                error : function () {
                    var url_chk = window.document.location.href;
                    // 컨텐츠 상세일 경우 상세페이지로 이동
                    if (url_chk.indexOf('contentsDetail') > -1) {
                        location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl="
                                + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + window.document.location.href.split('contentsIdx=')[1]);
                    } else {
                        // 컨텐츠 상세가 아닐 경우 팬페이지 메인으로 이동
                        location.reload();
                    }
                }
            });
        }
    }
}

// 관련소식 컨텐츠 동영상 3초/10초 이상 재생시 아이템 재생수 증가. ChoiTH
window.fnContentsVideoCnt = function (timeKind, cIdx, iIdx) {
    $.ajax({
        method : "post",
        url : "/fanpage/contentsVideoOpt",
        dataType : "json",
        data : {
            optKind : timeKind,
            movieIdx : strMovieIdx,
            contentsIdx : cIdx,
            itemIdx : iIdx
        },
        success : function (result) {
        },
        error : function () {
            /*
             * var url_chk = window.document.location.href; // 컨텐츠 상세일 경우 상세페이지로 이동 if (url_chk.indexOf('contentsDetail') > -1) { location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + window.document.location.href.split('contentsIdx=')[1]); } else { // 컨텐츠 상세가 아닐 경우 팬페이지 메인으로 이동 location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx; }
             */
        }
    });
}

// 관련소식 컨텐츠 동영상 사용자별 재생 시간 집계. ChoiTH
window.fnContentsVideoEndTime = function (cIdx, iIdx, playtime) {
    if (fanpageMember == "Member") {
        $.ajax({
            method : "post",
            url : "/fanpage/contentsVideoOpt",
            dataType : "json",
            data : {
                optKind : "TVEND",
                movieIdx : strMovieIdx,
                contentsIdx : cIdx,
                itemIdx : iIdx,
                playtime : playtime
            },
            success : function (result) {
            },
            error : function () {
                alert('처리 중 에러가 발생하였습니다.\n잠시 후에 다시 이용해 주세요.');
            }
        });
    }
}

// 메인 포스터 & 관련소식 컨텐츠 이미지 다운로드. ChoiTH
window.fnDownloadImage = function (url) {
    if (IsWebView_Master) {
        CGVFanpageAppInterface.PosterDownload(url, "1");
    }
}

// 모바일웹 공유하기 창 오픈. SonHW
window.fnShare_Web = function (idx, contTxt) {
    if (!IsWebView_Master) {
        var $_obj = $("#popFpShare");
        $.fn.openPopup("popFpShare", "UP", null);
        if (idx != "" || idx != undefined) {
            $_obj.attr('data-src', idx);
        }
        if (contTxt != "" || contTxt != undefined) {
            contTxt = contTxt.length > 20 ? contTxt.substr(0, 20) + "..." : contTxt;
            $_obj.attr('cont-src', contTxt);
        } else {
            contTxt = "";
        }
    }
}

// 모바일웹 공유하기 (페이스북). SonHW
window.fnShare_FaceBook = function (url, title) {
    var data = $('div#popFpShare.popup_dim').attr('data-src');
    var cont = $('div#popFpShare.popup_dim').attr('cont-src');
    var gateURLImsi = "http://m.cgv.co.kr/WebApp/";
    if (data == "" || data == undefined) {
        if (url == "" || url == undefined) {
            url = gateURLImsi + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx;
        }
    } else {
        url = gateURLImsi + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "_contentsIdx=" + data);
    }

    // title = encodeURIComponent(title);

    var userId = "";
    $.ajax({
        method : "post",
        url : "/fanpage/shortURL",
        dataType : "json",
        data : {
            id : strUserId,
            realUrl : url
        },
        async : false,
        success : function (result) {
            url = result.resultData.shortUrl;
        },
        error : function () {
            alert("처리 중 에러가 발생했습니다.\n잠시 후에 다시 이용해 주세요;")
        }
    });
    title = cont;
    location.href = "http://www.facebook.com/sharer.php?v=4&src=bm&u=" + url + "&t=" + title;
}

// 모바일웹 공유하기 (트위터). SonHW
window.fnShare_Twitter = function (url, title) {
    var data = $('div#popFpShare.popup_dim').attr('data-src');
    var cont = $('div#popFpShare.popup_dim').attr('cont-src');
    var gateURLImsi = "http://m.cgv.co.kr/WebApp/";
    if (data == "" || data == undefined) {
        if (url == "" || url == undefined) {
            url = gateURLImsi + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx;
        }
    } else {
        url = gateURLImsi + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "_contentsIdx=" + data);
    }

    var userId = "";
    $.ajax({
        method : "post",
        url : "/fanpage/shortURL",
        dataType : "json",
        data : {
            id : strUserId,
            realUrl : url
        },
        async : false,
        success : function (result) {
            url = result.resultData.shortUrl;
        },
        error : function () {
            alert("처리 중 에러가 발생했습니다.\n잠시 후에 다시 이용해 주세요;")
        }
    });
    title = cont;
    location.href = "https://twitter.com/share?text=" + title + "&url=" + url;
}

// 모바일웹 공유하기 (카카오톡). SonHW
window.fnSendTalkLinkFull = function (url, title, img_url) {
    var filter = "win16|win32|win64|mac";
    var data = $('div#popFpShare.popup_dim').attr('data-src');
    var cont = $('div#popFpShare.popup_dim').attr('cont-src');
    var gateURLImsi = "http://m.cgv.co.kr/WebApp/";
    if (data == "" || data == undefined) {
        if (url == "" || url == undefined) {
            url = gateURLImsi + "MovieV4/movieDetail.aspx?MovieIdx=" + strMovieIdx;
        }
    } else {
        url = gateURLImsi + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "_contentsIdx=" + data);
    }

    if (img_url == "" || img_url == undefined) {
        addImgUrl = strMovieIdx;
        img_url = "http://img.cgv.co.kr/Movie/Thumbnail/Poster/0000" + addImgUrl.substr(0, 2) + "/" + addImgUrl + "/" + addImgUrl + "_1000.jpg";
    }

    if (strContentsIdx != "" && strContentsIdx != undefined) {
        cont = $('.reptxt').text().substr(0, 20);
    }

    if (title == "" || title == undefined) {
        title = movieGroupTitle;
    }
    if (!Kakao.isInitialized()) {
        Kakao.init('0e745a30fbfe741f78ed701c9bad3ac8');
    }
    Kakao.Link.sendDefault({
        objectType : 'feed',
        content : {
            title : title,
            description : cont,
            imageUrl : img_url,
            imageWidth : 800,
            imageHeight : 800,
            link : {
                mobileWebUrl : url,
                webUrl : url
            }
        }
    });
}

// 모바일웹 공유하기 (트위터). SonHW
window.fnShareUrlCopy = function (url, title) {
    var data = $('div#popFpShare.popup_dim').attr('data-src');
    var cont = $('div#popFpShare.popup_dim').attr('cont-src');
    if (data == "" || data == undefined) {
        if (url == "" || url == undefined) {
            url = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx;
        }
    } else {
        url = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "_contentsIdx=" + data);
    }

    var userId = "";
    $.ajax({
        method : "post",
        url : "/fanpage/shortURL",
        dataType : "json",
        data : {
            id : strUserId,
            realUrl : url
        },
        async : false,
        success : function (result) {
            url = result.resultData.shortUrl;
        },
        error : function () {
            alert("처리 중 에러가 발생했습니다.\n잠시 후에 다시 이용해 주세요;")
        }
    })
    new Clipboard(".btn_url_copy", {
        text : function (trigger) {
            return url;
        }
    });
    /*
     * $(".btn_url_copy").attr("data-clipboard-text",url); var clipboard = new Clipboard(".btn_url_copy");
     */
}

// 컨텐츠 좋아요. 공유하기 숫자포멧 변경 (0 ~ 9,999까지 / 10,000 부터는 1.0만 표기 / 만단위 부터는 가공X)
// type : p(증가), m(감소)
window.changeNumberFormat = function (num, type) {
    var result = "";
    var resultNum = "";
    if (num.indexOf("만") != -1) { // '만'이 들어있을 경우
        result = num;
    } else {
        if (type == 'p' || type == null) {
            num = parseInt(num) + 1;
        } else if (type == 'm') {
            num = parseInt(num) - 1;
        }
        resultNum = String(num);

        var numLeng = resultNum.length;
        if (num >= 1000 && num < 10000) {
            result = resultNum.substr(0, numLeng - 3) + "," + resultNum.substr(numLeng - 3, 3);
        } else {
            result = resultNum;
        }
    }
    return result;
}

window.nvl = function (value, defaultVal) {
    return (isNull(value + "")) ? defaultVal : value;
}