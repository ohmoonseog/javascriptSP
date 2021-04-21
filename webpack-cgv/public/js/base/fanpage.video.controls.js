/*
 * 팬페이지 관련소식 비디오 제어. ChoiTH
 * 관련소식 목록과 상세화면 레이아웃이 달라서 2가지로 분리함. 차후 정리 필요.
 */
//'use strict';

window.fnapageVideos = null;
window.netWorkState = ""; // 접속기기 상태표시

window.GetNetworkState_callback = function (stateCd) {
    if (typeof (stateCd) == "undefined") {
        netWorkState = "9";
    } else if (stateCd == "0") {
        netWorkState = stateCd;
    } else if (stateCd == "1") {
        netWorkState = stateCd;
    }
}

// 동영상 시간 체크 :: 3초와 10초마다 조회수 증가.
window.checkVideoTime = function (video) {
    var curTime3 = 0;
    var curTime10 = 0;

    video.addEventListener("timeupdate", function () {
        if ((video.currentTime > 3 && video.currentTime < 4) && curTime3 == 0) {
            curTime3++;
            // 배급사용 팬페이지에서도 사용하기 위해 추가
            if (strMovieIdx == '') {
                fnContentsVideoCnt("TV3", $(video).parent(".video_box").attr("data-cIdx"), $(video).parent(".video_box").attr("data-iIdx"), $(video).parent(".video_box").attr("data-mIdx"));
            } else {
                fnContentsVideoCnt("TV3", $(video).parent(".video_box").attr("data-cIdx"), $(video).parent(".video_box").attr("data-iIdx"));
            }
        }

        if ((video.currentTime > 10 && video.currentTime < 11) && curTime10 == 0) {
            curTime10++;
            // 배급사용 팬페이지에서도 사용하기 위해 추가
            if (strMovieIdx == '') {
                fnContentsVideoCnt("TV10", $(video).parent(".video_box").attr("data-cIdx"), $(video).parent(".video_box").attr("data-iIdx"), $(video).parent(".video_box").attr("data-mIdx"));
            } else {
                fnContentsVideoCnt("TV10", $(video).parent(".video_box").attr("data-cIdx"), $(video).parent(".video_box").attr("data-iIdx"));
            }
        }
    }, false);
}

// 동영상 전체화면 버튼. ChoiTH
window.enableFullscreenButton = function (video) {
    var fullscreenBtn = $(video).parent().siblings(".fullscreen");
    if (fullscreenBtn) {
        fullscreenBtn.off("click").on("click", function () {
            if ($(video).parent().siblings(".btn_sound").hasClass("off")) {
                $(this).siblings("div.video_box").find("video").prop("muted", false);
                $(video).parent().siblings(".btn_sound").removeClass("off");
            }

            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullScreenElement && !document.msFullscreenElement && !document.webkitEnterFullScreen) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    video.mozRequestFullScreen();
                } else if (video.webkitRequestFullScreen) {
                    video.webkitRequestFullScreen();
                } else if (video.webkitEnterFullScreen) {
                    video.webkitEnterFullScreen();
                } else {
                    alert('전체화면 모드를 지원하지 않는 브라우저 입니다.');
                }
            }
            video.play();
            return false;
        });
    }
}

// 동영상 음소거 버튼. ChoiTH
window.enableMuteButton = function (video) {
    var muteBtn = $(video).parent().siblings(".btn_sound");
    if (muteBtn) {
        muteBtn.off("click").on("click", function () {
            if ($(this).hasClass("off")) {
                $(this).siblings("div.video_box").find("video").prop("muted", false);
                $(this).removeClass("off");
            } else {
                $(this).siblings("div.video_box").find("video").prop("muted", true);
                $(this).addClass("off");
            }
            return false;
        });
    }
}

// 전체 동영상 음소거(iOS). ChoiTH
window.muteAllVideo = function () {
    for (var i = 0; i < fnapageVideos.length; i++) {
        $(fnapageVideos[i]).prop("muted", true);
        $(fnapageVideos[i]).parent().siblings(".btn_sound").addClass("off");
    }
}

// 앱상에서 플레이되는 영상 멈춤(pause). SonHW
window.appCallStop = function () {
    for (var i = 0; i < fnapageVideos.length; i++) {
        $(fnapageVideos).get(i).pause();
    }
}

// 앱상에서 pause된 영상 다시 play. SonHW
window.appCallResume = function () {
    for (var i = 0; i < $('.selectedPlay').length; i++) {
        $('.selectedPlay').get(i).play();
    }
}

// 컨텐츠 상세화면 동영상 재생 버튼. ChoiTH
window.enablePlayButtonContentsDetail = function (video) {
    var playBtn = $(video).parents("div.player");
    if (playBtn) {
        playBtn.off("click").on("click", function () {

            if (video.paused) {
                appCallStop();
                $(this).removeClass("player");
                // 소스 수정 Son.HW (사용자가 동영상 재생/멈춤을 눌렀을경우의 상태값)
                $(this).attr("play-status", "play");
                video.play();
                // checkVideoTime(video);
            } else {
                $(this).addClass("player");
                // 소스 수정 Son.HW (사용자가 동영상 재생/멈춤을 눌렀을경우의 상태값)
                $(this).attr("play-status", "stop");
                video.pause();
            }
        });
    }
}

// 컨텐츠 상세화면 동영상 버튼 활성화. ChoiTH
window.enableContentsDetailButtons = function (video) {
    enablePlayButtonContentsDetail(video);
    enableMuteButton(video);
    enableFullscreenButton(video);
}

// 컨텐츠 상세화면 다음 동영상 재생. ChoiTH
window.checkNextVideosDetail = function (video, idx) {
    var cntCoverVideo = $(video).parents("div.cover_list").find("video").length;
    var curVideoIdx = video.id.split("_")[2];
    video.addEventListener("ended", function () {
        $(video).parents("div.cover_img").addClass("player");
        if ((curVideoIdx < cntCoverVideo) && autoPlayYn == "9") {
            $(fnapageVideos[idx + 1]).parents("div.player").click();
        }
        fnContentsVideoEndTime($(video).parent(".video_box").attr("data-cIdx"), $(video).parent(".video_box").attr("data-iIdx"), parseInt(video.duration, 10));
    }, false);
}

// 컨텐츠 상세화면 동영상 제어. ChoiTH
window.enableVideosDetail = function (everywhere) {
    for (var i = 0; i < fnapageVideos.length; i++) {
        window.enableInlineVideo(fnapageVideos[i], {
            everywhere : everywhere
        });
        enableContentsDetailButtons(fnapageVideos[i]);
        checkNextVideosDetail(fnapageVideos[i], i);
        checkVideoTime(fnapageVideos[i]);
    }

    // 동영상 자동재생옵션 ( ON : 0 / OFF : 9 )
    if (autoPlayYn != "9") {
        window.addEventListener("scroll", autoplayContentsDetail, false);
    }
}

// 컨텐츠 상세화면 동영상 자동재생. ChoiTH
window.autoplayContentsDetail = function () {
    var browserHeight, currentYpos, beginLine, endLine;
    var $vids, $vidsCover;

    for (var i = 0; i < fnapageVideos.length; i++) {
        $vids = $(fnapageVideos[i]);
        $vidsCover = $vids.parents("div.cover_img");

        browserHeight = window.innerHeight;
        currentYpos = window.pageYOffset || document.documentElement.scrollTop;

        beginLine = $vidsCover.offset().top - browserHeight + ($vids.outerHeight() / 2);
        endLine = $vidsCover.offset().top + ($vids.outerHeight() / 2);

        if (currentYpos >= beginLine && currentYpos <= endLine) {
            fnapageVideos[i].play();
            $vidsCover.removeClass("player");
        } else {
            fnapageVideos[i].pause();
            $vidsCover.addClass("player");
        }
    }
}

// 컨텐츠 목록 다음 동영상 재생. ChoiTH
window.checkNextVideosList = function (video, idx) {
    var cntCoverVideo = $(video).parents("div.cover_img").find("video").length;
    var curVideoIdx = video.id.split("_")[2];
    var cntInner = $(video).parents("div.cover_img").find("div.inner").length;

    video.addEventListener("ended", function () {
        if (cntInner > 0) {
            $(video).parents("div.inner").addClass("player");
        } else {
            $(video).parents("div.cover_img").addClass("player");
        }

        if ((curVideoIdx < cntCoverVideo) && autoPlayYn == "9") {
            $(fnapageVideos[idx + 1]).parents("div.player").click();
        }
        fnContentsVideoEndTime($(video).parent(".video_box").attr("data-cIdx"), $(video).parent(".video_box").attr("data-iIdx"), parseInt(video.duration, 10));
    }, false);
}

// 컨텐츠 목록 동영상 제어. ChoiTH
window.vCnt = 0;
window.enableVideosList = function (everywhere) {
    for (var i = vCnt; i < fnapageVideos.length; i++) {
        window.enableInlineVideo(fnapageVideos[i], {
            everywhere : everywhere
        });

        enableContentsDetailButtons(fnapageVideos[i]);
        checkNextVideosList(fnapageVideos[i], i);
        checkVideoTime(fnapageVideos[i]);
    }
    vCnt = fnapageVideos.length; // 중복호출이 되지않게 이미 부른 비디오컨텐츠에는 추가하지 않는다.

    // 네트워크 상태 조회
    CGVFanpageAppInterface.GetNetworkState();

    // 자동재생 설정(최종)
    /*
     * if( (autoPlayYn == "0" && netWorkState == "0") || (autoPlayYn == "0" && netWorkState == "1") || (autoPlayYn == "1" && netWorkState == "1")){ window.addEventListener("scroll", autoplayContentsList, false); }
     */

    // 기존
    if (autoPlayYn == "0") {
        window.addEventListener("scroll", autoplayContentsList, false);
    }
    /*
     * else if (autoPlayYn == "1" && returnState == "1"){ window.addEventListener("scroll", autoplayContentsList, false); }
     */
    else {
        window.addEventListener("scroll", playContentsList, false);
    }
}

// 컨텐츠 목록 동영상 자동재생 :: 동영상 한 개와 여러개 레이아웃이 다름.
window.autoplayContentsList = function () {
    var browserHeight, currentYpos, beginLine, endLine;
    var $vids, $vidsCover, $cover;
    var videoSeq = 0;
    var cntInner = 0;

    for (var i = 0; i < fnapageVideos.length; i++) {
        $vids = $(fnapageVideos[i]);

        $cover = $vids.parents("div.cover_img");
        cntInner = $cover.find("div.inner").length;

        if (cntInner > 0) {
            if ($cover.find("video").hasClass("selectedPlay") == true) {
                $vids = $cover.find("video.selectedPlay");
            } else {
                $vids = $cover.find("video").eq(0);
            }

            $vidsCover = $vids.parents("div.inner");
        } else {
            $vidsCover = $vids.parents("div.cover_img");
            if ($vidsCover.length == 0) {
                $vidsCover = $vids.parents("div.video_box");
            }
        }

        browserHeight = window.innerHeight;
        currentYpos = window.pageYOffset || document.documentElement.scrollTop;

        beginLine = $vidsCover.offset().top - browserHeight + ($vids.outerHeight() / 2);
        endLine = $vidsCover.offset().top + ($vids.outerHeight() / 2);

        if (currentYpos >= beginLine && currentYpos <= endLine) {
            if (cntInner > 0) {
                if ($cover.find("video").hasClass("selectedPlay") == true) {
                    // 소스수정 Son.HW (사용자가 동영상 재상을 멈췄을경우 스크롤해도 다시 재생되지 않음)
                    if ($vidsCover.attr("play-status") == "play") {
                        $vids.get(0).play();
                        $vidsCover.removeClass("player");
                    }
                } else {
                    // $cover.find("video").get(0).play();
                    // $vids.addClass("selectedPlay");
                    $vids.addClass("selectedPlay");
                    $vids.parents("div.inner").removeClass("player");
                }

            } else {
                // 소스수정 Son.HW (사용자가 동영상 재상을 멈췄을경우 스크롤해도 다시 재생되지 않음)
                if ($vidsCover.attr("play-status") == "play") {
                    $vids.get(0).play();
                    $vidsCover.removeClass("player");
                }
            }
        } else {
            if (cntInner > 0) {
                if ($cover.find("video").hasClass("selectedPlay") == true) {
                    $vids.get(0).pause();
                    $vids.parents("div.inner").addClass("player");
                }
            } else {
                $vids.get(0).pause();
                $vidsCover.addClass("player");
            }
        }
    }
}

// 자동재생이 아닐경우 동영상 재생 컨트롤(스크롤액션)
window.playContentsList = function () {
    var browserHeight, currentYpos, beginLine, endLine;
    var $vids, $vidsCover, $cover;
    var videoSeq = 0;
    var cntInner = 0;
    for (var i = 0; i < fnapageVideos.length; i++) {
        $vids = $(fnapageVideos[i]);
        $cover = $vids.parents("div.cover_img");
        cntInner = $cover.find("div.inner").length;

        if (cntInner > 0) {
            if ($cover.find("video").hasClass("selectedPlay") == true) {
                $vids = $cover.find("video.selectedPlay");
            } else {
                $vids = $cover.find("video").eq(0);
            }
            $vidsCover = $vids.parents("div.inner");
        } else {
            $vidsCover = $vids.parents("div.cover_img");
            if ($vidsCover.length == 0) {
                $vidsCover = $vids.parents("div.video_box");
            }
        }

        browserHeight = window.innerHeight;
        currentYpos = window.pageYOffset || document.documentElement.scrollTop;

        beginLine = $vidsCover.offset().top - browserHeight;
        endLine = $vidsCover.offset().top + $vids.outerHeight();

        if (currentYpos >= beginLine && currentYpos <= endLine) {
            if (cntInner > 0) {
                if ($cover.find("video").hasClass("selectedPlay") == true) {
                    // 소스수정 Son.HW (사용자가 동영상 재상을 멈췄을경우 스크롤해도 다시 재생되지 않음)
                    if ($vidsCover.attr("play-status") == "play") {
                        $vids.get(0).play();
                        $vidsCover.removeClass("player");
                    }
                }
            } else {
                // 소스수정 Son.HW (사용자가 동영상 재상을 멈췄을경우 스크롤해도 다시 재생되지 않음)
                if ($vidsCover.attr("play-status") == "play") {
                    /*
                     * $vids.get(0).play(); $vidsCover.removeClass("player");
                     */
                }
            }
        } else {
            if (cntInner > 0) {
                if ($cover.find("video").hasClass("selectedPlay") == true) {
                    /*
                     * console.log("play check 4"); $vids.get(0).pause(); $vids.parents("div.inner").addClass("player");
                     */
                }
            } else {
                $vids.get(0).pause();
                $vidsCover.addClass("player");
            }
        }
    }
}

// 트레일러 재생 컨트롤
window.enableVideoTrailer = function (everywhere) {
    var videoStatus = "";
    for (var i = 0; i < fnapageVideos.length; i++) {
        window.enableInlineVideo(fnapageVideos[i], {
            everywhere : everywhere
        });

        enableFullscreenTrailer(fnapageVideos[i]);
        videoStatus = getFullscreenStatusV2(fnapageVideos[i]);

        // iOS 전체화면 캔슬 컨트롤
        if (videoStatus == 'webkitendfullscreen') {
            fnapageVideos[i].addEventListener(videoStatus, function () {
                var video_mType = $(event.target).attr("video_mType");
                if (video_mType == "trailer") {
                    $("video[video_mType='trailer']").each(function () {
                        this.pause();
                    });
                } else if (video_mType == "main_hotdeal") {
                    $("video[video_mType='main_hotdeal']").each(function () {
                        this.pause();
                    });
                }
            })
        }
    }
    // iOS외 전체화면 캔슬 컨트롤
    window.addEventListener(videoStatus, function () {
        if (getFullscreenStatus() == undefined) {
            var video_mType = $(event.target).attr("video_mType");
            if (video_mType == "trailer") {
                $("video[video_mType='trailer']").each(function () {
                    this.pause();
                });
            } else if (video_mType == "main_hotdeal") {
                $("video[video_mType='main_hotdeal']").each(function () {
                    this.pause();
                });
            }
        }
    });
}

// 트레일러 재생(전체화면) 버튼
window.enableFullscreenTrailer = function (video) {
    var fullscreenBtn = $(video).parent(".video_box");
    if (fullscreenBtn) {
        fullscreenBtn.off("click").on("click", function () {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullScreenElement && !document.msFullscreenElement && !document.webkitEnterFullScreen) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    video.mozRequestFullScreen();
                } else if (video.webkitRequestFullScreen) {
                    video.webkitRequestFullScreen();
                } else if (video.webkitEnterFullScreen) {
                    video.webkitEnterFullScreen();
                } else {
                    alert('전체화면 모드를 지원하지 않는 브라우저 입니다.');
                    return false;
                }
            }
            video.play();
        });
    }
}

// 동영상 재생 브라우저 상태체크
window.getFullscreenStatus = function () {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
}

// 동영상 재생 캔슬을 위한 브라우저 상태체크
window.getFullscreenStatusV2 = function (video) {
    if (video.webkitRequestFullScreen) {
        return "fullscreenchange";
    } else if (video.mozRequestFullScreen) {
        return "mozfullscreenchange";
    } else if (video.msRequestFullscreen) {
        return "MSFullscreenChange";
    } else if (video.webkitEnterFullScreen) {
        return "webkitendfullscreen";
    } else {
        return "fullscreenchange";
    }
}