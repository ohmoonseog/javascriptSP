window.contentCommentListOption = {
    movieIdx : null,
    contentsIdx : null,
    scrollTop : -1,
    listInitYn : 'Y',
    loaddingYn : 'N',
    totCnt : 0,
    endRowYn : 'N',
    endRow : 0,
    pageIndex : 1,
    pageSize : 10,
    totCnt : 0,
    loading : false
};

contentCommentListOption.init = function (gbn) {
    if (gbn == "page") {
        contentCommentListOption.listInitYn = 'Y';
        contentCommentListOption.loaddingYn = 'N';
        contentCommentListOption.scrollTop = -1;
        contentCommentListOption.pageIndex = 1;
        contentCommentListOption.pageSize = 10;
        contentCommentListOption.endRowYn = 'N';
        contentCommentListOption.endRow = 0;
        contentCommentListOption.movieIdx = strMovieIdx;
        contentCommentListOption.contentsIdx = strContentsIdx;
        contentCommentListOption.totCnt = parseInt(commentTotCnt);
        contentCommentListOption.loading = false;
    }
};

contentCommentListOption.setEvent = function () {
    $("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx] a.btn_comment").off("click").on("click", fnCommentReplayReg);
    $("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx] a.btn_reply").off("click").on("click", function () {
        var $_commentParent = $(event.target).parents("li[comment_idx]");
        if ($_commentParent.find("ul.fp_comment_inner_list").hasClass("active")) {
            var slideDuration = $_commentParent.find("ul.fp_comment_inner_list li").length * 50;
            $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").slideUp(slideDuration, function () {
                $(this).children().remove();
                $(this).css("display", "none");
            }).parent().find(".reply_more").remove();
        } else {
            var count = $(event.target).attr("data-count");
            var commentIdx = $_commentParent.attr("comment_idx");
            fnCmtsPreviewContentReply(commentIdx, $(event.target), 1, 10, count);
        }
    });

    $(window).off("scroll").on("scroll", function (e) {
        if ($(window).scrollTop() >= ($(document).height() - $(window).height()) * 0.9 && $(window).scrollTop() >= ($(document).height() - $(window).height()) - 100) {
            contentCommentListOption.scrollTop = $(document).scrollTop();
            if ((contentCommentListOption.totCnt > (contentCommentListOption.pageIndex * contentCommentListOption.pageSize)) && !contentCommentListOption.loading) {
                contentCommentListOption.pageIndex++;
                contentCommentListOption.loading = true;
                fnContentsCommentList();
            } else {
                contentCommentListOption.endRowYn = 'Y';
            }
        }
    });

    $("div.fp_contbox.observationReview_wrap ul.fp_comment_list li a[data-popup]").off("click").on("click", function () {
        var isOnclick = $(this).data('popupOnclick') || false;
        if (!isOnclick) {
            var _obj = event.target;
            var $_commentParent = $(event.target).parents("li[comment_idx]");
            var commentIdx = $_commentParent.attr("comment_idx") || "";
            var cmtsRegId = $_commentParent.attr("cmts_reg_id") || "";
            var replyIdx = $_commentParent.attr("reply_idx") || "";
            var oldFileUrl = $_commentParent.find("div.add_img_wrap > img").attr("src") || "";
            var popupTarget = $(this).data('popup') || null;
            var popupDir = $(this).data('popup-direction') || null;
            var popupDepth = $(this).data('popup-depth') || null;
            $('#' + popupTarget).attr("comment_idx", commentIdx);
            $('#' + popupTarget).attr("reply_idx", replyIdx);
            $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
            $('#' + popupTarget).attr("cmts_gubun", "2");
            $('#' + popupTarget).attr("old_file_url", oldFileUrl);
            $.fn.openPopup(popupTarget, popupDir, popupDepth);
        }
    });

    $("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx] .btn_allView").off("click").on("click", function () {
        $(this).parents('.add_img_wrap').addClass('fullView');
        $(this).remove();
    });
};

contentCommentListOption.getHtmlList = function (item, strImageServer, strImageServer2, sysdate) {
    var addItemHtml = "";
    addItemHtml += "<li contents_idx='" + contentCommentListOption.contentsIdx + "' comment_idx='" + item.COMMENT_IDX + "' cmts_reg_id='" + item.USER_CODE + "'  cmts_gubun='1'>";
    addItemHtml += "<div class='img_wrap'>";
    addItemHtml += "<img src='" + (isNull(item.commentUserImage) ? "" : item.commentUserImage) + "' onerror=\"this.src='/images/fanpage/common/bg_profile_noImage.svg'\" alt=''/>";
    addItemHtml += "</div>";
    addItemHtml += "<div class='writer_wrap'>";
    addItemHtml += "<a href='javascript:void(0)' class='btn_fp_more' data-popup='" + (item.MY_COMMENT_YN == "N" ? "popWorkEditor" : "popWriteEditor") + "' data-popup-direction='CENTER'>더보기</a>";
    addItemHtml += "<p class='writer_info_wrap'>";
    addItemHtml += "<span class='writer_name'>" + item.commentUserName + "</span>";
    addItemHtml += "<span class='writer_date'>" + item.INSERT_DATE.uformat("XXXX-XX-XX XX:XX:XX").mCgvTimeFormat(sysdate) + "</span>";

    if (item.MediaCode.split("^").filter(function (o, i) {
        return !isNull(String.prototype.mediaCodeMap[o]);
    }) > 0) {
        addItemHtml += "<span class='writer_screenType'>" + item.MediaCode.split("\^").reduce(function (addItemHtml, code, k) {
            addItemHtml += code.codeToName() + " ";
            return addItemHtml;
        }, "").trim() + "</span>";
    }
    addItemHtml += "</p>";
    addItemHtml += "<div class='writer_comment' style='word-break:break-all;'>" + item.COMMENT_CONTENTS + "</div>";

    if (!isNull(item.FILE_URL)) {
        addItemHtml += "<div class='add_img_wrap'>";
        addItemHtml += "<img src='" + strImageServer + item.FILE_URL.replaceAll(strImageServer2, "") + "' alt='가로이미지 Sample'/>";
        addItemHtml += "<a href='javascript:void(0)' class='btn_allView'>이미지 모두보기</a>";
        addItemHtml += "</div>";
    }
    addItemHtml += "<div class='comment_info_Wrap'>";
    addItemHtml += "<div class='comment_btnWrap'>";
    addItemHtml += "<div class='com_checkbox_comment_heart'>";
    addItemHtml += "<input type='checkbox' id='checkCommentHeart0' " + (item.USER_GOOD_YN == 0 ? "" : "checked ") + "  onclick=\"fnContentCommentOpt('CG');\"/>";
    addItemHtml += "<label for='checkCommentHeart0'>";
    addItemHtml += "<span class='ico_comment_heart'></span>";
    addItemHtml += "<span class='favorite_count'  cmts_gubun='1'>" + item.LIKE_CNT + "</span>";
    addItemHtml += "</label>";
    addItemHtml += "</div>";
    addItemHtml += "<a href='javascript:void(0)' class='btn_reply'  data-count='" + item.REPLY_CNT + "'></a>";
    addItemHtml += "</div>";
    addItemHtml += "<a href='javascript:void(0)' class='btn_comment' >댓글쓰기</a>"
    addItemHtml += "</div>";
    addItemHtml += "</div>";
    addItemHtml += "<ul class='fp_comment_inner_list'></ul>";
    addItemHtml += "</li>";
    addItemHtml += "";
    return addItemHtml;
}
contentCommentListOption.getCommentList = function (result) {
    var strImageServer = result.strImageServer;
    var strImageServer2 = result.strImageServer2;
    return result.contentsCommentList.reduce(function (addItemHtml, item, idex) {
        contentCommentListOption.endRow++;
        addItemHtml += contentCommentListOption.getHtmlList(item, strImageServer, strImageServer2, result.sysdate);
        return addItemHtml;
    }, "");
}
contentCommentListOption.setContentCommentList = function (result) {
    var contentListHtml = contentCommentListOption.getCommentList(result);
    $("div.fp_contbox.observationReview_wrap ul.fp_comment_list").append(contentListHtml);
    contentCommentListOption.setEvent();
    contentCommentListOption.loading = false;
}
window.fnContentsCommentList = function () {
    $.ajaxCgv({
        url : "/fanpage/contentsCommentList",
        delayYn : true,
        data : JSON.stringify({
            movieIdx : contentCommentListOption.movieIdx,
            contentsIdx : contentCommentListOption.contentsIdx,
            pageIdx : contentCommentListOption.pageIndex,
            pageSize : contentCommentListOption.pageSize
        }),
        success : function (result) {
            contentCommentListOption.setContentCommentList(result);
        }
    });
}

window.fileObject;
$(document).ready(function () {
    fileObject = new FileObject();
    if (IsWebView_Master) {
        basicNavigation(3, "", "");
    }
    contentCommentListOption.init("page");
    fileObject.init($('#itemFile'), $('#itemList'), function (fileSrc, fileKey) {
        return '<li>' + '<div class="inner">' + '<img src="' + fileSrc + '" itemIdx="" attachKey="' + fileKey + '" OLD_URL="" alt="">' + '</div>'
                + '<button type="button" class="btn_del" onclick="fileObject.fnDelItem()">삭제</button>' + '</li>';
    }, "div#popCommentReplyWrite.popup_dim");

    if (previewYn == "N") {
        fnContentsCommentList();
    }

    fnapageVideos = document.querySelectorAll("video");
    enableVideosDetail();

    if (mainToFan == 'Y') {
        fnWriteContentsComment('CI', strContentsIdx);
        mainToFan = 'N';
    }
});

window.fnContentCommentsReg = function () {
    if (!loginCheck()) {
        return false;
    }
    var popupTarget = "popCommentReplyWrite";
    var popupDir = "UP";
    var popupDepth = 1;
    var commentContent = "";
    var regGubun = "CI";
    $('#' + popupTarget).attr("contents_idx", strContentsIdx);
    $('#' + popupTarget).attr("comment_idx", "");
    $('#' + popupTarget).attr("cmts_reg_id", strUcd);
    $('#' + popupTarget).attr("cmts_gubun", "2");
    $('#' + popupTarget).attr("old_file_url", "");
    $('#' + popupTarget).find("textarea#commentContent").val("");
    $('#' + popupTarget).find("strong.myComments_title").text("댓글달기");
    $('#' + popupTarget).find("a.btn_enrollment").off("click").on("click", function () {
        fnCommentReplayRegSave(regGubun);
    }).text("등록");
    $.fn.openPopup(popupTarget, popupDir, popupDepth);
    fileObject.readyCommentReplayRegContentsEdit("C");
};

window.fnCommentReplayReg = function () { // APP구분 추가
    if (!loginCheck()) {
        return false;
    }
    var isOnclick = $(this).data('popupOnclick') || false;
    if (!isOnclick) {
        var $_commentParent = $(event.target).parents("li[comment_idx]");
        var contentsIdx = $_commentParent.attr("contents_idx") || "";
        var commentIdx = $_commentParent.attr("comment_idx") || "";
        var cmtsRegId = $_commentParent.attr("cmts_reg_id") || "";
        var popupTarget = "popCommentReplyWrite";
        var popupDir = "UP";
        var popupDepth = 1;
        var commentContent = "";
        var regGubun = (commentIdx == "") ? "CI" : "RI";
        $('#' + popupTarget).attr("contents_idx", contentsIdx);
        $('#' + popupTarget).attr("comment_idx", commentIdx);
        $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
        $('#' + popupTarget).attr("cmts_gubun", "2");
        $('#' + popupTarget).attr("old_file_url", "");
        $('#' + popupTarget).find("textarea#commentContent").val(commentContent);
        $('#' + popupTarget).find("strong.myComments_title").text("댓글달기");
        $('#' + popupTarget).find("a.btn_enrollment").off("click").on("click", function () {
            fnCommentReplayRegSave(regGubun);
        }).text("등록");
        $.fn.openPopup(popupTarget, popupDir, popupDepth);
        fileObject.readyCommentReplayRegContentsEdit("C");
    }
};
window.fnCommentReplyView = function (gubun) { // APP구분 추가
    if (!loginCheck()) {
        return false;
    }
    var isOnclick = $(this).data('popupOnclick') || false;
    if (!isOnclick) {
        var $_commentParent = $(event.target).parents("div[comment_idx]");
        var contentsIdx = $_commentParent.attr("contents_idx") || "";
        var commentIdx = $_commentParent.attr("comment_idx") || "";
        var replyIdx = $_commentParent.attr("reply_idx") || "";
        var cmtsRegId = $_commentParent.attr("cmts_reg_id") || "";
        var oldFileUrl = $_commentParent.attr("old_file_url") || "";
        var popupTarget = "popCommentReplyWrite";
        var popupDir = "UP";
        var popupDepth = 1;
        var regGubun = (replyIdx == "") ? "CU" : "RU";
        var commentContent = "";
        if (replyIdx == "") {
            commentContent = $("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx='" + commentIdx + "']").find("div.writer_comment").text();
        } else {
            commentContent = $("ul.fp_comment_inner_list li[comment_idx='" + commentIdx + "'][reply_idx='" + replyIdx + "']").find("div.writer_comment").text();
        }
        $('#' + popupTarget).attr("comment_idx", commentIdx);
        $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
        $('#' + popupTarget).attr("reply_idx", replyIdx);
        $('#' + popupTarget).attr("old_file_url", oldFileUrl);
        $('#' + popupTarget).attr("cmts_gubun", "2");
        $('#' + popupTarget).find("textarea#commentContent").val(commentContent);
        $('#' + popupTarget).find("strong.myComments_title").text("댓글수정");
        $('#' + popupTarget).find("a.btn_enrollment").off("click").on("click", function () {
            fnCommentReplayRegSave(regGubun);
        }).text("수정");
        $.fn.openPopup(popupTarget, popupDir, popupDepth);
        fileObject.readyCommentReplayRegContentsEdit("R", oldFileUrl);
    }
}

window.fnCommentReplayRegSave = function (gubun) {
    var sPoint = "2";
    var popUpId = "popCommentReplyWrite";
    var $_commentParent = $(event.target).parents("#" + popUpId);
    var commentIdx = $_commentParent.attr("comment_idx");
    var replyIdx = $_commentParent.attr("reply_idx") || "";
    var chkIsShowView = $_commentParent.attr("chk_is_show_view");
    var cmtsRegId = $_commentParent.attr("cmts_reg_id"); // 관람평등록ID
    var oldFileUrl = $_commentParent.attr("old_file_url") || ""; // 기존파일URL
    var commentContent = $_commentParent.find("#commentContent").val();

    commentContent = commentContent.emojiToString();
    var sData;
    var itemIdx = "";// 일련번호
    var fileUrl = "";// fileUrl
    var fileFile = "";// 파일
    var sSvcUrl = "";

    var itemObj = $(this).find("img");
    $("#itemList li").each(function () {
        itemObj = $(this).find("img");

        // 항목에서 파일키 Get
        var attachKey = itemObj.attr("attachKey");
        var attachFile = null;
        if (!isNull(attachKey)) {
            // 임시 Map에서 파일 Read
            attachFile = fileObject.getFileFromMap(attachKey);
            if (attachFile == null) {
                alert(attachKey + '를 찾을 수 없습니다.');
                check = false;
                return false;
            }
        }

        fileFile = attachFile;// 파일
    });

    sSvcUrl = "/fanpage/editContentsComment";

    sData = {
        gubun : gubun,
        movieIdx : strMovieIdx,
        contentsIdx : strContentsIdx,
        commentIdx : commentIdx,
        replyIdx : replyIdx,
        commentContent : commentContent,
        fileFile : fileFile,
        recvUcode : cmtsRegId,
        oldFileUrl : oldFileUrl
    };

    if (!confirm("저장 하시겠습니까?")) {
        return;
    }

    if (commentContent == "") {
        alert("내용을 입력해 주세요.");
    } else {
        if (commentContent.emojiLength() > 2000) {
            alert("내용은 2000자 이하로 등록하셔야 합니다.");
            return false;
        }
        fnSendGALog("1", "", (AppVersion_Master >= 448 ? "MA_팬페이지" : "MW_팬페이지"), "관련소식_댓글달기", movieGroupTitle);

        // 실관람객 작성 가능
        $.ajax({
            method : "post",
            url : sSvcUrl,
            processData : false,
            contentType : false,
            dataType : "json",
            data : jsJsonToFormData(sData),
            success : function (result) {
                if (sData.gubun == "CI") {
                    contentCommentListOption.totCnt++;
                    $('div.cover_list a.btn_reply span').text(contentCommentListOption.totCnt);
                    var contentCommentHtml = result.addContentComment.reduce(function (addItemHtml, item, idex) {
                        contentCommentListOption.endRow++;
                        addItemHtml += contentCommentListOption.getHtmlList(item, result.strImageServer, result.strImageServer2, result.sysdate);
                        return addItemHtml;
                    }, "");
                    var slideDuration = 300;
                    $(contentCommentHtml).prependTo("div.fp_contbox.observationReview_wrap ul.fp_comment_list").slideDown(slideDuration);
                    contentCommentListOption.setEvent();
                } else if (sData.gubun == "CU") {
                    $_commentParent.attr("old_file_url", "");
                    $_commentParent = $("ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']");
                    $_commentParent.find(".writer_comment").html(sData.commentContent);
                    if (result.FILE_URL == "") {
                        $_commentParent.find(".add_img_wrap").remove();
                    } else {
                        if ($_commentParent.find(".add_img_wrap").length == 0) {
                            var imageHtml = "";
                            imageHtml += "<div class='add_img_wrap'>";
                            imageHtml += "<img src='" + result.FILE_URL + "' alt='가로이미지 Sample'/>";
                            imageHtml += "<a href='javascript:void(0)' class='btn_allView'>이미지 모두보기</a>";
                            imageHtml += "</div>";
                            $_commentParent.find(".writer_comment").after(imageHtml);
                        } else {
                            $_commentParent.find(".add_img_wrap").find("img").attr("src", result.FILE_URL);
                        }
                    }
                } else {
                    $_commentParent.attr("old_file_url", "");
                    $_commentParent = $("ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']");
                    var $_obj_reply = $_commentParent.find(".btn_reply");
                    var data_count = parseInt($_obj_reply.attr("data-count"));
                    if (gubun == "RI") {
                        data_count++;
                        $_obj_reply.attr("data-count", data_count);
                    }

                    $_obj_reply.off("click").on("click", function () {
                        if ($_commentParent.find("ul.fp_comment_inner_list").hasClass("active")) {
                            var slideDuration = $_commentParent.find("ul.fp_comment_inner_list li").length * 50;
                            $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").slideUp(slideDuration, function () {
                                $(this).children().remove();
                                $(this).css("display", "none");
                            }).parent().find(".reply_more").remove();
                        } else {
                            var count = $(event.target).attr("data-count");
                            var commentIdx = $_commentParent.attr("comment_idx");
                            fnCmtsPreviewContentReply(commentIdx, $(event.target), 1, 10, count);
                        }
                    });
                    if ($_commentParent.find("ul.fp_comment_inner_list").hasClass("active")) {
                        var count = $(event.target).attr("data-count");
                        var commentIdx = $_commentParent.attr("comment_idx");
                        $_obj_reply_more = $_commentParent.parents("li[comment_idx='" + sData.commentIdx + "']").find("div.reply_more");
                        if ($_obj_reply_more.length > 0) {
                            var reply_more_count = parseInt($_obj_reply_more.find("a").attr("total-count"));
                            $_obj_reply_more.find("a").attr("total-count", reply_more_count + 1);
                        } else {
                            fnCmtsPreviewContentReply(commentIdx, $(event.target), 1, data_count, 0);
                        }
                    }
                }
                $.fn.closePopup(popUpId);
            },
            error : function () {
                alert('처리 중 에러가 발생하였습니다.\n잠시 후에 다시 이용해 주세요.');
            }
        });
    }
}
//
window.fnGetCommentsCopy = function (gubun) {
    var $_commentParent = $(event.target).parents("div[comment_idx]");
    var commentIdx = $_commentParent.attr("comment_idx");
    var replyIdx = $_commentParent.attr("reply_idx");
    var targetGbn = $_commentParent.attr("target_gbn");
    var $_targetObj;
    if (gubun == "CC") {
        $_targetObj = $("ul.fp_comment_list li[comment_idx='" + commentIdx + "']").first().find("div.writer_comment").first();
    } else if (gubun == "CR") {
        $_targetObj = $("ul.fp_comment_list li[comment_idx='" + commentIdx + "'][reply_idx='" + replyIdx + "']").first().find("div.writer_comment").first();
    }
    var text = $_targetObj.text();
    text = text.replaceAll("<br>", "\n");

    gfnGetCommentsCopy(text);

};
// fnDelComment, fnDelReply delete_function
window.fnContectCommentDel = function (gubun) {
    if (!loginCheck()) {
        return false;
    }
    if (!confirm("해당 글을 삭제하시겠습니까?")) {
        return;
    }
    var sData = {};
    sData.gubun = gubun;
    sData.movieIdx = strMovieIdx;
    sData.contentsIdx = strContentsIdx;
    var $_commentParent = $(event.target).parents("div[comment_idx]");
    sData.commentIdx = $_commentParent.attr("comment_idx");
    sData.replyIdx = $_commentParent.attr("reply_idx");
    $.ajax({
        method : "post",
        url : "/fanpage/delContentsComment",
        dataType : "json",
        data : sData,
        success : function (result) {
            if (result.result_code == "success") {
                if (result.resultCd == "0") {
                    alert("정상적으로 삭제되었습니다.");
                    var $_del_obj = null;
                    var $_commentParent = null;
                    if (sData.gubun == "CD") {
                        $_del_obj = $("ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']");
                        contentCommentListOption.endRow--;
                        contentCommentListOption.totCnt--;
                        $('div.cover_list a.btn_reply span').text(contentCommentListOption.totCnt);
                        $_del_obj.slideUp(300, function () {
                            $(this).remove();
                        });
                    } else {
                        var $_commentParent = $("ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']").has("[reply_idx]");
                        $_obj_reply = $_commentParent.find(".btn_reply");
                        var data_count = parseInt($_obj_reply.attr("data-count")) - 1;
                        $_obj_reply.attr("data-count", data_count);
                        $_commentParent.find("[reply_idx='" + sData.replyIdx + "']").slideUp(300, function () {
                            $(this).remove();
                        });
                        if (data_count == 0) {
                            $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").css("display", "none");
                        }
                    }
                }
            }

        },
        error : function () {
            location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl="
                    + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + window.document.location.href.split('contentsIdx=')[1]);
        }
    });
}
// fnCommentOpt, fnReplyOpt delete_function
window.fnContentCommentOpt = function (gubun) {
    if (!loginCheck()) {
        event.preventDefault();
        return false;
    }
    if (gubun[1] == "R") {
        if (!confirm("해당 글을 신고하시겠습니까?")) {
            return false;
        }
    } else if (gubun[1] == "H") {
        if (!confirm("해당 글을 숨기시겠습니까?")) {
            return false;
        }
    }

    var url = "";
    var sData = {};
    var $_popupParent = null;
    if (gubun[1] == "G") {
        if (gubun[0] == "C") {
            $_popupParent = $(event.target).parents("li[comment_idx]").first();
        } else {
            $_popupParent = $(event.target).parents("li[comment_idx][reply_idx]").first();
        }
    } else {
        $_popupParent = $(event.target).parents("div.popup_dim");
    }

    sData.optKind = gubun;
    sData.movieIdx = strMovieIdx;
    sData.contentsIdx = strContentsIdx;
    sData.commentIdx = $_popupParent.attr("comment_idx");
    sData.recvUcode = $_popupParent.attr("cmts_reg_id");
    sData.rUtype = $_popupParent.attr("reg_user_type");
    sData.replyIdx = $_popupParent.attr("reply_idx");
    var $_commentParent = null;
    if (gubun[0] == 'C') { // 댓글
        url = "/fanpage/commentOpt";
        $_commentParent = $("ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']").first();
    } else { // 대댓글
        url = "/fanpage/replyOpt";
        sData.replyIdx = $_popupParent.attr("reply_idx");
        $_commentParent = $("ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "'][reply_idx='" + sData.replyIdx + "']");
    }
    $.ajax({
        method : "post",
        url : url,
        dataType : "json",
        data : sData,
        success : function (result) {
            // gubun = 댓글 'CR' '신고하기', 'CH' '숨기기', 'CG' '좋아요'
            // 대댓글 'RR' '신고하기', 'RH' '숨기기', 'RG' '좋아요'
            //
            if (gubun[1] == "R") {
                if (result.resultCd == "0") {
                    alert("신고가 접수되었습니다.");
                } else {
                    alert("이미 신고한 글입니다.");
                }
            } else if (gubun[1] == "H") {
                if (result.resultCd == "0") {
                    var $_btn_reply = null;
                    if (gubun[0] == 'C') {
                        $_btn_reply = $_commentParent.find("a.btn_reply");
                    } else {
                        $_btn_reply = $_commentParent.parents("[comment_idx='" + sData.commentIdx + "']").find("a.btn_reply");
                    }
                    var data_count = parseInt($_btn_reply.first().attr("data-count"));
                    $_btn_reply.first().attr("data-count", data_count - 1);
                    $_commentParent.slideUp(300, function () {
                        $(this).remove();
                    });
                } else {
                    alert("이미 숨긴 글입니다.");
                }
            } else if (gubun[1] == "G") {
                var goodNumber = parseInt($_commentParent.find("span.favorite_count").first().text());
                if (result.resultCd == "0") {
                    $_commentParent.find("input#checkCommentHeart0").first().prop("checked", true);
                    $_commentParent.find("span.favorite_count").first().text(goodNumber + 1);
                } else {
                    $_commentParent.find("input#checkCommentHeart0").first().prop("checked", false);
                    $_commentParent.find("span.favorite_count").first().text(goodNumber - 1);
                }

            }
        },
        error : function () {
            location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl="
                    + encodeURIComponent("contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + window.document.location.href.split('contentsIdx=')[1]);
        }
    });
}

window.closeWrite = function () {
    if (fanpageGubunVal == 'push') {
        window.history.go(-1);
    } else {
        opener.window.location.reload();
        window.close();
    }
}
