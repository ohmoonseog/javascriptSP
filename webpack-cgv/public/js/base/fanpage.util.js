//'use strict';

/* 기존 모바일 CGV util.js 참조. ChoiTH. 2017.11.13 */
window.fnSendGALog = function (lType, screenName, eventCategory, eventAction, eventLabel) {
    if (lType != "") {
        if (IsWebView_Master) {
            CGVFanpageAppInterface.SendGoogleAnalyticsLog(lType, screenName, eventCategory, eventAction, eventLabel);
        } else { // PageView
            if (lType == "0") {
                ga_cgv("send", "pageview", {
                    "title" : screenName
                });
            } else if (lType == "1") { // Event
                ga_cgv("send", {
                    "hitType" : "event",
                    "eventCategory" : eventCategory,
                    "eventAction" : eventAction,
                    "eventLabel" : eventLabel
                });
                ga_cgv("rollup.send", {
                    "hitType" : "event",
                    "eventCategory" : eventCategory,
                    "eventAction" : eventAction,
                    "eventLabel" : eventLabel
                });
            }
        }
    }
}

window.basicNavigation = function (type, title, secondButton, actionBarType) {
    if (IsWebView_Master == true && AppVersion_Master >= 433) {
        var lbtnImageUrl = getNavigationIconUrl('icon_back');
        var rbtnImageUrl = getNavigationIconUrl('icon_menu');
        var rbtnImageUrl2 = getNavigationIconUrl('icon_share');
        var rbtnImageIconClose = getNavigationIconUrl('icon_close');

        if (secondButton == "") {
            secondButton = '|||||';
        }

        if (type == 1) {
            CGVFanpageAppInterface.SetNavigationBar(title, '|' + encodeURIComponent(lbtnImageUrl) + '||10||', '|||||', secondButton, '|' + encodeURIComponent(rbtnImageUrl) + '||2||');
        } else if (type == 2) {
            CGVFanpageAppInterface.SetNavigationBar(title, '|' + encodeURIComponent(lbtnImageUrl) + '||10||', '|||||', '|||||', '|||||');
        } else if (type == 3) {
            CGVFanpageAppInterface.SetNavigationBar(title, '|' + encodeURIComponent(lbtnImageUrl) + '||14||', '|||||', secondButton, '|' + encodeURIComponent(rbtnImageUrl) + '||2||');
        } else if (type == 4) {
            CGVFanpageAppInterface.SetNavigationBar(title, '|' + encodeURIComponent(lbtnImageUrl) + '||10||', '|||||', secondButton, '|' + encodeURIComponent(rbtnImageUrl) + '||2||');
        } else if (type == 5) {
            CGVFanpageAppInterface.SetNavigationBar(title, '|' + encodeURIComponent(lbtnImageUrl) + '||10||', '|||||', "|" + encodeURIComponent(rbtnImageUrl2) + "||1|sendAppShareData()|", '|' + encodeURIComponent(rbtnImageUrl) + '||2||');
        } else if (type == 6) {
            CGVFanpageAppInterface.SetNavigationBar(title, '|' + encodeURIComponent(rbtnImageIconClose) + '||10||', '|||||', "|||||", '|||||');
        }
    }
}

window.simpleCloseNavigation = function (title, closetype) {
    if (IsWebView_Master == true && AppVersion_Master >= 433) {
        var lbtnImageUrl = getNavigationIconUrl('icon_close');
        CGVFanpageAppInterface.SetNavigationBar(title, '|' + encodeURIComponent(lbtnImageUrl) + '||' + closetype + '||', '|||||', '|||||', '|||||');
    }
}

window.getNavigationIconUrl = function (name) {
    var tUser = navigator.userAgent;
    var iconUrl = '';
    if (tUser.indexOf("Android") > 0) {
        iconUrl = 'http://img.cgv.co.kr/Webapp/Images/Common/Navigation/ios_big/' + name + '.png';
    } else {
        if (jQuery(document).width() <= 375) {
            iconUrl = 'http://img.cgv.co.kr/Webapp/Images/Common/Navigation/ios_small/' + name + '.png';
        } else {
            iconUrl = 'http://img.cgv.co.kr/Webapp/Images/Common/Navigation/ios_big/' + name + '.png';
        }
    }
    return iconUrl;
}

window.fnMobileDeviceChk = function () {
    var deviceAgent = navigator.userAgent;
    deviceAgent = deviceAgent.toLowerCase();

    var agents = [ 'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'bada', 'zunewp7', 'windows phone', 'tablet' ];
    var str_rt = "Other";
    for ( var i in agents) {
        if (deviceAgent.search(agents[i]) > -1) {
            str_rt = agents[i];
            break;
        }
    }
    return str_rt;
}

window.fnMobileDeviceLangChk = function () {
    var type = navigator.appName;
    var lang = "";

    try {
        lang = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "ko";
        lang = lang.substr(0, 2).toLowerCase();
    } catch (e) {
        lang = "ko";
    }
    return lang;
}

window.fnAndroidVersion_Web = function (ua) {
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
}

window.fnAndroid_WebEngChk = function () {
    var strAndrVer_Web = fnAndroidVersion_Web();
    if (!isNaN(parseFloat(strAndrVer_Web)) && fnMobileDeviceLangChk() != "ko" && parseFloat(strAndrVer_Web) < 5.0) {
        return true;
    } else {
        return false;
    }
}

window.sendAppShareData = function (type) {
    if (typeof (type) == "undefined") {
        type = "detail";
    }
    var s_Image = jQuery("meta[property='og:image']").attr("content");
    var s_Title = jQuery("meta[property='og:title']").attr("content");
    var s_Description = jQuery("meta[property='og:Description']").attr("content");
    var s_Url = jQuery("meta[property='og:url']").attr("content");
    CGVFanpageAppInterface.SendAppShareData('', s_Title, s_Description, s_Url, '', s_Image, type);
}
