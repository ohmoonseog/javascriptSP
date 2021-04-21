//'use strict';
/* 기존 모바일 CGV appinterface.js 참조. ChoiTH. 2017.11.13 */
window.CGVFanpageAppInterface = {
    _calliOS : function (method) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", method);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    },
    Login : function (id, pwd, autologin) {
        this._calliOS("WebToAPP:Login:" + id + ":" + pwd + ":" + autologin);

        try {
            window.WebToApp.Login(id, pwd, autologin);
        } catch (e) {
        } finally {
        }
    },
    LoginV4 : function (id, pwdInter, pwdLocal, autologin) {
        this._calliOS("WebToAPP:Login:" + id + ":" + pwdInter + ":" + pwdLocal + ":" + autologin);

        try {
            window.WebToApp.Login(id, pwdInter, pwdLocal, autologin);
        } catch (e) {
        } finally {
        }
    },
    Logout : function () {
        this._calliOS("WebToAPP:Logout");

        try {
            window.WebToApp.Logout();
        } catch (e) {
        } finally {
        }
    },
    CJONEJoin : function (url) {
        this._calliOS("WebToAPP:CJONEJoin:" + url);

        try {
            window.WebToApp.CJONEJoin();
        } catch (e) {
        } finally {
        }
    },
    MainLink : function (url) {
        this._calliOS("WebToAPP:MainLink:" + url);

        try {
            window.WebToApp.MainLink(url);
        } catch (e) {
        } finally {
        }
    },
    AddToCalendar : function (movieTitle, openingDate, url) {
        this._calliOS("WebToAPP:AddToCalendar:" + encodeURIComponent(movieTitle) + ":" + openingDate + ":" + encodeURIComponent(url));

        try {
            window.WebToApp.AddToCalendar(encodeURIComponent(movieTitle), openingDate, encodeURIComponent(url));
        } catch (e) {
        } finally {
        }
    },
    OpenMoviePlayer : function (url) {
        this._calliOS("WebToAPP:OutLink:" + url + ":" + "0");
        try {
            window.WebToApp.PlayMovie(url);
        } catch (e) {
        } finally {
        }
    },
    OpenMoviePlayer_455 : function (url) { // 4.5.5 버전 이상일 경우 호출
        this._calliOS("WebToAPP:PlayMovie:" + url);

        try {
            window.WebToApp.PlayMovie(url);
        } catch (e) {
        } finally {
        }
    },
    MovieLogRefresh : function (movieIdx, type, wishSeq) {
        this._calliOS("WebToAPP:MovieLogRefresh:" + movieIdx + ":" + type + ":" + wishSeq);

        try {
            window.WebToApp.MovieLogRefresh(movieIdx, type, wishSeq);
        } catch (e) {
        } finally {
        }
    },
    MoveWishList : function () {
        this._calliOS("WebToApp:MoveWishList");

        try {
            window.WebToApp.MoveWishList();
        } catch (e) {
        } finally {
        }
    },
    EventBannerCall : function (type, url) {
        this._calliOS("WebToAPP:EventBannerCall:" + type + ":" + url);

        try {
            window.WebToApp.EventBannerCall(type, url);
        } catch (e) {
        } finally {
        }
    },
    PosterDownload : function (url, showDialog) {
        if (AppVersion_Master >= 417) {

            this._calliOS("WebToAPP:PosterDownload:" + encodeURIComponent(url) + ":" + showDialog);

            try {
                window.WebToApp.PosterDownload(encodeURIComponent(url), showDialog);
            } catch (e) {
            } finally {
            }
        } else {
            this._calliOS("WebToAPP:PosterDownload:" + encodeURIComponent(url));

            try {
                window.WebToApp.PosterDownload(encodeURIComponent(url));
            } catch (e) {
            } finally {
            }
        }
    },
    SetNavigationBar : function (title, lbtn, rbtn1, rbtn2, rbtn3) {
        this._calliOS("WebToAPP:SetNavigationBar:" + encodeURIComponent(title) + ":" + lbtn + ":" + rbtn1 + ":" + rbtn2 + ":" + rbtn3);

        try {
            window.WebToApp.SetNavigationBar(encodeURIComponent(title), lbtn, rbtn1, rbtn2, rbtn3);
        } catch (e) {
        } finally {
        }
    },
    // 공유하기
    FanPageRequestSystemShare : function (movieIdx, movieName, contentsUrl) {
        this._calliOS("WebToAPP:FanPageRequestSystemShare:" + movieIdx + ":" + encodeURIComponent(movieName) + ":" + encodeURIComponent(contentsUrl));

        try {
            window.WebToApp.FanPageRequestSystemShare(movieIdx, encodeURIComponent(movieName), encodeURIComponent(contentsUrl));
        } catch (e) {
        } finally {
        }
    },
    PreEggWishMovie : function () {
        this._calliOS("WebToAPP:MoveWishMovieList");

        try {
            window.WebToApp.MoveWishMovieList();
        } catch (e) {
        } finally {
        }
    },
    // 실관람평 및 관련소식 컨텐츠 댓글 / 댓글 수정, 대댓글 / 대댓글 수정
    FanPageEditContentsComment : function (act, movieName, isView, nextCallback, movieIdx, contentsIdx, commentIdx, commentReplyIdx, commentText, savedImageUrl, userType, userCode) {
        this._calliOS("WebToAPP:FanPageEditContentsComment:" + act + ":" + encodeURIComponent(movieName) + ":" + isView + ":" + nextCallback + ":" + movieIdx + ":" + contentsIdx + ":" + commentIdx
                + ":" + commentReplyIdx + ":" + encodeURIComponent(commentText) + ":" + encodeURIComponent(savedImageUrl) + ":" + userType + ":" + userCode);

        try {
            window.WebToApp.FanPageEditContentsComment(act, encodeURIComponent(movieName), isView, nextCallback, movieIdx, contentsIdx, commentIdx, commentReplyIdx, encodeURIComponent(commentText),
                    encodeURIComponent(savedImageUrl), userType, userCode);
        } catch (e) {
        } finally {
        }

    },
    // Fan Page 실관람평 작성
    FanPageRealShowWriteComment : function (movieIdx, movieName, isView, nextPage, isCameraClick, userCode) {
        this._calliOS("WebToAPP:FanPageRealShowWriteComment:" + movieIdx + ":" + encodeURIComponent(movieName) + ":" + isView + ":" + nextPage + ":" + isCameraClick + ":" + userCode);

        try {
            window.WebToApp.FanPageRealShowWriteComment(movieIdx, encodeURIComponent(movieName), isView, nextPage, isCameraClick, userCode);
        } catch (e) {
        } finally {
        }
    },
    // Fan Page 실관람평 수정
    FanPageRealShowModifyComment : function (movieIdx, movieName, isView, isShowView, myPoint, commentText, commentIdx, nextPage, savedImageUrl, userCode) {
        this._calliOS("WebToAPP:FanPageRealShowModifyComment:" + movieIdx + ":" + encodeURIComponent(movieName) + ":" + isView + ":" + isShowView + ":" + myPoint + ":"
                + encodeURIComponent(commentText) + ":" + commentIdx + ":" + nextPage + ":" + encodeURIComponent(savedImageUrl) + ":" + userCode);

        try {
            window.WebToApp.FanPageRealShowModifyComment(movieIdx, encodeURIComponent(movieName), isView, isShowView, myPoint, encodeURIComponent(commentText), commentIdx, nextPage,
                    encodeURIComponent(savedImageUrl), userCode);
        } catch (e) {
        } finally {
        }
    },
    SendGoogleAnalyticsLog : function (lType, screenName, eventCategory, eventAction, eventLabel) {
        this._calliOS("WebToApp:SendGoogleAnalyticsLog:" + lType + ":" + encodeURIComponent(screenName) + ":" + encodeURIComponent(eventCategory) + ":" + encodeURIComponent(eventAction) + ":"
                + encodeURIComponent(eventLabel));

        try {
            window.WebToApp.SendGoogleAnalyticsLog(lType, encodeURIComponent(screenName), encodeURIComponent(eventCategory), encodeURIComponent(eventAction), encodeURIComponent(eventLabel));
        } catch (e) {
        } finally {
        }
    },
    // 예매연동 (2013.12.17)
    ReserveFromMovieInfoV4 : function (MovieGroupCd, movieName, ratingCd, rKind) {
        // if (confirm("예매페이지로 이동하시겠습니까?")) {
        if (AppVersion_Master >= 417) {
            var rKindValue = "";

            if (typeof (rKind) == "undefined" || rKind.trim() == "") {
                rKindValue = "00"
            } else {
                rKindValue = rKind;
            }

            this._calliOS("WebToAPP:ReserveFromMovieInfo:" + MovieGroupCd + ":" + movieName + ":" + ratingCd + ":" + rKindValue);

            try {
                window.WebToApp.ReserveFromMovieInfo(MovieGroupCd, movieName, ratingCd, rKindValue);
            } catch (e) {
            } finally {
            }
        } else {
            this._calliOS("WebToAPP:ReserveFromMovieInfo:" + MovieGroupCd + ":" + movieName + ":" + ratingCd);

            try {
                window.WebToApp.ReserveFromMovieInfo(MovieGroupCd, movieName, ratingCd);
            } catch (e) {
            } finally {
            }
        }
        // }
    },
    OutLink : function (url, type) {
        url = encodeURIComponent(url);

        if (typeof (type) == "undefined") {
            type = "0";
        }

        if (AppVersion_Master >= 433) {
            this._calliOS("WebToAPP:OutLink:" + url + ":" + type);
        } else {
            this._calliOS("WebToAPP:OutLink:" + url);
        }

        try {
            if (AppVersion_Master >= 433) {
                window.WebToApp.OutLink(url, type);
            } else {
                window.WebToApp.OutLink(url);
            }
        } catch (e) {
        } finally {
        }
    },
    /*
     * EventBannerCall: function (type, url) { url = encodeURIComponent(url);
     *
     * if(typeof (type) == "undefined"){ type = "1"; }
     *
     * this._calliOS("WebToAPP:EventBannerCall:" + type + ":" + url);
     *
     * try { window.WebToApp.EventBannerCall(type, url); } catch (e) { } finally { } },
     */

    // 네트워크 상태 조회
    GetNetworkState : function () {
        this._calliOS("WebToAPP:GetNetworkState");

        try {
            window.WebToApp.GetNetworkState();
        } catch (e) {
        } finally {
        }
    },
    // 4.5.9버전 신규 공유하기 기능
    SendAppShareData : function (movieIdx, title, description, contentsUrl, bakgoundUrl, stickerUrl, pageType) {
        this._calliOS("WebToAPP:SendAppShareData:" + movieIdx + ":" + encodeURIComponent(title) + ":" + encodeURIComponent(description) + ":" + encodeURIComponent(contentsUrl) + ":"
                + encodeURIComponent(bakgoundUrl) + ":" + encodeURIComponent(stickerUrl) + ":" + pageType);
        try {
            window.WebToApp.SendAppShareData(movieIdx, title, description, contentsUrl, bakgoundUrl, stickerUrl, pageType);
        } catch (e) {
        } finally {
        }
    },
    PageOut_Reload : function (reLoadYn) {
        this._calliOS("WebToAPP:PageOut_Reload:" + reLoadYn);

        try {
            window.WebToApp.PageOut_Reload(reLoadYn);
        } catch (e) {
        } finally {
        }
    },
};