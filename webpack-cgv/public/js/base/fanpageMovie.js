//'use strict';
/* 팬페이지 화면 제어. ChoiTH */
window.isPreviousContentsComplete = "False" != "True";
window.isPreviousContentscmtTab2 = "False" != "True";
window.isListComplete = false;
window.pageStart = 1;
window.pageSize = 10;
window.dataTotCnt = 0;
window.cmtsPageStart = 1;
window.pageSizeCont = 2;

// 네이티브에서 관련소식 페이지에서 댓글달고 상세페이지 이동을 위한 ContentsIdx 값 저장변수
window.rCidx = "";
// 실관람평 조회시 중복노출 제거를 위한 Timestamp
window.maxCmtIdx = 0;
// 실관람평 작성 유무 확인
window.chkYn = 0;
window.newAppWindowYn = "N";

window.loginCheck = function () {
    if (!IsLogin) {
        if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
            fnMoveLoginPage();
            return false;
        } else {
            return false;
        }
    }
    return true;
}


// 관련소식 컨텐츠 상세보기 화면으로 이동. ChoiTH
window.fnMoveContentsDetail = function (url, contTxt, ContIdx) {
    $.ajax({
        method : "post",
        url : "/fanpage/contentsOpt",
        dataType : "json",
        data : {
            optKind : "TD",
            movieIdx : strMovieIdx,
            contentsIdx : ContIdx
        },
        success : function (result) {
        },
        error : function () {
        }
    });
    if (newAppWindowYn == "N" && IsWebView_Master) {
        url = "http://" + location.host + url;
        CGVFanpageAppInterface.EventBannerCall("5", encodeURIComponent(url));
    } else {
        if (!newWindowOpen || newWindowOpen.closed) {
            newWindowOpen = window.open(url);
        } else {
            newWindowOpen.location = url;
            newWindowOpen.focus();
        }
    }
    // location.href = url;
}

// 관련소식 컨텐츠 url 외부링크로 이동. ChoiTH
window.fnMoveContentsUrl = function (url, contTxt, ContIdx) {
    if (AppVersion_Master >= 448) {
        fnSendGALog("1", "", "MA_팬페이지", "관련소식_반응보기", movieGroupTitle + "/" + contTxt.substr(0, 20));
    } else {
        fnSendGALog("1", "", "MW_팬페이지", "관련소식_반응보기", movieGroupTitle + "/" + contTxt.substr(0, 20));
    }

    $.ajax({
        method : "post",
        url : "/fanpage/contentsOpt",
        dataType : "json",
        data : {
            optKind : "TD",
            movieIdx : strMovieIdx,
            contentsIdx : ContIdx
        },
        success : function (result) {
        },
        error : function () {
        }
    });

    if (url.indexOf("cgv.co.kr") == "-1" && url.indexOf("cgv.kr") == "-1") {
        goOutLink(url, 0)
    } else {
        eventLink(1, url);
    }

}

// 관련소식 컨텐츠 댓글 목록에서 선택한 댓글의 대댓글 10개 미리보기 조회. ChoiTH
window.fnPreviewReply = function (strCommentIdx, $obj) {
    $obj.parent().hide();
    $obj.parent().siblings("#previewReplyArea").show();

    $.ajax({
        method : "post",
        url : "/fanpage/commentReplyPreviewList",
        dataType : "html",
        data : {
            movieIdx : strMovieIdx,
            contentsIdx : strContentsIdx,
            commentIdx : strCommentIdx
        },
        success : function (result) {
            $obj.parent().siblings("#previewReplyArea").html(result);
        },
        error : function () {
            location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl="
                    + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + window.document.location.href.split('contentsIdx=')[1]);
        }
    });
}

window.newWindowOpen = null;
// 영화정보 스틸컷 뷰어로 보기. ChoiTH
window.fnStillcutView = function (iCnt) {
    var url = "http://" + location.host + "/fanpage/stillCutViewer?movieIdx=" + strMovieIdx + "&iCnt=" + iCnt;

    if (newAppWindowYn == "N" && IsWebView_Master) {
        CGVFanpageAppInterface.EventBannerCall("5", encodeURIComponent(url));
    } else {
        if (!newWindowOpen || newWindowOpen.closed) {
            newWindowOpen = window.open(url);
        } else {
            newWindowOpen.location = url;
            newWindowOpen.focus();
        }
    }
}

// 영화정보 인물상세 화면 보기. ChoiTH
window.fnMoviePersonInfoView = function (idx, pName) {
    var url = "http://" + location.host + "/fanpage/moviePeopleView?PeopleIdx=" + idx;

    if (newAppWindowYn == "N" && IsWebView_Master) {
        CGVFanpageAppInterface.EventBannerCall("5", encodeURIComponent(url));
    } else {
        if (!newWindowOpen || newWindowOpen.closed) {
            newWindowOpen = window.open(url);
        } else {
            newWindowOpen.location = url;
            newWindowOpen.focus();
        }

    }
}

// 영화정보 인물상세 포토갤러리 뷰어로 보기. ChoiTH
window.fnMoviePeoplePhotoView = function (iCnt, pIdx) {
    var url = "http://" + location.host + "/fanpage/searchMoviePeoplePhotoViewer?movieIdx=" + strMovieIdx + "&PeopleIdx=" + pIdx + "&iCnt=" + iCnt;

    if (IsWebView_Master) {
        CGVFanpageAppInterface.EventBannerCall("5", encodeURIComponent(url));
    } else {
        location.href = url;
    }
}

// 관련소식 컨텐츠 댓글/대댓글 앱에서 등록/수정 여부 체크. ChoiTH
window.AppWriteContentsCommentYN = "N";
window.AppWriteContentsReplyYN = "N";

// 관련소식 컨텐츠 댓글/대댓글. ChoiTH
window.AppWriteContentsIdx = "";
window.AppWriteContentsCommentIdx = "";

// 관련소식 컨텐츠 댓글/대댓글 등록/수정 위치. ChoiTH
window.AppWriteContentsReplyInfo = "";
window.AppWriteContentsReplyGubun = "";

// 관련소식 컨텐츠 댓글 등록창. ChoiTH
window.fnWriteContentsComment = function (gubun, contIdx, cIdx, cTxt, imgUrl, newWindowYn) {
    cIdx = cIdx || "";
    cTxt = cTxt || "";
    imgUrl = imgUrl || "";

    if (!IsLogin) {
        if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
            fnMoveLoginPage();
        }
    } else {
        var $_obj = $(event.target).parents("li.contentClass").find("div.reptxt").clone();
        if ($_obj.length == 0) {
            $_obj = $(event.target).parents("div.cover_list").find("div.reptxt").clone()
        }
        $_obj.find("span.temp_txt,a.more").remove();

        newWindowYn = newWindowYn || "N";
        if (newWindowYn == "Y") {
            var url = "http://" + location.host + "/fanpage/fanpageContentsRegView?navKind=30&gubun=" + gubun + "&movieIdx=" + strMovieIdx + "&contentsIdx=" + contIdx + "&commentIdx=" + cIdx;

            if (newAppWindowYn == "N" && IsWebView_Master) {
                CGVFanpageAppInterface.EventBannerCall("5", encodeURIComponent(url));
            } else {
                if (!newWindowOpen || newWindowOpen.closed) {
                    newWindowOpen = window.open(url);
                } else {
                    newWindowOpen.location = url;
                    newWindowOpen.focus();
                }
            }
        } else {
            document.frmWriteContentsComment.gubun.value = gubun;
            document.frmWriteContentsComment.movieIdx.value = strMovieIdx;
            document.frmWriteContentsComment.contentsIdx.value = contIdx;
            document.frmWriteContentsComment.commentIdx.value = cIdx;
            document.frmWriteContentsComment.submit();
        }
    }

}

// 관련소식 컨텐츠 대댓글 등록창. ChoiTH
window.fnWriteContentsReply = function (gubun, contIdx, cIdx, rIdx, rTxt, imgUrl, rUcd, rUtype) {
    rIdx = rIdx || "";
    rTxt = rTxt || "";
    imgUrl = imgUrl || "";

    if (!IsLogin) {
        if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
            fnMoveLoginPage();
        }
    } else {
        document.frmWriteContentsComment.gubun.value = gubun;
        document.frmWriteContentsComment.movieIdx.value = strMovieIdx;
        document.frmWriteContentsComment.contentsIdx.value = contIdx;
        document.frmWriteContentsComment.commentIdx.value = cIdx;
        document.frmWriteContentsComment.replyIdx.value = rIdx;
        document.frmWriteContentsComment.recvUcode.value = rUcd;
        document.frmWriteContentsComment.recvUtype.value = rUtype;
        document.frmWriteContentsComment.submit();
    }
}

// 네이티브에서 관련소식 컨텐츠 댓글을 등록/수정했을 경우 callback. ChoiTH
window.fnCallbackContentsComment = function () {
    // 관련소식 리스트에서 등록했을 경우 상세페이지로 이동
    if (strContentsIdx == "" || strContentsIdx == undefined) {
        location.href = "http://moviestory.cgv.co.kr/fanpage/contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + AppWriteContentsIdx + "#comment_wrap";
    } else { // 상세페이지에서 등록했을 경우 페이지 새로고침
        location.replace("/fanpage/contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + AppWriteContentsIdx + "#comment_wrap");
    }
    AppWriteContentsCommentYN = "N";
    AppWriteContentsIdx = "";
}

// 네이티브에서 관련소식 컨텐츠 대댓글을 등록/수정했을 경우 callback. ChoiTH
window.fnCallbackContentsReply = function () {
    if (AppWriteContentsReplyGubun == "RI") {
        $.ajax({
            method : "post",
            url : "/fanpage/sendContentsPush",
            processData : false,
            contentType : false,
            dataType : "json",
            data : jsJsonToFormData(AppWriteContentsReplyInfo),
            success : function (result) {
                AppWriteContentsReplyInfo = "";
            },
            error : function () {
            }
        });
    }
    location.reload();

    AppWriteContentsReplyYN = "N";
    AppWriteContentsIdx = "";
    AppWriteContentsCommentIdx = "";
}

// 실관람평 공감 건수 증가감 처리
window.fnInsComtsGood = function () {
    var $_commentParent = $(event.target).parents("[comment_idx][reply_idx]").length == 0 ? $(event.target).parents("[comment_idx]") : $(event.target).parents("[comment_idx][reply_idx]");
    var commentIdx = $_commentParent.attr("comment_idx");
    var cmtsRegId = $_commentParent.attr("cmts_reg_id");
    var replyIdx = $_commentParent.attr("reply_idx") || "";
    var cmtsGubun = $_commentParent.attr("cmts_gubun");
    var paramMap = {
        movieIdx : strMovieIdx,
        commentIdx : commentIdx,
        cmtsRegId : cmtsRegId,
        cmtsGubun : cmtsGubun
    };

    var sAct = "";
    if (cmtsGubun == "0") { // 굿리뷰
        if ($_commentParent.find("span.likeit").hasClass("on")) {
            sAct = "S02";
        } else {
            sAct = "S01";
        }
    } else if (cmtsGubun == "1") {
        if ($_commentParent.find("#checkCommentHeart0").prop("checked")) {
            sAct = "S01";
        } else {
            sAct = "S02";
        }
    } else if (cmtsGubun == "2") {
        if ($(event.target).prop("checked") == true) {
            sAct = "S03";
        } else {
            sAct = "S04";
        }
        paramMap.replyIdx = replyIdx;
        paramMap.replyCnt = $(event.target).parent().find("label > span.favorite_count").text();
    }
    paramMap.gubun = sAct;

    if (!loginCheck()) {
        return false;
    }

    $.ajaxCgv({
        url : "/fanpage/saveMovieCmtsOpt",
        data : JSON.stringify(paramMap),
        success : function (result) {
            if (paramMap.cmtsGubun == "0") {
                if (result.resultData.SYMPATHY_CNT == 1) {
                    $_commentParent.find("span.likeit").addClass("on");
                } else if (result.resultData.SYMPATHY_CNT == 0) {
                    $_commentParent.find("span.likeit").removeClass("on");
                }
                $_commentParent.find("span.count").text(result.resultData.GOOD_TOT_CNT + "명");
            } else if (paramMap.cmtsGubun == "1") {
                if (result.resultData.SYMPATHY_CNT == 1) {
                    $_commentParent.find("input#checkCommentHeart0").prop("checked", true);
                } else if (result.resultData.SYMPATHY_CNT == 0) {
                    $_commentParent.find("input#checkCommentHeart0").prop("checked", false);
                }
                $_commentParent.find("span.favorite_count[cmts_gubun='1']").text(result.resultData.GOOD_TOT_CNT);
            } else {
                if (result.resultData.LIKE_CNT == 1) {
                    $_commentParent.find("input#checkCommentHeart3_1").prop("checked", true);
                } else if (result.resultData.LIKE_CNT == 0) {
                    $_commentParent.find("input#checkCommentHeart3_1").prop("checked", false);
                }
                $_commentParent.find("span.favorite_count[cmts_gubun='2']").text(result.resultData.GOOD_TOT_CNT);
            }
        },
        error : function () {
            location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
        }
    });

}

// 실관람평 답글 공감 건수 증가감 처리
window.fnInsComtsGoodReply = function (commentIdx, replyIdx, $obj, cmtsRegId, totCnt) {
    var sId = $obj.parents("div.write_day").find("em").attr("class");
    var sAct = "";
    // 로그인 여부 체크 로직 추가

    // 공감 이미지 체크
    if (sId == "choice_on") {
        sAct = "S04";
    } else if (sId == "choice_off") {
        sAct = "S03";
    }

    if (!IsLogin) { // 로그인 여부 체크
        if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
            fnMoveLoginPage();
        }
    } else {

        $.ajaxCgv({
            url : "/fanpage/saveMovieCmtsOpt",
            data : JSON.stringify({
                movieIdx : strMovieIdx,
                commentIdx : commentIdx,
                replyIdx : replyIdx,
                gubun : sAct,
                cmtsRegId : cmtsRegId,
                replyCnt : totCnt
            }),
            success : function (result) {
                $obj.parents("div.write_day").find("em").removeClass();

                if (result.resultData.LIKE_CNT == 1) {
                    $obj.parents("div.write_day").find("em").addClass("choice_on");
                } else {
                    $obj.parents("div.write_day").find("em").addClass("choice_off");
                }
                console.log("value : " + result.resultData.GOOD_TOT_CNT);
                $obj.parents("div.write_day").find("span.number").text(result.resultData.GOOD_TOT_CNT);
            },
            error : function () {
                location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
            }
        });
    }
}

/*
 * SR 답글 상세, SD 답글 삭제
 */
window.fnUpdCmtReply = function (gubun) {
    // 로그인 여부 체크 로직 추가
    var commentIdx = document.forms[0].commentIdx.value; // 실관람평일련번호
    var replyIdx = document.forms[0].replyIdx.value; // 답글일련번호
    var replyFileUrl = document.forms[0].replyFileUrl.value; // 답글 파일
    var sData = "";
    var sFormId = document.forms[0];
    var nextPage = window.document.location.href; // 평점 작성 완료 후 이동할 페이지

    if (!IsLogin) { // 로그인 여부 체크
        if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
            fnMoveLoginPage();
        }
    } else {
        if (gubun == 'SR') { // 수정(답글 상세보기)
            document.getElementById("gubun").value = gubun;

            selectedReplyText = selectedReplyText.replace(/(<br>|<br\/>|<br \/>)/g, '\n');
            if (selectedReplyText.length >= 2000) {
                selectedReplyText = selectedReplyText.substr(0, 2000);
            }

            if (IsWebView_Master) {
                if (replyFileUrl == "" || replyFileUrl == null) {

                } else {
                    replyFileUrl = replyFileUrl.replaceAll("http://img.cgv.co.kr", "");
                    replyFileUrl = "http://img.cgv.co.kr" + replyFileUrl;
                }
                /*
                 * FanPageEditContentsComment(처리구분, 영화명(한글), 관람여부, 평점 작성 완료 후 이동할 페이지, 영화 Index, 컨텐츠 일련번호, 컨텐츠 댓글 일련번호, 컨텐츠 대댓글 일련번호, 댓글 대댓글 내용, 댓글 수정 대댓글 수정일 때 이미지가 있을 경우 해당 이미지의 url 주소, 회원타입, 통합회원코드)
                 */
                CGVFanpageAppInterface.FanPageEditContentsComment("02", movieGroupTitle, IsView, 'fnCmtsReplyCallBack', strMovieIdx, "", commentIdx, replyIdx, selectedReplyText, replyFileUrl, "U", strUcd);
            }
        } else { // 삭제 : SD
            if (!confirm("삭제하시겠습니까?")) {
                return;
            }

            sData = {
                movieIdx : strMovieIdx,
                commentIdx : commentIdx,
                gubun : gubun,
                replyIdx : replyIdx
            };

            $.ajax({
                method : "post",
                url : "/fanpage/saveMovieCmtsReply",
                processData : false,
                contentType : false,
                dataType : "json",
                data : jsJsonToFormData(sData),
                success : function (result) {
                    alert(result.resultMsg);

                    $('.opt_layer').removeClass('on');
                    $('.opt_reply_layer').removeClass('opt_layer');
                    $('.opt_layer2').removeClass('opt_layer');
                    $('.opt_reply_layer').removeClass('on');
                    $('.opt_layer2').removeClass('on');

                    var sCheck = checkSpecial(nextPage);
                    if (sCheck == true) {
                        location.href = nextPage;
                    } else {
                        document.forms[0].action = nextPage;
                        document.forms[0].submit();
                    }
                    jQuery("#charmWriteForm").fadeOut();
                    jQuery("#writeForm").fadeOut();
                },
                error : function () {
                    location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
                }
            });
        }
    }
}

// 실관람평 답글 내용을 클릭했을 경우 (수정하기 , 삭제하기 또는 신고하기 , 숨기기 보이기)
window.fnGoReplyOpt = function (idx, replyIdx, userId, $obj, fileUrl) {
    // selectedReplyText = $.trim($obj.html());
    selectedReplyText = $.trim($obj.html());
    var myRegExp = /(<|<\/)span([\s.'"=a-zA-Z]*)>/gi;
    selectedReplyText = selectedReplyText.replace(myRegExp, "");
    selectedReplyText = selectedReplyText.replace(/<img[^>]*>/g, "")

    var $optReplyLayer;
    $('.opt_layer').removeClass('on');
    $('.opt_reply_layer').removeClass('opt_layer');
    $('.opt_layer2').removeClass('opt_layer');
    $('.opt_reply_layer').removeClass('on');
    $('.opt_layer2').removeClass('on');

    if (userId == strUserId) {
        $optReplyLayer = jQuery('.opt_layer2');
    } else {
        $optReplyLayer = jQuery('.opt_reply_layer');
    }

    $optReplyLayer.addClass('opt_layer');
    $optReplyLayer.addClass('on');
    $optReplyLayer.show();

    event.preventDefault();

    document.forms[0].commentIdx.value = idx;
    document.forms[0].replyIdx.value = replyIdx;
    document.forms[0].replyFileUrl.value = fileUrl;
    document.forms[0].cmtsGubun.value = '2'; // 1.실관람평, 2.답글
}

// 실관람평을 클릭했을 경우 (수정하기 , 삭제하기 또는 신고하기 , 숨기기 보이기)
window.fnGoOpt = function (idx, userId, $obj, point, fileUrl) {
    // selectedReplyText = $.trim($obj.find("span").remove().end().html());
    selectedReplyText = $.trim($obj.html());
    var myRegExp = /(<|<\/)span([\s.'"=a-zA-Z]*)>/gi;
    selectedReplyText = selectedReplyText.replace(myRegExp, "");
    selectedReplyText = selectedReplyText.replace(/<img[^>]*>/g, "")

    var $optReplyLayer;
    $('.opt_layer').removeClass('on');
    $('.opt_reply_layer').removeClass('opt_layer');
    $('.opt_layer2').removeClass('opt_layer');
    $('.opt_reply_layer').removeClass('on');
    $('.opt_layer2').removeClass('on');

    if (userId == strUserId) {
        $optReplyLayer = jQuery('.opt_layer');
    } else {
        $optReplyLayer = jQuery('.opt_reply_layer');
    }

    $optReplyLayer.addClass('opt_layer');
    $optReplyLayer.addClass('on');
    $optReplyLayer.show();

    event.preventDefault();

    document.forms[0].commentIdx.value = idx;
    document.forms[0].point.value = point;
    document.forms[0].fileUrl.value = fileUrl;
    document.forms[0].cmtsGubun.value = '1'; // 1.실관람평, 2.답글
}

// 신고, 숨기기 증가감 처리
window.fnInsComtsSpoiler = function (gubun) {
    var sAct = "";
    // 로그인 여부 체크 로직 추가
    var $_commentParent = $(event.target).parents("div[comment_idx]");
    var commentIdx = $_commentParent.attr("comment_idx");
    var cmtsRegId = $_commentParent.attr("user_id");
    var replyIdx = $_commentParent.attr("reply_idx") || "";
    var cmtsGubun = $_commentParent.attr("cmts_gubun");
    var targetGbn = $_commentParent.attr("target_gbn") || "comments";
    var sData = "";
    var confirmChk = "";

    if (!IsLogin) { // 로그인 여부 체크
        if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
            fnMoveLoginPage();
        }
    } else {
        // 추가 소스 (@SonHW)
        if (gubun == "RT") {
            if (!confirm("평점 내용에 스포일러 또는 비방/욕설이 포함되어 있습니까?")) {
                return;
            }
            confirmChk = "Y";
            // alert("신고가 접수되었습니다. 내용 확인 후 반영하도록 하겠습니다.")
        } else if (gubun == "RH") {
            if (!confirm("해당 글을 숨기시겠습니까?")) {
                return;
            }
        }

        if (cmtsGubun == '1') {
            sData = {
                movieIdx : strMovieIdx,
                commentIdx : commentIdx,
                gubun : gubun
            };
        } else {
            gubun = 'S' + gubun;
            sData = {
                movieIdx : strMovieIdx,
                commentIdx : commentIdx,
                gubun : gubun,
                replyIdx : replyIdx
            };
        }

        $.ajaxCgv({
            url : "/fanpage/saveMovieCmtsOpt",
            data : JSON.stringify(sData),
            success : function (result) {
                if (sData.gubun == "RT" || sData.gubun == "SRT") { // 신고
                    if (result.resultData.RESULT_CD == 1) {
                        if (result.resultData.REPORT_TOT_CNT > 5) {
                            alert(result.resultData.RESULT_MSG);
                        } else {
                            alert("신고가 접수되었습니다. 내용 확인 후 반영하도록 하겠습니다.");
                        }
                    } else {
                        if (isNull(result.resultData.RESULT_MSG) == false) {
                            alert(result.resultData.RESULT_MSG);
                        } else {
                            alert("오류가 발생하였습니다. 잠시후 다시해주십시요.");
                        }
                    }
                } else if (sData.gubun == "RH" || sData.gubun == "SRH") { // 숨기기
                    if (result.resultData.RESULT_CD != 1) {
                        if (isNull(result.resultData.RESULT_MSG) == false) {
                            alert(result.resultData.RESULT_MSG);
                        } else {
                            alert("오류가 발생하였습니다. 잠시후 다시해주십시요.");
                        }
                    }
                    if (sData.gubun == "RH") {
                        $("li[comment_idx='" + sData.commentIdx + "'][cmts_gubun='1']").remove();
                        var commendCount = parseInt($("span.fp_comment_list_count").text().replaceAll(",", "")) - 1;
                        $("span.fp_comment_list_count").text(commendCount.format());
                    } else {
                        $_commentParent = $("ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']").has("[reply_idx]");
                        var $_obj_reply = $_commentParent.find(".btn_reply");
                        var data_count = parseInt($_obj_reply.attr("data-count")) - 1;
                        $_obj_reply.attr("data-count", data_count);
                        $("li[comment_idx='" + sData.commentIdx + "'][reply_idx='" + sData.replyIdx + "']").remove();
                        if (data_count == 0) {
                            $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").css("display", "none");
                        }
                    }
                }
            },
            error : function () {
                location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
            }
        });
    }
}

window.cameraClickYn = "N";
/*
 * 구분자에 따라 화면 이동 C 등록 , R 상세, U 수정, D 삭제, SC e 답글 등록
 */
/* camera : 카메라이미지 눌렀을 경우 Y */
window.fnUpdCmt = function (gubun, camera) {
    var nextPage = window.document.location.href; // 평점 작성 완료 후 이동할 페이지
    // '취소'를 눌렀을 경우
    if (gubun == 'E') {
        jQuery('.opt_layer').removeClass('on');
        jQuery('.opt_layer').hide();
        jQuery('.opt_layer2').removeClass('on');
        jQuery('.opt_layer2').hide();
        jQuery('.opt_reply_layer').removeClass('on');
        jQuery('.opt_reply_layer').hide();
        $('.opt_reply_layer').removeClass('opt_layer');
        $('.opt_layer2').removeClass('opt_layer');
    } else {
        if (!IsLogin) { // 로그인 여부 체크
            if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
                fnMoveLoginPage();
            }
        } else {
            var commentIdx = $(event.target).parents("#popWriteEditor").attr("comment_idx");
            commentIdx = commentIdx || document.forms[0].commentIdx.value;
            document.forms[0].commentIdx.value = commentIdx;

            // '삭제하기' 눌렀을 경우
            if (gubun == 'D') {
                var sData = {
                    gubun : gubun,
                    movieIdx : strMovieIdx,
                    commentIdx : commentIdx
                };

                if (!confirm("관람평을 삭제하실 경우\n지급된 포인트는 차감됩니다.\n삭제하시겠습니까?")) {
                    return;
                }

                $.ajax({
                    method : "post",
                    url : "/fanpage/saveMovieCmtsView",
                    processData : false,
                    contentType : false,
                    dataType : "json",
                    data : jsJsonToFormData(sData),
                    success : function (result) {
                        if (result.result_code != "success") {
                            alert(result.result_msg);
                        } else {
                            alert("관람평삭제가 완료 되었습니다.");
                            commentListOption.listInitYn = 'Y';
                            myCmtWriteYn = "N";
                            fnMyCmtWrite();
                            getCommentsInfo();
                        }
                    },
                    error : function () {
                        // alert('140자평 삭제에 실패했습니다.\n잠시 후에 다시 이용해 주세요.');
                        location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
                    }
                });

                // '삭제하기' 외 처리
            } else {
                // 관람객일 경우만
                if (IsView == "N") {
                    alert("실관람객에 한하여 관람평 작성이 가능합니다.");
                    return;
                } else if (gubun == 'C' && myCmtWriteYn == "Y") {
                    alert("이미 실관람평을 작성하셨습니다.");
                    return;
                } else {
                    // 웹뷰가 아닐경우
                    // 실관람평등록 및 답글등록 및 수정(상세보기)
                    if (gubun == 'C' || gubun == 'SC' || gubun == 'R') {
                        if (camera == 'Y') {
                            cameraClickYn = "Y";
                        }

                        if (gubun == 'C') { // 실관람평 등록
                            // 앱버전 체크
                            if (AppVersion_Master >= 448) {
                                fnSendGALog("1", "", "MA_팬페이지", "실관람평_등록", movieGroupTitle);
                            } else {
                                // 모바일웹일 경우
                                fnSendGALog("1", "", "MW_팬페이지", "실관람평_등록", movieGroupTitle);
                            }
                        } else if (gubun == 'SC') { // 실관람평 답글 등록
                            if (AppVersion_Master >= 448) {
                                fnSendGALog("1", "", "MA_팬페이지", "실관람평_답글", movieGroupTitle);
                            } else {
                                fnSendGALog("1", "", "MW_팬페이지", "실관람평_답글", movieGroupTitle);
                            }
                        }

                        document.forms[0].gubun.value = gubun;

                        if (gubun == 'SC') {
                            var sAction = '/fanpage/movieCmtsReplyList';
                            document.forms[0].action = sAction;
                        }
                        document.forms[0].submit();
                    }
                }
            }
        }
    }
}

// 네이티브에서 실관람평 등록취소 또는 실관람형 댓글 등록 취소할 경우 카메라 버튼 플래그 초기화
window.fnCamBack = function () {
    cameraClickYn = "N";
};

// 네이티브에서 실관람평 등록 또는 수정했을 경우 callback
window.fnCmtsCallBack = function (commentIdx, commentContent, hashGubun) {
    var sCommentContent = decodeURIComponent(commentContent);
    cameraClickYn = "N";
    /* 실관람평일련번호, 실관람평내용, 등록,수정 구분코드 */
    var sData = {
        gubun : "1",
        movieIdx : strMovieIdx,
        commentIdx : commentIdx,
        commentContent : sCommentContent,
        hashGubun : hashGubun
    };

    var nextPage = window.document.location.href; // 평점 작성 완료 후 이동할 페이지
    var sCheck = checkSpecial(nextPage);

    if (commentIdx != "") {
        $.ajax({
            method : "post",
            url : "/fanpage/saveMovieCmtsHashTag",
            processData : false,
            contentType : false,
            dataType : "json",
            data : jsJsonToFormData(sData),
            success : function (result) {
                $('.opt_layer').removeClass('on');
                $('.opt_reply_layer').removeClass('opt_layer');
                $('.opt_layer2').removeClass('opt_layer');
                $('.opt_reply_layer').removeClass('on');
                $('.opt_layer2').removeClass('on');

                if (sCheck == true) {
                    location.href = nextPage;
                } else {
                    document.forms[0].action = nextPage;
                    document.forms[0].submit();
                }
            },
            error : function () {
                /* alert('실패했습니다.\n잠시 후에 다시 이용해 주세요.'); */
            }
        });
    } else {
        $('.opt_layer').removeClass('on');
        $('.opt_reply_layer').removeClass('opt_layer');
        $('.opt_layer2').removeClass('opt_layer');
        $('.opt_reply_layer').removeClass('on');
        $('.opt_layer2').removeClass('on');

        if (sCheck == true) {
            location.href = nextPage;
        } else {
            document.forms[0].action = nextPage;
            document.forms[0].submit();
        }
    }
}

// 네이티브에서 실관람평 답글 등록 또는 수정했을 경우 callback
window.fnCmtsReplyCallBack = function (commentContent, replyIdx, hashGubun) {
    var commentIdx = document.forms[0].commentIdx.value;
    var sCommentContent = decodeURIComponent(commentContent);
    var cmtsRegId = document.forms[0].cmtsRegId.value;
    var nextPage = window.document.location.href; // 평점 작성 완료 후 이동할 페이지

    /* 실관람평일련번호, 실관람평내용, 등록,수정 구분코드 */
    var sData = {
        gubun : "2",
        movieIdx : strMovieIdx,
        commentIdx : replyIdx,
        commentContent : sCommentContent,
        parentCmtIdx : commentIdx,
        hashGubun : hashGubun,
        cmtsRegId : cmtsRegId,
        replyCnt : 0
    };

    var sCheck = checkSpecial(nextPage);
    if (replyIdx != "") {
        $.ajax({
            method : "post",
            url : "/fanpage/saveMovieCmtsHashTag",
            processData : false,
            contentType : false,
            dataType : "json",
            data : jsJsonToFormData(sData),
            success : function (result) {
                $('.opt_layer').removeClass('on');
                $('.opt_reply_layer').removeClass('opt_layer');
                $('.opt_layer2').removeClass('opt_layer');
                $('.opt_reply_layer').removeClass('on');
                $('.opt_layer2').removeClass('on');

                if (sCheck == true) {
                    location.href = nextPage;
                } else {
                    document.forms[0].action = nextPage;
                    document.forms[0].submit();
                }
            },
            error : function () {
                /* alert('실패했습니다.\n잠시 후에 다시 이용해 주세요.'); */
            }
        });
    } else {
        $('.opt_layer').removeClass('on');
        $('.opt_reply_layer').removeClass('opt_layer');
        $('.opt_layer2').removeClass('opt_layer');
        $('.opt_reply_layer').removeClass('on');
        $('.opt_layer2').removeClass('on');

        if (sCheck == true) {
            location.href = nextPage;
        } else {
            document.forms[0].action = nextPage;
            document.forms[0].submit();
        }
    }
}

// 답글 펼치기 10개 미리보기 조회
window.fnCmtsPreviewReply = function (sCommentIdx, $obj, sReplyTotcnt) {
    var targetGbn = $obj.parents("ul.fp_comment_list li").attr("target_gbn") || "comments";
    $.ajax({
        method : "post",
        url : "/fanpage/movieCmtsReplyList",
        dataType : "html",
        data : {
            movieIdx : strMovieIdx,
            commentIdx : sCommentIdx,
            replyTotcnt : sReplyTotcnt,
            targetGbn : targetGbn,
            gubun : 'SP'
        },
        success : function (result) {
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").html(result);
            var slideDuration = $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list li").length * 50;
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").slideDown(slideDuration).addClass("active");
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").find("input[type='checkbox']").off("click").on("click", fnInsComtsGood);
            $("ul.fp_comment_inner_list li a[data-popup]").off("click").on("click", function () {
                var isOnclick = $(this).data('popupOnclick') || false;
                if (!isOnclick) {
                    var _obj = event.target;
                    var $_commentParent = $(event.target).parents("li[comment_idx][reply_idx]");
                    var commentIdx = $_commentParent.attr("comment_idx") || "";
                    var cmtsRegId = $_commentParent.attr("cmts_reg_id") || "";
                    var replyIdx = $_commentParent.attr("reply_idx") || "";
                    var oldFileUrl = $_commentParent.find("div.add_img_wrap > img").attr("src") || "";
                    var targetGbn = $_commentParent.attr("target_gbn") || "comments";
                    var popupTarget = $(this).data('popup') || null;
                    var popupDir = $(this).data('popup-direction') || null;
                    var popupDepth = $(this).data('popup-depth') || null;
                    $('#' + popupTarget).attr("comment_idx", commentIdx);
                    $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
                    $('#' + popupTarget).attr("reply_idx", replyIdx);
                    $('#' + popupTarget).attr("cmts_gubun", "2");
                    $('#' + popupTarget).attr("old_file_url", oldFileUrl);
                    $('#' + popupTarget).attr("target_gbn", targetGbn);
                    $.fn.openPopup(popupTarget, popupDir, popupDepth);
                }
            });
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").find(".btn_allView").unbind("click").bind("click", function () {
                $(this).parents('.add_img_wrap').addClass('fullView');
                $(this).remove();
            });
        },
        error : function () {
            location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
        }
    });
}

// 답글 펼치기 10개 미리보기 조회
window.fnCmtsPreviewContentReply = function (sCommentIdx, $obj, pageIdx, pageSize, totCnt) {
    $.ajax({
        method : "post",
        url : "/fanpage/commentReplyList",
        dataType : "html",
        data : {
            movieIdx : strMovieIdx,
            contentsIdx : strContentsIdx,
            commentIdx : sCommentIdx,
            pageIdx : pageIdx,
            pageSize : pageSize
        },
        success : function (result) {
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").html(result);
            var slideDuration = $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list li").length * 50;
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").slideDown(slideDuration).addClass("active");
            var addHtml = "";
            if (pageSize < totCnt) {
                addHtml += "<div class='reply_more'>";
                addHtml += "<a href='javascript:void(0);' data-count=" + (totCnt - pageSize) + " total-count=" + totCnt + ">이전 글 전체 보기...</a>";
                addHtml += "</div>";
            }
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").after(addHtml);
            if (pageSize < totCnt) {
                $("li[comment_idx='" + sCommentIdx + "']").find(".reply_more a").unbind("click").bind("click", function () {
                    var totalCount = $(event.target).attr("total-count");
                    $(event.target).parent().remove();
                    fnCmtsPreviewContentReply(sCommentIdx, $obj, 1, totalCount, 0);
                });
            }
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list li a[data-popup]").off("click").on("click", function () {
                var isOnclick = $(this).data('popupOnclick') || false;
                if (!isOnclick) {
                    var _obj = event.target;
                    var $_commentParent = $(event.target).parents("li[comment_idx][reply_idx]");
                    var commentIdx = $_commentParent.attr("comment_idx") || "";
                    var cmtsRegId = $_commentParent.attr("cmts_reg_id") || "";
                    var regUserType = $_commentParent.attr("reg_user_type") || "";
                    var replyIdx = $_commentParent.attr("reply_idx") || "";
                    var oldFileUrl = $_commentParent.find("div.add_img_wrap > img").attr("src") || "";
                    var popupTarget = $(this).data('popup') || null;
                    var popupDir = $(this).data('popup-direction') || null;
                    var popupDepth = $(this).data('popup-depth') || null;
                    $('#' + popupTarget).attr("comment_idx", commentIdx);
                    $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
                    $('#' + popupTarget).attr("reg_user_type", regUserType);
                    $('#' + popupTarget).attr("reply_idx", replyIdx);
                    $('#' + popupTarget).attr("cmts_gubun", "2");
                    $('#' + popupTarget).attr("old_file_url", oldFileUrl);
                    $.fn.openPopup(popupTarget, popupDir, popupDepth);
                }
            });
            $("li[comment_idx='" + sCommentIdx + "'] ul.fp_comment_inner_list").find(".btn_allView").unbind("click").bind("click", function () {
                $(this).parents('.add_img_wrap').addClass('fullView');
                $(this).remove();
            });
        },
        error : function () {
            location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
        }
    });
}

// 답글등록
window.fnReplyCmts = function () {
    var _obj = event.target;
    var $_commentParent = $(_obj).parents("li[comment_idx]");
    var commentIdx = $_commentParent.attr("comment_idx");
    var cmtsRegId = $_commentParent.attr("cmts_reg_id");
    document.forms[0].commentIdx.value = commentIdx;
    document.forms[0].gubun.value = 'SC';
    document.forms[0].cmtsRegId.value = cmtsRegId;

    if (!IsLogin) { // 로그인 여부 체크
        if (confirm("CGV회원 로그인 후 사용 가능합니다.\n로그인 하시겠습니까?")) {
            fnMoveLoginPage();
        }
    } else {
        if (AppVersion_Master >= 448) {
            fnSendGALog("1", "", "MA_팬페이지", "실관람평_답글", movieGroupTitle);
        } else {
            fnSendGALog("1", "", "MW_팬페이지", "실관람평_답글", movieGroupTitle);
        }

        if (IsWebView_Master) {
            /*
             * FanPageEditContentsComment(처리구분, 영화명(한글), 관람여부, 평점 작성 완료 후 이동할 페이지, 영화 Index, 컨텐츠 일련번호, 컨텐츠 댓글 일련번호, 컨텐츠 대댓글 일련번호, 댓글 대댓글 내용, 댓글 수정 대댓글 수정일 때 이미지가 있을 경우 해당 이미지의 url 주소, 회원타입, 통합회원코드)
             */
            CGVFanpageAppInterface.FanPageEditContentsComment("01", movieGroupTitle, IsView, 'fnCmtsReplyCallBack', strMovieIdx, "", commentIdx, "", "", "", "U", strUcd);

        } else {
            var sAction = '/fanpage/movieCmtsReplyList';
            document.forms[0].action = sAction;
            document.forms[0].submit();
        }
    }

}

// 특수 문자가 있나 없나 체크
window.checkSpecial = function (str) {
    var special_pattern = /[&]/;
    if (special_pattern.test(str) == true) {
        return true;
    } else {
        return false;
    }
}

// 팬페이지 영화정보 포스터,스틸컷 더보기 기능
window.allViewImg = function (movieIdx) {
    $('.allview').removeClass("land");
    $('.allview').removeClass("port");
    movieGalleryList();
    $('.movie_gallery li').show();
    $('.btn_all_view').hide();
}

// 팬페이지 영화정보 시리즈물 클릭
window.goSeries = function (movieIdx) {
    var url = gateURL + "Fanpage/Gateway.aspx?MovieIdx=" + movieIdx;
    location.href = url;
}

// 팬페이지 광고선택 시
window.fanAdLink = function (url, type) {
    if (type === "2") {
        if (IsWebView_Master === true && AppVersion_Master >= 433) {
            CGVFanpageAppInterface.EventBannerCall('2', encodeURIComponent(url));
        } else {
            location.href = url;
        }
    } else if (type === "3") {
        if (IsWebView_Master === true && AppVersion_Master >= 433) {
            CGVFanpageAppInterface.OutLink(url, '0');
        } else {
            window.open(url);
        }
    } else if (type === "4") {
        if (IsWebView_Master === true && AppVersion_Master >= 433) {
            CGVFanpageAppInterface.OutLink(url, '1');
        } else {
            window.open(url);
        }
    } else {
        if ((url.indexOf("cgv.co.kr") > -1) || (url.indexOf("cgv.kr") > -1)) {
            if (IsWebView_Master === true && AppVersion_Master >= 433) {
                CGVFanpageAppInterface.EventBannerCall('2', encodeURIComponent(url));
            } else {
                location.href = url;
            }
        } else {
            if (IsWebView_Master === true && AppVersion_Master >= 433) {
                CGVFanpageAppInterface.OutLink(url, '0');
            } else {
                window.open(url);
            }
        }
    }
}
