window.fnMoreview = function ($obj) {
    $obj.parent('.reptxt').addClass('opened');
    $obj.parent().find('.temp_txt').hide();
    $obj.parent().find('.hide_txt').show();
    $obj.hide();
};

window.goMovieEvent = function (url) {
    if (IsWebView_Master == true) {
        CGVFanpageAppInterface.EventBannerCall("2", encodeURIComponent(url));
    } else {
        window.location.href = url;
    }
};

window.movieInfoOption = {
    loadCompleteYn : 'N'
};

window.listOption = function (pageSize) {
    pageSize = pageSize || 10;
    return {
        scrollTop : -1,
        listInitYn : 'Y',
        loaddingYn : 'N',
        FanAdYn : 'Y',
        FanAd : {},
        totCnt : 0,
        endRowYn : 'N',
        pageStart : 1,
        pageSize : pageSize,
        pageInit : function () {
            this.scrollTop = -1;
            this.listInitYn = 'Y';
            this.pageStart = 1;
            this.pageSize = pageSize;
            this.endRowYn = 'N';
        }
    };
};

window.contentListOption = {
    scrollTop : -1,
    listInitYn : 'Y',
    loaddingYn : 'N',
    FanAdYn : 'Y',
    FanAd : {},
    totCnt : 0,
    endRowYn : 'N',
    pageStart : 1,
    pageSize : 2
};

contentListOption.init = function (gbn) {
    if (gbn == "page") {
        contentListOption.scrollTop = -1;
        contentListOption.listInitYn = 'Y';
        contentListOption.pageStart = 1;
        contentListOption.pageSize = 2;
        contentListOption.endRowYn = 'N';
    } else if (gbn == 'all') {
        contentListOption.scrollTop = -1;
        contentListOption.listInitYn = 'Y';
        contentListOption.loaddingYn = 'N';
        contentListOption.FanAdYn = 'Y';
        contentListOption.FanAd = {};
        contentListOption.totCnt = 0;
        contentListOption.pageStart = 1;
        contentListOption.pageSize = 2;
        contentListOption.endRowYn = 'N';
    }
};

contentListOption.pageInit = function () {
    contentListOption.init("page");
};

window.commentListOption = {
    scrollTop : -1,
    listInitYn : 'Y',
    loaddingYn : 'N',
    FanAdYn : 'Y',
    FanAd : {},
    maxCmtIdx : 0,
    totCnt : 0,
    endRowYn : 'N',
    pageStart : 1,
    pageSize : 10,
    orderType : 0,
    filterType : 0
};

commentListOption.init = function (gbn) {
    if (gbn == "page") {
        commentListOption.listInitYn = 'Y';
        commentListOption.scrollTop = -1;
        commentListOption.pageStart = 1;
        commentListOption.pageSize = 10;
        commentListOption.endRowYn = 'N';
    } else if (gbn == 'all') {
        commentListOption.scrollTop = -1;
        commentListOption.listInitYn = 'Y';
        commentListOption.loaddingYn = 'N';
        commentListOption.FanAdYn = 'Y';
        commentListOption.FanAd = {};
        commentListOption.totCnt = 0;
        commentListOption.pageStart = 1;
        commentListOption.pageSize = 10;
        commentListOption.orderType = 0;
        commentListOption.filterType = 0;
        commentListOption.endRowYn = 'N';

    }
};

commentListOption.pageInit = function () {
    commentListOption.init("page");
};

/* TAB-1-1 관련소식 정보 생성 */
window.getContentsListHtml = function (result) {
    var contentsTxt = "";
    var contentsTxtRp = "";
    var contentsTxtArray;
    var contentsTxtIndex = -1;
    var contentsHtml = result.listFanfageContents.reduce(function (addHtml, contents, idx) {
        addHtml += "<li class='contentClass'>";
        addHtml += "<div class='cover_movie'>";
        addHtml += "<div class='cm_info has_btn'>";
        addHtml += "<div class='poster'><a href='javascript:void(0);'>";
        addHtml += "<img src='" + result.contentsPoster + "' alt=''></a></div>";
        addHtml += "<div class='txt_group'>";
        addHtml += "<strong class='tit'>" + movieGroupTitle + "</strong>";
        addHtml += "<span class='etc'>" + contents.INSERT_DATE.uformat("XXXX-XX-XX XX:XX:XX").substring(0, 12).mCgvDateFormat() + "</span>";
        addHtml += "</div>";
        addHtml += "</div>";
        addHtml += "</div>";
        addHtml += "<div class='reptxt'>";

        contentsTxtArray = contents.CONTENTS_TXT.split(/\n|\r\n/g);
        contentsTxt = contentsTxtArray.join("<br/>");
        contentsTxtRp = contentsTxt.charToHtml().replaceAll("\"", "").replaceAll("\'", "").replaceAll("<br>", "").replaceAll("<br/>", "").replaceAll("<a/>", "");

        if (contentsTxtArray.length < 4) {
            addHtml += "<p>" + contentsTxt + "</p>";
        } else {
            contentsTxtIndex = contentsTxt.indexOfSize("<br/>", 4);
            addHtml += "<p>" + contentsTxt.substr(0, contentsTxtIndex);
            addHtml += "<span class='temp_txt'>...</span>";
            addHtml += "<span class='hide_txt'>" + contentsTxt.substr(contentsTxtIndex) + "</span>";
            addHtml += "</p>"
            addHtml += "<a class='more' onclick='fnMoreview($(this))'>더보기</a>";
        }
        addHtml += "</div>";

        if (contents.ITEM_CNT > 1) {
            addHtml += "<div class='cover_imgwrap " + contents.IMAGE_TYPE + "'>";
        }
        addHtml += "<div class='cover_img'>";

        var listContentsItem = result.listContentsItem.filter(function (o, i) {
            return o.CONTENTS_IDX == contents.CONTENTS_IDX;
        });

        var itemLength = listContentsItem.length;
        addHtml += listContentsItem.reduce(function (addItemHtml, item, jdex) {
            var showMoreItemCnt = (contents.ITEM_CNT > 4 && (itemLength - 1) == jdex) ? "Y" : "N";
            if (item.FILE_TYPE == "02") {/* 비디오 */
                if (contents.ITEM_CNT > 1) {
                    addItemHtml += "<div class='inner " + ((showMoreItemCnt == "N") ? "player" : "") + "' play-status='play'>";
                    addItemHtml += "<div class='video_box' data-cIdx='" + contents.CONTENTS_IDX + "' data-iIdx='" + item.ITEM_IDX + "'>";
                    addItemHtml += "<video video_mType='content' video_content id='video_" + contents.CONTENTS_IDX + "_" + item.ITEM_IDX + "' preload='none' poster='" + item.THUMBNAIL_URL
                            + "' controlslist='nodownload' muted playsinline webkit-playsinline>";
                    addItemHtml += "<source src='" + result.videoServer + item.FILE_URL + "' type='video/mp4'>";
                    addItemHtml += "<p>video를 지원하지 않는 브라우저입니다.</p>";
                    addItemHtml += "</video>";
                    addItemHtml += "</div>";
                    addItemHtml += "<button class='btn_sound off'></button>";
                    addItemHtml += "<button class='btn_fullsize fullscreen'>전체화면으로 보기</button>";

                    if (showMoreItemCnt == "Y") {
                        addItemHtml += "<a href='javascript:void(0);' onclick=\"fnMoveContentsDetail('/fanpage/contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + contents.CONTENTS_IDX
                                + "', '" + contentsTxtRp + "', '" + contents.CONTENTS_IDX + "')\">";
                        addItemHtml += "<div class='more'>";
                        addItemHtml += "<span>" + (contents.ITEM_CNT - 4) + "개 이상</span>";
                        addItemHtml += "</div>";
                        addItemHtml += "</a>";
                    }
                    addItemHtml += "</div>";
                } else {
                    addItemHtml += "<div class='cover_img player' play-status='play'>";
                    addItemHtml += "<a href='javascript:void(0);'>";
                    addItemHtml += "<div class='video_box' data-cIdx='" + contents.CONTENTS_IDX + "' data-iIdx='" + item.ITEM_IDX + "'>";
                    addItemHtml += "<video video_mType='content' id='video_" + contents.CONTENTS_IDX + "_" + item.ITEM_IDX + "' preload='none' poster='" + item.THUMBNAIL_URL
                            + "' controlslist='nodownload' muted playsinline webkit-playsinline>";
                    addItemHtml += "<source src='" + result.videoServer + item.FILE_URL + "' type='video/mp4'>";
                    addItemHtml += "<p>video를 지원하지 않는 브라우저입니다.</p>";
                    addItemHtml += "</video>";
                    addItemHtml += "</div>";
                    addItemHtml += "<button class='btn_sound off'></button>";
                    addItemHtml += "<button class='btn_fullsize fullscreen'>전체화면으로 보기</button>";
                    addItemHtml += "</a>";
                    addItemHtml += "</div>";
                }
            } else {
                addItemHtml += "<div class='inner'>";
                addItemHtml += "<a href='javascript:void(0);' onclick=\"fnMoveContentsDetail('/fanpage/contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + contents.CONTENTS_IDX + "', '"
                        + contentsTxtRp + "' , '" + contents.CONTENTS_IDX + "')\" class='land'>";
                addItemHtml += "<img src='" + result.imageServer + item.FILE_URL + "' alt=''>";
                addItemHtml += "</a>";
                addItemHtml += "</div>";
            }
            return addItemHtml;
        }, "");

        addHtml += "</div>";

        if (contents.ITEM_CNT > 1) {
            addHtml += "</div>";
        }
        addHtml += "<div class='detail_btn_area videoAdBtnWrap'>";
        addHtml += "<a href='javascript:void(0);' onclick=\"fnContentsOpt('TG','" + contents.CONTENTS_IDX + "', $(this), '" + contentsTxtRp + "');\" class='btn_like"
                + (contents.USER_GOOD_YN == "1" ? " on" : "") + "'><span>" + contents.LIKE_CNT + "</span></a>";
        addHtml += "<a href='javascript:void(0);' onclick=\"fnMoveContentsDetail('/fanpage/contentsDetail?movieIdx=" + strMovieIdx + "&contentsIdx=" + contents.CONTENTS_IDX + "', '" + contentsTxtRp
                + "' , '" + contents.CONTENTS_IDX + "')\" class='btn_reply'><span>" + contents.COMMENT_TOT_CNT + "</span></a>";
        addHtml += "<a href='javascript:void(0);' class='btn_share'  onclick=\"fnContentsOpt('TS','" + contents.CONTENTS_IDX + "', $(this), '" + contentsTxtRp + "');\"><span>공유하기</span></a>";
        addHtml += "</div>";
        addHtml += "</li>";

        if (contentListOption.FanAdYn == 'N') {
            contentListOption.FanAdYn = 'Y';
            if (IsWebView_Master == true) {
                if (!isNull(contentListOption.FanAd.IMG_URL2)) {
                    addHtml += "<div class='common_banner cb_type1' style='background-color:" + contentListOption.FanAd.BG_COLOR + ";'>";
                    addHtml += "<a href='javascript:void(0);' onclick=\"fanAdLink('" + contentListOption.FanAd.LINK_URL + "', '" + contentListOption.FanAd.AD_TYPE + "')\" style='display:block;'>";
                    addHtml += "<img src='" + contentListOption.FanAd.IMG_URL2 + "' alt='광고' style='height:100px;'>";
                    addHtml += "</a>";
                    addHtml += "</div>";
                }
            } else {
                addHtml += "<div class='common_banner cb_type1'>";
                addHtml += "<iframe id='iframe' title='모바일광고' src='http://ad.cgv.co.kr/NetInsight/html/CGV/CGV_201401/mobile_05@web_Movieinfo?keyword=" + strMovieIdx
                        + "' width='100%' frameborder='0' scrolling='no' topmargin='0' leftmargin='0' marginwidth='0' marginheight='0'></iframe>";
                addHtml += "</div>";
            }
        }
        return addHtml;
    }, "");
    return contentsHtml;
}

/* TAB-2-1 실관람평 정보 생성 */
window.getCommentsListHtml = function (result) {
    var strImageServer = result.strImageServer;
    var strImageServer2 = result.strImageServer2;
    var commentsListHtml = "";
    var commentList = result.myComment.concat(result.movieCommentList);
    return commentList.reduce(function (addItemHtml, item, idex) {
        var registDate = new Date(item.RegistDate).format("yyyyMMddHHmmss");
        addItemHtml += "<li comment_idx='" + item.CommentIdx + "' cmts_reg_id='" + item.UserID + "'  cmts_gubun='1'>";
        addItemHtml += "<div class='img_wrap'>";
        addItemHtml += "<img src='" + (isNull(item.UserSmallImage) ? "" : strImageServer2 + item.UserSmallImage) + "' onerror=\"this.src='/images/fanpage/common/bg_profile_noImage.svg'\" alt=''/>";
        addItemHtml += "</div>";
        addItemHtml += "<div class='writer_wrap'>";
        addItemHtml += "<a href='javascript:void(0)' class='btn_fp_more' data-popup='" + (strUserId == item.UserID ? "popWriteEditor" : "popWorkEditor")
                + "' data-popup-direction='CENTER' tarent_gbn='comments'>더보기</a>";

        if (item.EggPoint == "1") {
            addItemHtml += "<strong class='state bad'>별로예요.</strong>";
        } else {
            addItemHtml += "<strong class='state good'>좋았어요!</strong>";
        }
        addItemHtml += "<p class='writer_info_wrap'>";
        addItemHtml += "<span class='writer_name'>" + (isNull(item.NickName) ? item.UserID.maskingInfo() : item.NickName) + "</span>";
        addItemHtml += "<span class='writer_date'>" + item.RegistDate.mCgvTimeFormat(result.sysdate) + "</span>";

        if (item.MediaCode.split("^").filter(function (o, i) {
            return !isNull(String.prototype.mediaCodeMap[o]);
        }) > 0) {
            addItemHtml += "<span class='writer_screenType'>" + item.MediaCode.split("\^").reduce(function (addItemHtml, code, k) {
                addItemHtml += code.codeToName() + " ";
                return addItemHtml;
            }, "").trim() + "</span>";
        }
        addItemHtml += "</p>";
        addItemHtml += "<div class='writer_comment' style='word-break:break-all;'>" + item.CommentText + "</div>";
        if (!isNull(item.FileUrl)) {
            addItemHtml += "<div class='add_img_wrap'>";
            addItemHtml += "<img src='" + strImageServer + item.FileUrl.replaceAll(strImageServer2, "") + "' alt='가로이미지 Sample'/>";
            addItemHtml += "<a href='javascript:void(0)' class='btn_allView'>이미지 모두보기</a>";
            addItemHtml += "</div>";
        }
        addItemHtml += "<div class='comment_info_Wrap'>";
        addItemHtml += "<div class='comment_btnWrap'>";
        addItemHtml += "<div class='com_checkbox_comment_heart'>";
        addItemHtml += "<input type='checkbox' id='checkCommentHeart0' " + (item.SYMPATHY_CNT == 0 ? "" : "checked ") + "/>";
        addItemHtml += "<label for='checkCommentHeart0'>";
        addItemHtml += "<span class='ico_comment_heart'></span>";
        addItemHtml += "<span class='favorite_count'  cmts_gubun='1'>" + item.GOODCNT + "</span>";
        addItemHtml += "</label>";
        addItemHtml += "</div>";
        addItemHtml += "<a href='javascript:void(0)' class='btn_reply'  data-count='" + item.ReplyCnt + "'></a>";
        addItemHtml += "</div>";
        addItemHtml += "<a href='javascript:void(0)' class='btn_comment'>댓글쓰기</a>"
        addItemHtml += "</div>";
        addItemHtml += "</div>";
        addItemHtml += "<ul class='fp_comment_inner_list'></ul>";
        addItemHtml += "</li>";
        addItemHtml += "";
        return addItemHtml;
    }, "");
}

/* TAB-0 상세보기 호출 처리 */
window.goMovieInfoCallback = function (result) {
    movieInfoOption.loadCompleteYn = 'Y';
    var eventDisplayCheck = 0;
    if (result.CHART_DISPLAY_YN == 'N') {
        $("div.fp_chart_wrap").hide();
        /* 관람객수 */
        $("span.fp_detailView_count").text("");
        /* 기준일자 */
        $("span.fp_detailView_data").text("");
    } else {
        eventDisplayCheck++;
        $("div.fp_chart_wrap").show();
        /* 남성 / 여성 비율 */
        var tFr = Math.min(Math.floor(result.reservationDate.TicketFemaleRate), 99);
        var tMr = Math.min(Math.floor(result.reservationDate.TicketMaleRate), 99);
        var tDiR = 100 - (tFr + tMr);
        if (tDiR < 100) {
            if (tFr >= tMr) {
                tMr += tDiR;
            } else {
                tFr += tDiR;
            }
        }
        /* 10대, 20대, 30대, 40대, 50대 비율 */
        var t10r = Math.min(Math.round(result.reservationDate.Ticket10AgeRate), 99);
        var t20r = Math.min(Math.round(result.reservationDate.Ticket20AgeRate), 99);
        var t30r = Math.min(Math.round(result.reservationDate.Ticket30AgeRate), 99);
        var t40r = Math.min(Math.round(result.reservationDate.Ticket40AgeRate), 99);
        var t50r = Math.min(Math.round(result.reservationDate.Ticket50AgeRate), 99);
        if (gradeCd == "232") { /* 청불인경우 */
            t20r += t10r;
            t10r = 0;
        }

        var tMaxr = Math.max(t10r, t20r, t30r, t40r, t50r);
        if (tMr + tFr + t10r + t20r + t30r + t40r + t50r == 0) {
            $(".fp_chart").hide();
            $("div.fp_chart_wrap").addClass('without-before-element');
            $("div.fp_chart_wrap").remove();
        } else {
            /* 관람객수 */
            cgvAnimatePlay(Number(result.MovieScoreList[0].accrued_SCORE), function (num) {
                $("span.fp_detailView_count").text(num.format());
            });
            /* 기준일자 */
            $("span.fp_detailView_data").text(result.baseDate.substr(0, 8).format("XXXX.XX.XX 기준"));
            [ [ tMr, "m" ], [ tFr, "w" ] ].forEach(function (o) {
                cgvAnimatePlay(o[0], function (num) {
                    $("div.fp_chart div.fp_chart_L div.fp_chart_" + o[1] + " span.per").css("height", num + "%");
                    $("div.fp_chart div.fp_chart_L div.fp_chart_" + o[1] + " span.perTxt").text(num);
                });
            });
            $("ul.fp_chart_bar li").removeClass("top");
            [ [ t10r, "10" ], [ t20r, "20" ], [ t30r, "30" ], [ t40r, "40" ], [ t50r, "50" ] ].forEach(function (o) {
                cgvAnimatePlay(o[0], function (num) {
                    $("li[data-Ticket" + o[1] + "Age] .per").css("height", (num * 100 / tMaxr) + "%");
                    $("li[data-Ticket" + o[1] + "Age] .perTxt").text(num);
                    if (tMaxr == num) {
                        $("li[data-Ticket" + o[1] + "Age]").addClass("top");
                    }
                });
            });
            $(".fp_chart").show();
        }
    }

    /* 감독,배우 리스트 */
    $("ul.fp_movieOfficials_list").html("");
    if (isNull(result.moviePeopleList) == false && result.moviePeopleList.length > 0) {
        eventDisplayCheck++;
        $("div.fp_movieOfficials_wrap").show();
        var peopleHtml = result.moviePeopleList.reduce(function (addHtml, people, idx) {
            addHtml += "<li>";
            addHtml += "<a href='javascript:void(0)' onclick='fnMoviePersonInfoView(\"" + people.peopleIdx + "\", \"" + people.koreaName + "\");'>";
            addHtml += "<div class='img_wrap'>";
            addHtml += "<img src='" + people.cpl_IMAGE_LINK2 + "' alt='" + people.koreaName + "'>";
            addHtml += "</div>";
            addHtml += "<strong>" + people.koreaName + "</strong>";
            if (people.gubun == 0) {
                addHtml += "<span>감독</span>";
            } else {
                addHtml += "<span>" + people.movieCast + "</span>";
            }
            addHtml += "</a>";
            addHtml += "</li>";
            return addHtml;
        }, "");
        $("ul.fp_movieOfficials_list").html(peopleHtml);
        GaObject.setGaEventTag('movieOfficials');
    } else {
        $("div.fp_movieOfficials_wrap").hide();
    }
    /* 이벤트 배너 */
    if (IsWebView_Master == true) {
        if (!isNull(result.FanAd.IMG_URL2)) {
            var movieInfoBanner = "";
            movieInfoBanner += "<a href='javascript:void(0);' onclick=\"fanAdLink('" + result.FanAd.LINK_URL + "', '" + result.FanAd.AD_TYPE + "')\" style='display:block;'>";
            movieInfoBanner += "<img src='" + result.FanAd.IMG_URL2 + "' alt='광고' style='height:100px;'>";
            movieInfoBanner += "</a>";
            $("div#movieInfoBanner").css("background-color", result.FanAd.BG_COLOR).html(movieInfoBanner);
        }
    } else {
        $("div#movieInfoBanner").html(
                "<iframe id='iframe' title='모바일광고' src='http://ad.cgv.co.kr/NetInsight/html/CGV/CGV_201401/mobile_05@web_Movieinfo?keyword=" + strMovieIdx
                        + "' width='100%' frameborder='0' scrolling='no' topmargin='0' leftmargin='0' marginwidth='0' marginheight='0'></iframe>")
    }

    /* 트레일러 */
    $("ul.fp_trailer_list").html("");
    $("strong.fp_trailer_title").attr("data-count", result.movieTrailerList.length);
    if (result.movieTrailerList.length > 0) {
        eventDisplayCheck++;
        var listImgUrl = result.movieTrailerList[0].listimg_URL;
        var listImgUrlSplit = listImgUrl.lastIndexOf("_");

        $("div.fp_trailer").show();
        var trailerHtml = result.movieTrailerList.reduce(function (addHtml, trailer, idx) {
            addHtml += "<li>";
            addHtml += "<a href='javascript:void(0)'>";
            addHtml += "<div class='video_box'>";
            addHtml += "<video video_mType='trailer' id='video_trailer_" + idx + "' preload='none' controlslist='nodownload' playsinline webkit-playsinline >";
            addHtml += "<source src='" + trailer.flash_URL + "' type='video/mp4'>";
            addHtml += "<p>video를 지원하지 않는 브라우저입니다.</p>";
            addHtml += "</video>";
            addHtml += "<img src='" + trailer.listimg_URL + "' alt=''>";
            addHtml += "</div>";
            addHtml += "<div class='txtbox'>" + trailer.title + "</div>";
            addHtml += "</a>";
            addHtml += "</li>";
            return addHtml;
        }, "");
        $("ul.fp_trailer_list").html(trailerHtml);
        fnapageVideos = document.querySelectorAll("video[video_mType='trailer']");
        enableVideoTrailer();
        GaObject.setGaEventTag('movieInfoTrailer');
    } else {
        $("div.fp_trailer").hide();
    }
    /* 포스터스틸컷 */
    $("div.movie_gallery ul").html("");

    var listLength = result.movieStillcutList.length;
    $("strong.fp_poster_steelCut_title").attr("data-count", listLength);

    if (listLength > 0) {
        $("div.fp_poster_steelCut_wrap").show();
        var stillcutHtml = result.movieStillcutList.reduce(function (addHtml, stillcut, idx) {
            addHtml += "<li class='photobox'>";
            addHtml += "<a class='inner " + ((idx > 4) ? "allview" : "") + " port' href='javascript:void(0)' onclick='fnStillcutView(\"" + (idx + 1) + "\");'>";
            addHtml += "<img src='" + stillcut.zoomimg_URL + "' alt=''>";
            addHtml += "</a>";
            if (idx == 4 && listLength > 5) {
                addHtml += "<a href='javascript:void(0)' class='btn_movie_gallery_more' data-count='" + listLength + "'></a>";
            }
            addHtml += "</li>";
            return addHtml;
        }, "");
        $("div.movie_gallery ul").html(stillcutHtml);

        GaObject.setGaEventTag('movieInfoStillCut');
        $('.btn_movie_gallery_more').off("click").on("click", function () {
            $('.movie_gallery').addClass('active');
            $(this).remove();
        });
        $('.movie_gallery img').each(function (i) {
            var hori = this.naturalWidth / this.naturalHeight;
            if (hori >= 1) {
                $(this).closest('.photobox').addClass('horizontal');
            }
        });
    } else {
        $("div.fp_poster_steelCut_wrap").hide();
    }

    if (eventDisplayCheck == 0) {
        $("li#view_tab_0 div.fp_poster_steelCut_wrap").insertBefore("li#view_tab_0 div#movieInfoBanner");
        $("li#view_tab_0 div.fp_poster_steelCut_wrap").css("padding-top", "20px");
        $("li#view_tab_0 div#movieInfoBanner").css("padding-bottom", "20px");
        if (listLength == 0)
            return;
    }

    /* 관련 영화 */
    $("ul.fp_relatedMoviesView_list").html("");
    if (result.movieSeries.length > 0) {
        $("div.fp_relatedMoviesView").show();
        var seriesHtml = result.movieSeries.reduce(function (addHtml, series, idx) {
            addHtml += "<li>";
            addHtml += "<a href='javascript:void(0)'  onclick='goSeries(\"" + series.MovieIdx + "\");'>";
            addHtml += "<div class='img_wrap'>";
            addHtml += "<img src='" + series.Poster + "' alt='" + series.GroupTitle + "'>";
            addHtml += "</div>";
            addHtml += "<strong>" + series.GroupTitle + "</strong>";
            addHtml += "<span>" + series.MakingYear + "</span>";
            addHtml += "</a>";
            addHtml += "</li>";
            return addHtml;
        }, "");
        $("ul.fp_relatedMoviesView_list").html(seriesHtml);
        GaObject.setGaEventTag("relatedMoviesView");
    } else {
        $("div.fp_relatedMoviesView").hide();
    }
}

/* TAB-1-0 관련소식 호출후 처리 */
window.goContentsIntoCallback = function (result) {
    contentListOption.pageInit();
    contentListOption.totCnt = result.contentsTotCnt;
    contentListOption.FanAd = result.FanAd;
    contentListOption.FanAdYn = 'N';

    if (contentListOption.totCnt > 0) {
        $("ul.com_tabStyle0_contents > li.active").show();
        getContentsList();
    } else {
        $("ul.com_tabStyle0_contents > li.active").hide();
    }
}

/* TAB-1-1 관련소식리스트 호출후 처리 */
window.goContentsListCallback = function (result) {
    if (contentListOption.listInitYn == 'Y') {
        contentListOption.listInitYn = 'N';
        $("div.cover_list > ul").html("");
    }
    if (result.listFanfageContents.length > 0) {
        var contentsHtml = getContentsListHtml(result);
        $("div.cover_list > ul").append(contentsHtml);
        fnapageVideos = document.querySelectorAll("video[video_mType='content']");
        if (fnapageVideos.length > 0) {
            enableVideosList();
        }
        GaObject.setGaEventTag('movieContentImageView,movieContentDetail,movieContentOpt')
        GaObject.setGaEventTag('movieContentGood,movieContentComment', 'Y');
        contentListOption.loaddingYn = 'N';
    } else {
        contentListOption.endRowYn = 'Y';
    }
}
/* TAB-2-0 실관람평정보 호출후 처리 */
window.getCommentsInfoCallback = function (result) {
    /* 실관람평 총건수 */
    commentListOption.pageInit();
    commentListOption.totCnt = parseInt(result.commentAverage.VIEW_WRITE_CNT);
    var _obj = $(".com_tabStyle0 > li[data-tab-index=2] > a > span");
    if (commentListOption.totCnt > 0) {
        _obj.attr("data_count", commentListOption.totCnt);
        _obj.attr("data-count", Number.abbrFormat(_obj.attr("data_count")));
        $("span.fp_comment_list_count").text(commentListOption.totCnt.format());
    } else {
        $("span.fp_comment_list_count").text(0);
    }
    /* 실관람평의 코멘트 등록 */
    var commentsInfoHtml = "";
    if (commentListOption.totCnt == 0) {
        $("div.movie-chart div.comment").addClass("no_comment");
        commentsInfoHtml += "<p><span class='line1'>등록된 실관람평이 아직 없습니다.</span></p>";
        commentsInfoHtml += "<p><span class='line2'><strong>첫번째 작성자</strong>가 되어주세요!</span></p>";
        $("div.chart_total").hide();
    } else {
        if (isNull(result.emotionDesc.CharmDescription) == false) {
            $("div.movie-chart div.comment").removeClass("no_comment");
            commentsInfoHtml += "<p><span class='line1'>" + result.emotionDesc.CharmDescription + result.emotionDesc.CharmIS + " " + result.emotionDesc.EggDescription + "</span></p>";
            commentsInfoHtml += "<p><span class='line2'>" + result.emotionDesc.EmotionDescription + " 영화</p>";
        } else {
            $("div.movie-chart div.comment").hide();
        }
        /* 매력포인트 , 감정포인트 */
        $("div.chart_total").show();
        var charmOpt = {
            key : [ "감독연출", "스토리", "영상미", "배우연기", "OST" ],
            value : [ "EFFECT_AVG", "STORY_AVG", "VISUAL_AVG", "ACTING_AVG", "OST_AVG" ]
        };
        var emotionOpt = {
            key : [ "Emotion3Text", "Emotion4Text", "Emotion5Text", "Emotion1Text", "Emotion2Text" ],
            value : [ "Emotion3Avg", "Emotion4Avg", "Emotion5Avg", "Emotion1Avg", "Emotion2Avg" ]
        };
        var chartCharm = makeChart("charm", [ 0, 1, 2, 3, 4 ].map(function (idx) {
            return {
                key : charmOpt.key[idx],
                value : result.commentAverage[charmOpt.value[idx]]
            };
        }), "#FB8C43");
        var chartEmotion = makeChart("emotion", [ 0, 1, 2, 3, 4 ].map(function (idx) {
            return {
                key : result.movieEmotion[emotionOpt.key[idx]],
                value : result.commentAverage[emotionOpt.value[idx]]
            };
        }), "#FB4357");
    }
    $("div.movie-chart div.comment").html(commentsInfoHtml);

    /* 해쉬태그 리스트 */
    $("div.hashtagbox_wrap ul.hashtagbox_list").html("");
    if (isNull(result.hashTagList) == false) {
        $("div.hashtagbox_wrap").show();
        var hashTabHtml = result.hashTagList.reduce(function (addHtml, hashTab, idx) {
            addHtml += "<li><a href='javascript:void(0)' onclick='fnHashTagViewNew(\"" + hashTab + "\");'>#" + hashTab + "</a></li>";
            return addHtml;
        }, "");
        $("div.hashtagbox_wrap ul.hashtagbox_list").html(hashTabHtml);
    } else {
        $("div.hashtagbox_wrap").hide();
    }
    /* 굿리뷰어 */
    var goodReviewerHtml = "";
    $("div.good_reviewer").html("");
    if (isNull(result.GoodReviewerList) == false) {
        var gr_cmtsRegId = result.GoodReviewerList.UserID;
        var gr_likeYn = result.GoodReviewerList.LIKE_YN;
        var gr_cmtsImgSrc = result.GoodReviewerList.BACK_IMG_URL || result.GoodReviewerList.BG_IMG_URL;
        var gr_commentIdx = result.GoodReviewerList.CommentIdx || result.GoodReviewerList.COMMENT_IDX;
        var gr_userImgSrc = result.GoodReviewerList.UserSmallImage || result.GoodReviewerList.USER_IMG;
        var gr_userNickName = result.GoodReviewerList.NickName || result.GoodReviewerList.USER_INFO;
        var gr_comment = result.GoodReviewerList.CommentText || result.GoodReviewerList.COMMENT;
        var gr_movieName = result.GoodReviewerList.MOVIE_TITLE || result.GoodReviewerList.MOVIE_NAME;
        var gr_goodCnt = result.GoodReviewerList.GoodTotCnt || result.GoodReviewerList.GOOD_CNT;
        goodReviewerHtml += "<div class='reviewerbox' comment_idx='" + gr_commentIdx + "' cmts_reg_id='" + gr_cmtsRegId + "' cmts_gubun='0'>";
        goodReviewerHtml += "<img src='" + gr_cmtsImgSrc + "' alt='' class='bg_moviecut'>";
        goodReviewerHtml += "<div class='reviewer'>";
        goodReviewerHtml += "<div class='pic'><img src='" + (isNull(gr_userImgSrc) ? "" : result.strImageServer + gr_userImgSrc)
                + "' alt='' onerror='this.src=\"http://img.cgv.co.kr/WebApp/images/movieinfo/noimg_mark_poto.png\"'></div>";
        goodReviewerHtml += "<span class='info'><span class='nick'>" + gr_userNickName + "</span>님의 관람평입니다</span>";
        goodReviewerHtml += "</div>";
        goodReviewerHtml += "<div class='txtbox'>";
        goodReviewerHtml += "<div class='inner'>";
        goodReviewerHtml += "<p>" + gr_comment.split(/\n|\r\n/g).join("<br/>") + "</p>";
        goodReviewerHtml += "<span class='movie'>&lt;" + gr_movieName + "&gt; 굿 리뷰</span>";
        goodReviewerHtml += "</div>";
        goodReviewerHtml += "</div>";
        goodReviewerHtml += "<div class='likebox'>";
        goodReviewerHtml += "<span class='likeit " + (gr_likeYn == 'Y' ? "on" : "") + "'>";
        goodReviewerHtml += "<a href='javascript:;' onclick=\"fnInsComtsGood('" + gr_commentIdx + "',$(this), '" + gr_cmtsRegId + "');\"><em>좋아요</em><span class='count'>" + gr_goodCnt
                + "명</span><span>ㆍ공감해요</span></a>";
        goodReviewerHtml += "</span>";
        goodReviewerHtml += "</div>";
        goodReviewerHtml += "</div>";
        $("div.good_reviewer").html(goodReviewerHtml);
        $("div.good_reviewer").show();
    } else {
        $("div.good_reviewer").hide();
    }
    if (commentListOption.totCnt > 0) {
        $("div.fp_comment_list_wrap").show();
        getCommentsList();
    } else {
        $("div.fp_comment_list_wrap").hide();
    }
}

/* TAB-2-1 실관람평리스트 호출후 처리 */
window.getCommentsListCallback = function (result) {
    if (commentListOption.listInitYn == 'Y') {
        commentListOption.listInitYn = 'N';
        $("div.fp_comment_list_wrap ul.fp_comment_list").html("");
    }

    if (!isNull(result.movieCommentList) && result.movieCommentList.length > 0) {
        var commentsListHtml = getCommentsListHtml(result);
        $("div.fp_comment_list_wrap ul.fp_comment_list").append(commentsListHtml);

        var slideDuration = $("div.fp_comment_list_wrap ul.fp_comment_list li").length * 50;
        $("div.fp_comment_list_wrap ul.fp_comment_list").slideDown(slideDuration);

        commentListOption.maxCmtIdx = (commentListOption.maxCmtIdx == 0) ? result.movieCommentList[0].CommentIdx : commentListOption.maxCmtIdx;
        // 이벤트 처리
        $("div.fp_comment_list_wrap ul.fp_comment_list li a[data-popup]").off("click").on("click", function () {
            var isOnclick = $(this).data('popupOnclick') || false;
            if (!isOnclick) {
                var _obj = event.target;
                var $_commentParent = $(event.target).parents("li[comment_idx]");
                var commentIdx = $_commentParent.attr("comment_idx");
                var cmtsRegId = $_commentParent.attr("cmts_reg_id");
                var popupTarget = $(this).data('popup') || null;
                var popupDir = $(this).data('popup-direction') || null;
                var popupDepth = $(this).data('popup-depth') || null;
                $('#' + popupTarget).attr("comment_idx", commentIdx);
                $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
                $('#' + popupTarget).attr("reply_idx", "");
                $('#' + popupTarget).attr("cmts_gubun", "1");
                $('#' + popupTarget).attr("target_gbn", "comments");
                $.fn.openPopup(popupTarget, popupDir, popupDepth);
            }
        });
        $("li[comment_idx] input#checkCommentHeart0").off("click").on("click", fnInsComtsGood);
        $("li[comment_idx] a.btn_comment").off("click").on("click", fnCommentReplayReg);
        $("li[comment_idx] a.btn_reply").off("click").on("click", function () {
            var $_commentParent = $(event.target).parents("li[comment_idx]");
            if ($_commentParent.find("ul.fp_comment_inner_list").hasClass("active")) {
                var slideDuration = $_commentParent.find("ul.fp_comment_inner_list li").length * 50;
                $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").slideUp(slideDuration, function () {
                    $(this).children().remove();
                    $(this).css("display", "none");
                });
            } else {
                var data_count = parseInt($(event.target).attr("data-count")||"0");
                var commentIdx = $_commentParent.attr("comment_idx");
                fnCmtsPreviewReply(commentIdx, $(event.target), data_count);
            }
        });

        $(".btn_allView").unbind("click").bind("click", function () {
            $(this).parents('.add_img_wrap').addClass('fullView');
            $(this).remove();
        });
        commentListOption.loaddingYn = 'N';
        GaObject.setGaEventTag('movieCommentGood,movieCommentReply', 'Y');
        GaObject.setGaEventTag('movieCommentReplyView');
    } else {
        commentListOption.endRowYn = 'Y';
    }
}

/* TAB-0 상세보기 호출 */
window.getMovieInfo = function () {
    $.ajaxCgv({
        url : "/fanpage/movieInfo",
        data : JSON.stringify({
            movieIdx : strMovieIdx
        }),
        success : function (result) {
            goMovieInfoCallback(result);
        }
    });
}

/* TAB-1-0 관련소식 호출 */
window.getContentsInto = function () {
    $.ajaxCgv({
        url : "/fanpage/contentsInfo",
        data : JSON.stringify({
            movieIdx : strMovieIdx
        }),
        success : function (result) {
            goContentsIntoCallback(result);
        }
    });
}

/* TAB-1-1 관련리스트 호출 */
window.getContentsList = function () {
    if (contentListOption.endRowYn == 'Y')
        return false;
    var paramData = {};
    paramData.movieIdx = strMovieIdx;
    paramData.pageStart = contentListOption.pageStart;
    paramData.pageSize = contentListOption.pageSize;
    $.ajaxCgv({
        url : "/fanpage/contentsList",
        data : JSON.stringify(paramData),
        success : function (result) {
            goContentsListCallback(result);
        }
    });
}

/* TAB-2-0 실관람평정보 호출 */
window.getCommentsInfo = function () {
    $.ajaxCgv({
        url : "/fanpage/movieCommentsInfo",
        data : JSON.stringify({
            movieIdx : strMovieIdx
        }),
        success : function (result) {
            getCommentsInfoCallback(result);
        }
    });
}

/* TAB-2-1 실관람평리스트 호출 */
window.getCommentsList = function () {
    if (commentListOption.endRowYn == 'Y' || commentListOption.totCnt == 0)
        return false;
    var paramData = {};
    paramData.movieIdx = strMovieIdx;
    paramData.pageStart = commentListOption.pageStart;
    paramData.pageSize = commentListOption.pageSize;
    paramData.orderType = commentListOption.orderType;
    paramData.filterType = commentListOption.filterType;
    paramData.maxCmtIdx = commentListOption.maxCmtIdx;
    $.ajaxCgv({
        url : "/fanpage/movieCommentsList",
        data : JSON.stringify(paramData),
        delayYn : true,
        success : function (result) {
            getCommentsListCallback(result);
        }
    });
};
/* TAB 변경 */
/*
 * -->MENU getMovieInfo >>> TAB-0 상세보기 호출 goMovieInfoCallback
 *
 * getContentsInto >>> TAB-1-0 관련소식 호출 goContentsIntoCallback getContentsList >>> TAB-1-1 관련리스트 호출 goContentsListCallback - getContentsListHtml
 *
 * getCommentsInfo >>> TAB-2-0 실관람평정보 호출 getCommentsInfoCallback getCommentsList >>> TAB-2-1 실관람평리스트 호출 getCommentsListCallback - getCommentsListHtml
 *
 */

window.goToTab = function (tabIndex) {
    if (tabIndex == "0") {
        if (movieInfoOption.loadCompleteYn == 'N') {
            getMovieInfo();
        }
    } else if (tabIndex == "1") {
        getContentsInto();
    } else if (tabIndex == "2") {
        getCommentsInfo();
    }
};

window.fnCommentDetailView = function () {
    var url = "/fanpage/movieCmtsList";
    document.forms[0].gubun.value = "C";
    document.forms[0].commentIdx.value = $(event.target).parents("#popWriteEditor").attr("comment-idx");
    var data = $(document.forms[0]).serialize();
    $("div#commentView").load(url, data, function () {
    });
};

window.fnGetCommentsCopy = function (gubun) {
    var $_commentParent = $(event.target).parents("div[comment_idx]");
    var commentIdx = $_commentParent.attr("comment_idx");
    var replyIdx = $_commentParent.attr("reply_idx") || "";
    var targetGbn = "";
    if (replyIdx == "") {
        if ($("div#popHashTag li[comment_idx='" + commentIdx + "']").length > 0) {
            targetGbn = "hashComments";
        } else {
            targetGbn = "comments";
        }
    } else {
        if ($("div#popHashTag li[comment_idx='" + commentIdx + "'][reply_idx='" + replyIdx + "']").length > 0) {
            targetGbn = "hashComments";
        } else {
            targetGbn = "comments";
        }
    }
    var $_targetObj;
    if (targetGbn == "comments") {
        if (gubun == "RC") {
            $_targetObj = $("div.fp_comment_list_wrap ul.fp_comment_list li[comment_idx='" + commentIdx + "']").find("div.writer_comment").first();
        } else if (gubun == "RR") {
            $_targetObj = $("div.fp_comment_list_wrap ul.fp_comment_list li[comment_idx='" + commentIdx + "'][reply_idx='" + replyIdx + "']").find("div.writer_comment").first();
        }
    } else {
        if (gubun == "RC") {
            $_targetObj = $("div.container_content ul.fp_comment_list li[comment_idx='" + commentIdx + "']").find("div.writer_comment").first();
        } else if (gubun == "RR") {
            $_targetObj = $("div.container_content ul.fp_comment_list li[comment_idx='" + commentIdx + "'][reply_idx='" + replyIdx + "']").find("div.writer_comment").first();
        }
    }
    var text = $_targetObj.text();
    text = text.replaceAll("<br>", "\n");

    gfnGetCommentsCopy(text);
};

window.fnWishPopUpDisplay = function () {
    if (!loginCheck()) {
        return false;
    }
    var user_wish_yn = $(event.target).attr("user_wish_yn");
    $("#popFpExpect").attr("user_wish_yn", user_wish_yn);
    $("#popFpExpect").find("a[user_wish_yn]").removeClass("selected");
    $("#popFpExpect").find("a[user_wish_yn='" + user_wish_yn + "']").addClass("selected");
    $.openExpect($(event.target), 'popFpExpect', 'UP');
};

window.fnSetWishYn = function (clickWishFlag) {
    if (!loginCheck()) {
        return false;
    }
    var _this = event.target;
    var $_this = isNull($(_this).attr("user_wish_yn")) ? $(_this).parent() : $(_this);
    var $_parent = $_this.parents("div#popFpExpect.popup_dim");
    var chkWishFlag = $_parent.attr("user_wish_yn");
    var wishFlag = $_this.attr("user_wish_yn");
    wishFlag = (wishFlag == chkWishFlag) ? "N" : wishFlag;
    $("#popFpExpect").find("a[user_wish_yn]").removeClass("selected");
    $("#popFpExpect").find("a[user_wish_yn='" + wishFlag + "']").addClass("selected");
    var kind = "FG";
    var seqWish = "";
    $.ajax({
        method : "post",
        url : "/fanpage/mainOpt",
        dataType : "json",
        data : {
            optKind : "FG",
            movieIdx : strMovieIdx,
            seqWish : seqWish,
            wishFlag : (wishFlag == "N" ? "" : wishFlag)
        },
        success : function (result) {
            if (result.result_code == "success") {
                if (result.resultCd == "1") { // 정상 resultCd 값이 1로 변경됨
                    if (wishFlag == "N") {
                        $.closeExpect(_this, 'btn_fp_expect', 'popFpExpect', wishFlag);
                        alert("프리에그를 선택하지 않았습니다.\n‘기대되요!’를 선택하시면 ‘기대되는 영화’에 추가됩니다.");
                        return false;
                    }
                    if (wishFlag != 'Y' && chkWishFlag == 'Y') {
                        alert("‘기대되는 영화’에서 삭제되었습니다.");
                    }
                } else {
                    alert('처리 중 에러가 발생하였습니다.\n잠시 후에 다시 이용해 주세요.');
                }
                $.closeExpect(_this, 'btn_fp_expect', 'popFpExpect', wishFlag);
            }
        },
        error : function () {
            alert('처리 중 에러가 발생하였습니다.\n잠시 후에 다시 이용해 주세요.');
        }
    });
};

window.fnCommentReplayReg = function () { // APP구분 추가
    if (!loginCheck()) {
        return false;
    }
    var isOnclick = $(this).data('popupOnclick') || false;
    if (!isOnclick) {
        var $_commentParent = $(event.target).parents("li[comment_idx]");
        var commentIdx = $_commentParent.attr("comment_idx") || "";
        var cmtsRegId = $_commentParent.attr("cmts_reg_id") || "";
        var targetGbn = $_commentParent.attr("target_gbn") || "comments";
        var popupTarget = "popCommentReplyWrite";
        var popupDir = "UP";
        var popupDepth = 1;
        var commentContent = "";
        $('#' + popupTarget).attr("comment_idx", commentIdx);
        $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
        $('#' + popupTarget).attr("reply_idx", "");
        $('#' + popupTarget).attr("cmts_gubun", "2");
        $('#' + popupTarget).attr("old_file_url", "");
        $('#' + popupTarget).attr("target_gbn", targetGbn);
        $('#' + popupTarget).find("textarea#commentContent").val(commentContent);
        $('#' + popupTarget).find("strong.myComments_title").text("댓글달기");
        $('#' + popupTarget).find("a.btn_enrollment").off("click").on("click", function () {
            fnCommentReplayRegSave('SC');
        }).text("등록");
        $.fn.openPopup(popupTarget, popupDir, popupDepth);
        fileObject.readyCommentReplayRegContentsEdit("C");
    }
};
window.fnCommentReplyView = function () { // APP구분 추가
    if (!loginCheck()) {
        return false;
    }
    var isOnclick = $(this).data('popupOnclick') || false;
    if (!isOnclick) {
        var $_commentParent = $(event.target).parents("div[comment_idx]");
        var commentIdx = $_commentParent.attr("comment_idx") || "";
        var replyIdx = $_commentParent.attr("reply_idx") || "";
        var cmtsRegId = $_commentParent.attr("cmts_reg_id") || "";
        var oldFileUrl = $_commentParent.attr("old_file_url") || "";
        var targetGbn = $_commentParent.attr("target_gbn") || "comments";
        var popupTarget = "popCommentReplyWrite";
        var popupDir = "UP";
        var popupDepth = 1;
        var commentContent = $("ul.fp_comment_inner_list li[comment_idx='" + commentIdx + "'][reply_idx='" + replyIdx + "']").find("div.writer_comment").text();
        $('#' + popupTarget).attr("comment_idx", commentIdx);
        $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
        $('#' + popupTarget).attr("reply_idx", replyIdx);
        $('#' + popupTarget).attr("old_file_url", oldFileUrl);
        $('#' + popupTarget).attr("cmts_gubun", "2");
        $('#' + popupTarget).attr("target_gbn", targetGbn);
        $('#' + popupTarget).find("textarea#commentContent").val(commentContent);
        $('#' + popupTarget).find("strong.myComments_title").text("댓글수정");
        $('#' + popupTarget).find("a.btn_enrollment").off("click").on("click", function () {
            fnCommentReplayRegSave('SR');
        }).text("수정");
        $.fn.openPopup(popupTarget, popupDir, popupDepth);
        fileObject.readyCommentReplayRegContentsEdit("R", oldFileUrl);
    }
}

window.fnCommentReplyDel = function () {
    if (!loginCheck()) {
        return false;
    }
    if (!confirm("삭제하시겠습니까?")) {
        return;
    }
    var $_commentParent = $(event.target).parents("div[comment_idx]");
    var commentIdx = $_commentParent.attr("comment_idx");
    var replyIdx = $_commentParent.attr("reply_idx");
    var targetGbn = $_commentParent.attr("target_gbn") || "comments";
    sData = {
        movieIdx : strMovieIdx,
        commentIdx : commentIdx,
        gubun : "SD",
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
            var $_commentParent = targetGbn == "comments" ? $("div.fp_comment_list_wrap ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']").has("[reply_idx]") : $(
                    "div#popHashTag ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']").has("[reply_idx]");
            var $_obj_reply = $_commentParent.find(".btn_reply");
            var data_count = parseInt($_obj_reply.attr("data-count")) - 1;
            $_obj_reply.attr("data-count", data_count);
            $_commentParent.find("[reply_idx='" + sData.replyIdx + "']").remove();
            if (data_count == 0) {
                $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").css("display", "none");
            }
        },
        error : function () {
            location.href = gateURL + "Fanpage/Gateway.aspx?movieIdx=" + strMovieIdx + "&fanpageReturnUrl=" + encodeURIComponent("mainView?movieIdx=" + strMovieIdx + "&iTab=2");
        }
    });

}

window.fnCommentView = function () {
    if (!loginCheck()) {
        return false;
    }
    var commentIdx = "", gubun = "";
    if ($(event.target).attr("class") == "btn_actualReview" || $(event.target).attr("class") == "btn_audienceWrite") {
        if ($(event.target).attr("class") == "btn_audienceWrite") {
            writeGbn = "mainTab";
        } else {
            writeGbn = "commentTab";
        }
        gubun = "C";
    } else {
        commentIdx = $(event.target).parents("#popWriteEditor").attr("comment_idx");
        gubun = "R";
    }
    if (IsView == "N") {
        alert("실관람객에 한하여 관람평 작성이 가능합니다.");
        return;
    } else if (gubun == 'C' && myCmtWriteYn == "Y") {
        alert("이미 실관람평을 작성하셨습니다.");
        return;
    } else {
        var url = "/fanpage/movieCmtsList?gubun=" + gubun + "&movieIdx=" + strMovieIdx + "&commentIdx=" + commentIdx;

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
    }
};

window.fnMovieShare = function () {
    if (IsWebView_Master) {
        fnShareContents(movieGroupTitle, undefined, strMovieIdx, $(this));
    } else {
        var $_obj = $("#popFpShare");
        $.fn.openPopup("popFpShare", "UP", null);
        $_obj.attr('cont-src', movieGroupTitle);

    }
};

window.egg_info_btn = function () {
    alert("Pre Egg는 개봉 전 영화에 대한\n기대 평가 입니다.\n\nGolden Egg는 실관람객의\n영화 관람 후 평가 입니다.");
};

window.setMainEvent = function () {
    $('[data-tab]').off('click');
    $(".synopsis_wrap a.btn_synopsis_more").off("click").on("click", function (e) {
        var $target = $(e.target);
        var isOpen = $target.prev('.synopsis').hasClass('opened');

        if (isOpen) {
            $target.prev('.synopsis').removeClass('opened');
            $target.text('더보기');
        } else {
            $target.prev('.synopsis').addClass('opened');
            $target.text('접기');
        }
    });

    $("header#headerTitle > a").off("click").on("click", function () {
        fnSiteMap();
    });
    $(".fp_comment_filterBtn_wrap .btn_filter.type1").off("click").on("click", function () {
        var x = $('.btn_filter.type1').text();
        if (x == '최신순') {
            $('.btn_filter.type1').text('공감순');
            $('.btn_filter.type1').attr("order-src", 1);
            commentListOption.orderType = 1;
        } else {
            $('.btn_filter.type1').text('최신순');
            $('.btn_filter.type1').attr("order-src", 0);
            commentListOption.orderType = 0;
        }
        commentListOption.listInitYn = 'Y';
        commentListOption.pageInit();
        getCommentsList();
    });
    $("#popFpFilter div.container_content a").off("click").on("click", function () {
        $.fn.closePopup('popFpFilter', this);
        if ($(this).attr("class").indexOf("all") > -1) { // 전체보기
            commentListOption.filterType = 0;
        } else if ($(this).attr("class").indexOf("good") > -1) { // 좋았어요
            commentListOption.filterType = 1;
        } else if ($(this).attr("class").indexOf("bad") > -1) { // 별로에요
            commentListOption.filterType = 2;
        }
        commentListOption.listInitYn = "Y";
        commentListOption.pageInit();
        getCommentsList();
    });
    GaObject.setGaEventTag({
        eventAction : 'movieCommentOrder',
        eventLogObject : {
            getActionText : function (event) {
                var actionText = "";
                if (commentListOption.orderType == 0) {
                    actionText = "실관람평_최신순";
                } else {
                    actionText = "실관람평_공감순";
                }
                GaObject.newCgvGaKey($(event.target));
                return actionText;
            }
        }
    });
    GaObject.setGaEventTag('movieCommentFilter');

    $('[data-tab] li').off("click").on("click", function (e) {
        var tabIndex = $(this).attr("data-tab-index");
        var url = "/fanpage/mainView?movieIdx=" + strMovieIdx + "&iTab=" + tabIndex;
        location.replace(url);
        // goToTab(tabIndex);
    });
    $(window).on("scroll", function (e) {
        var tabIndex = $('[data-tab] li.active').attr("data-tab-index");
        if ($(window).scrollTop() >= ($(document).height() - $(window).height()) * 0.9 && $(window).scrollTop() >= ($(document).height() - $(window).height()) - 100) {
            if (tabIndex == "1") {
                if (contentListOption.loaddingYn == 'N') {
                    contentListOption.scrollTop = $(window).scrollTop();
                    if (contentListOption.totCnt > (contentListOption.pageStart * contentListOption.pageSize)) {
                        contentListOption.loaddingYn = 'Y';
                        contentListOption.pageStart++;
                        getContentsList();
                    }
                }
            } else if (tabIndex == "2") {
                if (commentListOption.loaddingYn == 'N') {
                    commentListOption.scrollTop = $(window).scrollTop();
                    if (commentListOption.totCnt > (commentListOption.pageStart * commentListOption.pageSize)) {
                        commentListOption.loaddingYn = 'Y';
                        commentListOption.pageStart++;
                        getCommentsList();
                    }
                }
            }
        }
    });
    // 실관람평 이벤트 등록
    $("div.actualReview_wrap").show();
    $("div.actualReview_wrap a.btn_actualReview").off("click").on("click", fnCommentView);
    GaObject.setGaEventTag("moveCommentWrite", "Y");
    // 실관람평 댓글
};

window.fnMyCmtWrite = function () {
    /* 실관람객 안내(개인화) */
    if (IsView == 'Y') {
        if (myCmtWriteYn == "N") {
            $("a.btn_audienceWrite").show();
            if ($(".actualAudience span").text() == "") {
                $(".actualAudience span").text(strUserId.maskingInfo());
            }
            $("a.btn_audienceWrite").off("click").on("click", fnCommentView);
            GaObject.setGaEventTag('mainMovieWrite', 'Y');
        } else {
            $("a.btn_audienceWrite").hide();
        }
    } else {
        $(".actualAudience").remove();
    }
};

window.fnCoveImageEffects = function () {
    return;
    // 커버이미지 반복
    var $box1 = $("div.fp_slide .item.coverImage").find("div.box1");
    var $box2 = $("div.fp_slide .item.coverImage").find("div.box2");
    var reloadTime = 5000;

    if ($box1.length) {
        var box1_class = $box1.attr("class").replace(/box1 /gi, "");
        if (box1_class != 'noEff') {
            setInterval(function () {
                $box1.removeClass(box1_class);
            }, reloadTime);

            setTimeout(function () {
                setInterval(function () {
                    $box1.addClass(box1_class);
                }, reloadTime);
            }, 1000);
        }
    }
    if ($box2.length) {
        var box2_class = $box2.attr("class").replace(/box2 /gi, "");
        setInterval(function () {
            $box2.removeClass(box2_class);
        }, reloadTime);

        setTimeout(function () {
            setInterval(function () {
                $box2.addClass(box2_class);
            }, reloadTime);
        }, 1000);
    }
}

window.mainInitValue = function () {
    /* movieInfo 정보 */
    var RunningTime = parseInt($(".movieInfo span#RunningTime").attr("data_value"));
    var strRunningTime = "";
    if ((RunningTime / 60) > 1) {
        strRunningTime = Math.floor(RunningTime / 60) + "시간";
    }
    if (RunningTime % 60 > 0) {
        strRunningTime += " " + (RunningTime % 60) + "분";
    }
    $(".movieInfo span#RunningTime").text(strRunningTime);
    $(".fp_hdbox ul.fp_btn_list .unitPercent").each(function (i, o) {
        var data_value = parseFloat($(o).attr("data_value"));
        data_value = Math.min(data_value, 99.0);
        if ($(o).attr("id") == "eggAvg") {
            if (data_value == 0) {
                $(o).parent().attr("class", "ico_good");
            } else if (data_value < 70) {
                $(o).parent().attr("class", "ico_bad");
            } else if (data_value < 90) {
                $(o).parent().attr("class", "ico_good");
            } else {
                $(o).parent().attr("class", "ico_great");
            }
        }
        if (data_value == 0 && $(o).attr("id") != "tkRate") {
            $(o).text("?");
        } else {
            cgvAnimatePlay(Math.round(data_value * 10) / 10, function (num) {
                $(o).text(num);
            });
        }
    });
    $("ul.fp_event span.eventDateBetween").each(function (i, o) {
        var startDate = $(o).attr("start_date");
        var endDate = $(o).attr("end_date");
        $(o).text(startDate.substring(0, 8).mCgvDateFormat({
            type : "",
            amAt : false,
            weekAt : true,
            hanYn : false
        }) + " ~ " + endDate.substring(0, 8).mCgvDateFormat({
            type : "Y",
            amAt : false,
            weekAt : true,
            hanYn : false
        }));
    });

    /* 실관람평 건수 */
    var _obj = $(".com_tabStyle0 > li[data-tab-index=2] > a > span");
    var data_count = parseInt(_obj.attr("data_count"));
    if (data_count >= 0) {
        _obj.attr("data-count", Number.abbrFormat(_obj.attr("data_count")));
    }

    // $('ul[data-tab] li[data-tab-index=' + iTab + ']').addClass("active").children("a").click();

    var synopsis = parseInt($(".synopsis_wrap").attr("synopsis_length"));
    if (synopsis < 0) {
        $(".synopsis_wrap").css("display", "none");
    } else {
        if ($(".synopsis").height() <= 75) {
            $(".btn_synopsis_more").hide();
            $(".synopsis").addClass("opened");
        } else {
            $(".btn_synopsis_more").text("더보기");
            $(".synopsis").removeClass("opened");
        }
        $(".synopsis").css("visibility", "visible");
        $(".btn_synopsis_more").css("visibility", "visible");
    }
    fnMyCmtWrite();

    /* 시작시 트레일러 비디오가 노출되는것 막기위해 처리 */
    $("div.fp_slide .video_box").css("visibility", "visible");

    fnapageVideos = document.querySelectorAll("video[video_mType='main_hotdeal']");
    enableVideoTrailer();

    fnCoveImageEffects();
    /* tabIndex에 따른 gotoTab */
    $('ul[data-tab] li[data-tab-index=' + iTab + ']').addClass("active");
    $('ul.com_tabStyle0_contents > li#view_tab_' + iTab).addClass("active");
    goToTab(iTab);
};
/* 시작 스크립트 */
$(document).ready(function () {
    setMainEvent();
    mainInitValue();
    GaObject.setGaEventTag({
        eventAction : 'mainTab',
        eventLogObject : {
            getActionText : function (event) {
                var actionText = "";
                if ($(event.target).closest("[data-tab-index]").attr("data-tab-index") == "0") {
                    actionText = "상세정보";
                } else if ($(event.target).closest("[data-tab-index]").attr("data-tab-index") == "1") {
                    actionText = "관련소식";
                } else if ($(event.target).closest("[data-tab-index]").attr("data-tab-index") == "2") {
                    actionText = "실관람평";
                }
                return actionText;
            }
        }
    });
    GaObject.setGaEventTag({
        eventAction : 'mainEvent',
        eventLogObject : {
            getLabelText : function (event) {
                return $(event.target).closest("li").find("strong").text().trim() || movieGroupTitle;
            }
        }
    });
    GaObject.setGaEventTag('movieInfoWish', 'Y');
    GaObject.setGaEventTag('movieInfoShare,movieInfoTicketing');
});

window.hashCommentListOption = {
    scrollTop : -1,
    listInitYn : 'Y',
    loaddingYn : 'N',
    totCnt : 0,
    endRowYn : 'N',
    PageIndex : 1,
    PageSize : 10,
    tag : ""
};
hashCommentListOption.init = function (gbn) {
    if (gbn == "page") {
        hashCommentListOption.listInitYn = 'Y';
        hashCommentListOption.scrollTop = -1;
        hashCommentListOption.PageIndex = 1;
        hashCommentListOption.PageSize = 10;
        hashCommentListOption.endRowYn = 'N';
        hashCommentListOption.tag = '';
    }
};
hashCommentListOption.setEvent = function () {
    $("div#popHashTag ul.fp_comment_list li a[data-popup]").off("click").on("click", function () {
        var isOnclick = $(this).data('popupOnclick') || false;
        if (!isOnclick) {
            var _obj = event.target;
            var $_commentParent = $(event.target).parents("li[comment_idx]");
            var commentIdx = $_commentParent.attr("comment_idx");
            var cmtsRegId = $_commentParent.attr("cmts_reg_id");
            var popupTarget = $(this).data('popup') || null;
            var popupDir = $(this).data('popup-direction') || null;
            var popupDepth = 1;
            $('#' + popupTarget).attr("comment_idx", commentIdx);
            $('#' + popupTarget).attr("cmts_reg_id", cmtsRegId);
            $('#' + popupTarget).attr("reply_idx", "");
            $('#' + popupTarget).attr("cmts_gubun", "1");
            $('#' + popupTarget).attr("target_gbn", "hashComments");
            $.fn.openPopup(popupTarget, popupDir, popupDepth);
        }
    });
    $("div#popHashTag ul.fp_comment_list li input#checkCommentHeart0").off("click").on("click", fnInsComtsGood);
    $("div#popHashTag ul.fp_comment_list li[comment_idx] a.btn_comment").off("click").on("click", fnCommentReplayReg);
    $("div#popHashTag ul.fp_comment_list li[comment_idx] a.btn_reply").off("click").on("click", function () {
        var $_commentParent = $(event.target).parents("li[comment_idx]");
        if ($_commentParent.find("ul.fp_comment_inner_list").hasClass("active")) {
            var slideDuration = $_commentParent.find("ul.fp_comment_inner_list li").length * 50;
            $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").slideUp(slideDuration, function () {
                $(this).children().remove();
                $(this).css("display", "none");
            });
        } else {
            var data_count = parseInt($(event.target).attr("data-count")||"0");
            var commentIdx = $_commentParent.attr("comment_idx");
            fnCmtsPreviewReply(commentIdx, $(event.target), data_count);
        }
    });
    $("div#popHashTag div.container_content").on(
            "scroll",
            function (e) {
                if ($("div#popHashTag div.container_content").scrollTop() >= ($("div#popHashTag div.container_content ul.fp_comment_list").height() - $("div#popHashTag div.container_content")
                        .height()) * 0.9) {
                    hashCommentListOption.scrollTop = $("div#popHashTag div.container_content ul.fp_comment_list").scrollTop();
                    if (hashCommentListOption.totCnt > (hashCommentListOption.PageIndex * hashCommentListOption.PageSize)) {
                        hashCommentListOption.loaddingYn = 'Y';
                        hashCommentListOption.PageIndex++;
                        fnHashTagDetailList();
                    }
                }
            });
    $("div#popHashTag ul.fp_comment_list li[comment_idx] .btn_allView").off("click").on("click", function () {
        $(this).parents('.add_img_wrap').addClass('fullView');
        $(this).remove();
    });
};
hashCommentListOption.getCommentList = function (result) {
    var strImageServer = result.strImageServer;
    var strImageServer2 = result.strImageServer2;
    return result.MovieCommentList.reduce(function (addItemHtml, item, idex) {
        addItemHtml += "<li comment_idx='" + item.CommentIdx + "' cmts_reg_id='" + item.UserID + "'  cmts_gubun='1' target_gbn='hashComments'>";
        addItemHtml += "<div class='img_wrap'>";
        addItemHtml += "<img src='" + (isNull(item.UserSmallImage) ? "" : item.UserSmallImage) + "' onerror=\"this.src='/images/fanpage/common/bg_profile_noImage.svg'\" alt=''/>";
        addItemHtml += "</div>";
        addItemHtml += "<div class='writer_wrap'>";
        addItemHtml += "<a href='javascript:void(0)' class='btn_fp_more' data-popup='" + (strUserId == item.UserID ? "popWriteEditor" : "popWorkEditor")
                + "' data-popup-direction='CENTER' tarent_gbn='hashComments' data-popup-depth='1'>더보기</a>";
        if (item.EggPoint == "1") {
            addItemHtml += "<strong class='state bad'>별로예요.</strong>";
        } else {
            addItemHtml += "<strong class='state good'>좋았어요!</strong>";
        }
        addItemHtml += "<p class='writer_info_wrap'>";
        addItemHtml += "<span class='writer_name'>" + (isNull(item.NickName) ? item.UserID.maskingInfo() : item.NickName) + "</span>";
        addItemHtml += "<span class='writer_date'>" + item.StrRegistDate.mCgvTimeFormat(result.sysdate) + "</span>";
        if (item.MediaCode.split("^").filter(function (o, i) {
            return !isNull(String.prototype.mediaCodeMap[o]);
        }) > 0) {
            addItemHtml += "<span class='writer_screenType'>" + item.MediaCode.split("\^").reduce(function (addItemHtml, code, k) {
                addItemHtml += code.codeToName() + " ";
                return addItemHtml;
            }, "").trim() + "</span>";
        }
        addItemHtml += "</p>";
        addItemHtml += "<div class='writer_comment' style='word-break:break-all;'>" + item.CommentText + "</div>";
        if (!isNull(item.FileUrl)) {
            addItemHtml += "<div class='add_img_wrap'>";
            addItemHtml += "<img src='" + strImageServer + item.FileUrl.replaceAll(strImageServer2, "") + "' alt='가로이미지 Sample'/>";
            addItemHtml += "<a href='javascript:void(0)' class='btn_allView'>이미지 모두보기</a>";
            addItemHtml += "</div>";
        }
        addItemHtml += "<div class='comment_info_Wrap'>";
        addItemHtml += "<div class='comment_btnWrap'>";
        addItemHtml += "<div class='com_checkbox_comment_heart'>";
        addItemHtml += "<input type='checkbox' id='checkCommentHeart0' " + (item.MY_SYMPATHY_CNT == 0 ? "" : "checked ") + "/>";
        addItemHtml += "<label for='checkCommentHeart0'>";
        addItemHtml += "<span class='ico_comment_heart'></span>";
        addItemHtml += "<span class='favorite_count'  cmts_gubun='1'>" + item.GOODCNT + "</span>";
        addItemHtml += "</label>";
        addItemHtml += "</div>";
        addItemHtml += "<a href='javascript:void(0)' class='btn_reply'  data-count='" + item.ReplyCnt + "'></a>";
        addItemHtml += "</div>";
        addItemHtml += "<a href='javascript:void(0)' class='btn_comment'>댓글쓰기</a>"
        addItemHtml += "</div>";
        addItemHtml += "</div>";
        addItemHtml += "<ul class='fp_comment_inner_list'></ul>";
        addItemHtml += "</li>";
        addItemHtml += "";
        return addItemHtml;
    }, "");
}

hashCommentListOption.setHashTagCommentList = function (result, tag) {
    tag = tag || "";
    if (tag != "") {
        $("div#popHashTag div.container_header h1").text(tag);
    }
    var hashTagListHtml = hashCommentListOption.getCommentList(result);
    $("div#popHashTag div.container_content ul.fp_comment_list").append(hashTagListHtml);
    hashCommentListOption.setEvent();
}

window.fnHashTagViewNew = function (tag) {
    hashCommentListOption.init("page");
    hashCommentListOption.tag = tag;
    $.ajaxCgv({
        url : "/fanpage/hashtagCommentView",
        data : JSON.stringify({
            Hashtag : tag,
            movieIdx : strMovieIdx
        }),
        success : function (result, status, xhr) {
            $("div#popHashTag div.container_header h1").text("");
            $("div#popHashTag div.container_content ul.fp_comment_list").html("");
            if (result.TotCnt > 0) {
                hashCommentListOption.totCnt = result.TotCnt;
                hashCommentListOption.setHashTagCommentList(result, tag);
                $.fn.openPopup('popHashTag', 'UP', 1);
            }
            if (IsWebView_Master) {
                $("div#popHashTag div.pop_hash_tag").addClass("typeRadius16");
                $("div#popHashTag div.pop_hash_tag").css("height", "calc(100vh - 45px)");
            } else {
                $("div#popHashTag div.pop_hash_tag").removeClass("typeRadius16");
                $("div#popHashTag div.pop_hash_tag").css("height", null);
            }
        }
    });
}

window.fnHashTagDetailList = function () {
    var paramData = {};
    paramData.movieIdx = strMovieIdx;
    paramData.Hashtag = hashCommentListOption.tag;
    paramData.PageIndex = hashCommentListOption.PageIndex;
    paramData.PageSize = hashCommentListOption.PageSize;
    $.ajaxCgv({
        url : "/fanpage/hashtagCommentDtl",
        data : JSON.stringify(paramData),
        success : function (result, status, xhr) {
            hashCommentListOption.setHashTagCommentList(result);
        }
    });
}

window.fileObject;
$(document).ready(function () {
    fileObject = new FileObject()
    fileObject.init($('#itemFile'), $('#itemList'), function (fileSrc, fileKey) {
        return '<li>' + '<div class="inner">' + '<img src="' + fileSrc + '" itemIdx="" attachKey="' + fileKey + '" OLD_URL="" alt="">' + '</div>'
            + '<button type="button" class="btn_del" onclick="fileObject.fnDelItem()">삭제</button>' + '</li>';
    }, "div#popCommentReplyWrite.popup_dim");
});

window.fnCommentReplayRegSave = function (gubun) {
    var sPoint = "2";
    var popUpId = "popCommentReplyWrite";
    var $_commentParent = $(event.target).parents("#" + popUpId);
    var commentIdx = $_commentParent.attr("comment_idx");
    var replyIdx = $_commentParent.attr("reply_idx");
    var chkIsShowView = $_commentParent.attr("chk_is_show_view");
    var cmtsRegId = $_commentParent.attr("cmts_reg_id"); // 관람평등록ID
    var oldFileUrl = $_commentParent.attr("old_file_url") || ""; // 기존파일URL
    var targetGbn = $_commentParent.attr("target_gbn") || "comments";

    var commentContent = $_commentParent.find("#commentContent").val();
    var sGubun = gubun; // 구분

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

    sSvcUrl = "/fanpage/saveMovieCmtsReply";
    if (sGubun == "SR") { // 답글 수정하기
        sGubun = "SU";
    }

    sData = {
        gubun : sGubun,
        movieIdx : strMovieIdx,
        commentIdx : commentIdx,
        replyIdx : replyIdx,
        commentContent : commentContent,
        fileFile : fileFile,
        cmtsRegId : cmtsRegId,
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
        fnSendGALog("1", "", (AppVersion_Master >= 448 ? "MA_팬페이지" : "MW_팬페이지"), "실관람평_댓글", movieGroupTitle);

        // 실관람객 작성 가능
        $.ajax({
            method : "post",
            url : sSvcUrl,
            processData : false,
            contentType : false,
            dataType : "json",
            data : jsJsonToFormData(sData),
            success : function (result) {
                $_commentParent.attr("old_file_url", "");
                $_commentParent = targetGbn == "comments" ? $("div.fp_comment_list_wrap ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']")
                        : $("div#popHashTag ul.fp_comment_list li[comment_idx='" + sData.commentIdx + "']");
                var $_obj_reply = $_commentParent.find(".btn_reply");
                var data_count = parseInt($_obj_reply.attr("data-count"));
                if (sData.gubun == "SC") {
                    data_count++;
                }
                $_obj_reply.attr("data-count", data_count);
                $_obj_reply.off("click").on("click", function () {
                    if ($_commentParent.find("ul.fp_comment_inner_list").hasClass("active")) {
                        var slideDuration = $_commentParent.find("ul.fp_comment_inner_list li").length * 50;
                        $_commentParent.find("ul.fp_comment_inner_list").removeClass("active").slideUp(slideDuration, function () {
                            $(this).children().remove();
                            $(this).css("display", "none");
                        });
                    } else {
                        var data_count = parseInt($(event.target).attr("data-count")||"0");
                        var commentIdx = $_commentParent.attr("comment_idx");
                        fnCmtsPreviewReply(commentIdx, $(event.target), data_count);
                    }
                });
                if ($_commentParent.find("ul.fp_comment_inner_list").hasClass("active")) {
                    var data_count = parseInt($_obj_reply.attr("data-count")||"0");
                    var commentIdx = $_commentParent.attr("comment_idx");
                    fnCmtsPreviewReply(commentIdx, $_obj_reply, data_count);
                }
                $.fn.closePopup(popUpId);
            },
            error : function () {
                alert('처리 중 에러가 발생하였습니다.\n잠시 후에 다시 이용해 주세요.');
            }
        });
    }
}