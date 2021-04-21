/**
 * string.util.js
 */
//'use strict';

/**
 * string String::cut(int len) 글자를 앞에서부터 원하는 바이트만큼 잘라 리턴합니다. 한글의 경우 2바이트로 계산하며, 글자 중간에서 잘리지 않습니다.
 */
String.prototype.cut = function (len) {
    var str = this;
    var l = 0;
    for (var i = 0; i < str.length; i++) {
        l += (str.charCodeAt(i) > 128) ? 2 : 1;
        if (l > len) {
            return str.substring(0, i) + "..";
        }
    }
    return str;
}

String.prototype.getBytesLength = function () {
    var str = this;
    var l = 0;
    for (var i = 0; i < str.length; i++) {
        l += (str.charCodeAt(i) > 128) ? 2 : 1;
    }
    return l;
}

String.prototype.zf = function (len) {
    return "0".repeat(len - this.length) + this;
};

String.prototype.replaceAll = function (org, dest) {
    return this.split(org).join(dest);
}

String.prototype.indexOfSize = function (searchValue, digitIndex) {
    var str = this;
    var count = 0;
    var oPos = str.indexOf(searchValue);
    var searchLength = searchValue.length;
    var nPos = -1;
    if (oPos == -1) {
        return oPos;
    }
    while (oPos !== -1 && digitIndex > count) {
        count++;
        nPos = oPos;
        oPos = str.indexOf(searchValue, oPos + searchLength);
    }
    return nPos;
};

String.prototype.charToHtml = function () {
    var str = this;
    var entityMap = {
        '&amp;' : '&',
        '&lt;' : '<',
        '&gt;' : '>',
        '&quot;' : '"',
        '&#39;' : "'",
        '&#x2F;' : '/',
        '&#x60;' : '`',
        '&#x3D;' : '=',
        '&#40;' : '(',
        '&#41;' : ')',
        '&#35;' : '#'
    };
    var arrKey = Object.keys(entityMap);
    arrKey.forEach(function (key, i) {
        str = str.split(key).join(entityMap[key]);
    });
    var entityMap2 = {
        '&amp;' : '&'
    };
    var arrKey = Object.keys(entityMap2);
    arrKey.forEach(function (key, i) {
        str = str.split(key).join(entityMap[key]);
    });
    return str;
};

String.prototype.htmlToChar = function () {
    var str = this;
    var entityMap = {
        '&;' : '&amp',
        '#' : '&#35;',
        '<' : '&lt;',
        '>' : '&gt;',
        '"' : '&quot;',
        "'" : '&#39;',
        '/' : '&#x2F;',
        '`' : '&#x60;',
        '=' : '&#x3D;',
        '(' : '&#40;',
        ')' : '&#41;'
    };
    var arrKey = Object.keys(entityMap);
    arrKey.forEach(function (key, i) {
        str = str.split(key).join(entityMap[key]);
    });
    return str;
};

String.prototype.byteLength = function () {
    var result = 0;
    for (var i = 0; i < this.length; i++) {
        var chr = escape(this.charAt(i));
        if (chr.length == 1) {
            result++;
        } else if (chr.indexOf("%u") != -1) {
            result += 2;
        } else if (chr.indexOf("%") != -1) {
            result += chr.length / 3;
        }
    }
    return result;
};

String.prototype.maskingInfo = function () {
    return this.length < 4 ? this.substring(0) : (this.length == 4 ? this.substring(0, 2) + "**" : this.substring(0, 2) + "**" + this.substring(4));
};

String.prototype.mediaCodeMap = {
    "408" : "일반",
    "1969" : "4DX",
    "412" : "IMAX",
    "2202" : "SCREENX"
};
String.prototype.codeToName = function (gubun) {
    gubun = gubun || "mediaCodeMap";
    var code = this;
    var codeList = {};
    if (gubun == "mediaCodeMap") {
        codeList = String.prototype.mediaCodeMap;
    }
    return codeList[code] || "";
};
String.isEmoji = String.prototype.isEmoji = function (value) {
    value = String((typeof this == "function") ? value || "" : this);
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    if (value.match(regex)) {
        return true;
    } else {
        return false;
    }
};
String.emojiLength = String.prototype.emojiLength = function (value) {
    value = String((typeof this == "function") ? value || "" : this);
    return value.emojiToString().byteLength();
};
String.emojiToString = String.prototype.emojiToString = function (value) {
    value = String((typeof this == "function") ? value || "" : this);
    return Array.from(value).map(function (o) {
        return (o.isEmoji() ? "&#" + o.codePointAt(0) + ";" : o);
    }).join("");
};
String.getContentRp = String.prototype.getContentRp = function (value) {
    value = String((typeof this == "function") ? value || "" : this);
    return value.split(/\n|\r\n/g).join("<br/>").charToHtml().replaceAll("\"", "").replaceAll("\'", "").replaceAll("<br>", "").replaceAll("<br/>", "").replaceAll("<a/>", "");
};

/*
 * "20190101".format("XXXX.XX.XX") => "2019.01.01" "1234".format("XX:XX") => "12:34" "X123456789".format("Z:ZZZ-ZZZ-ZZZ","Z") => "X:123-456-789"
 */
String.prototype.format = function (fmt, fmtVal) {
    fmtVal = fmtVal || "X";
    var _this = this;
    if (_this.length == fmt.length - fmt.replaceAll(fmtVal, "").length) {
        var k = 0;
        return fmt.split("").map(function (o, i) {
            return (o == fmtVal ? _this.charAt(k++) : o);
        }).join("");
    } else {
        return _this;
    }
}
/*
 * "2018-12-14 14:29:23".uformat("XXXX-XX-XX XX:XX:XX") => "20181214142923" "12:34".uformat("XX:XX") => "1234" "X:123-456-789".uformat("Z:ZZZ-ZZZ-ZZZ","Z") => "X123456789"
 */

String.prototype.uformat = function (fmt, fmtVal) {
    fmtVal = fmtVal || "X";
    var _this = this;
    fmt.replaceAll(fmtVal, "").split("").forEach(function (txt, i) {
        _this = _this.replaceAll(txt, "")
    });
    return _this;
}
/*
 * "20201111111111".mCgvTimeComp("20201111111320","MI") => 2.15 "20201111111111".mCgvTimeComp("20201111111320","SS") => 129 "20201111111111".mCgvTimeComp("20201111121111","SS") => 3600 "20201111111111".mCgvTimeComp("20201111111110","SS") => -1
 */
String.prototype.mCgvTimeComp = function (nowTime, ymdType) {
    var _this = this;
    var da1 = _this.format("XXXX,XX,XX,XX,XX,XX").split(",");
    var da2 = nowTime.format("XXXX,XX,XX,XX,XX,XX").split(",");
    var date1 = new Date(parseInt(da1[0]), parseInt(da1[1]) - 1, parseInt(da1[2]), parseInt(da1[3]), parseInt(da1[4]), parseInt(da1[5]));
    var date2 = new Date(parseInt(da2[0]), parseInt(da2[1]) - 1, parseInt(da2[2]), parseInt(da2[3]), parseInt(da2[4]), parseInt(da2[5]));
    var dateComp = date2 - date1;

    ymdType = ymdType || "D";

    var rtnVal = 0;
    if (ymdType == "D") {
        rtnVal = dateComp / (60000 * 60 * 24);
    } else if (ymdType == "M") {
        rtnVal = dateComp / (60000 * 60 * 24 * 30);
    } else if (ymdType == "Y") {
        rtnVal = dateComp / (60000 * 60 * 24 * 365);
    } else if (ymdType == "HH") {
        rtnVal = dateComp / (60000 * 60);
    } else if (ymdType == "MI") {
        rtnVal = dateComp / (60000);
    } else if (ymdType == "SS") {
        rtnVal = dateComp / (1000);
    }
    return rtnVal;
}

/*
 * 작성 시간 표기시 1분 미만의 경우 '방금전'으로 표기 1시간 미만의 경우 'mm분 전'으로 표기 1시간이상 24시간 미만의 경우 'hh시간 전'으로 표기 1일이상 7일 미만의 경우 'dd일 전'으로 표기 7일이상의 경우 'mm월 dd일'로 표기 "20181214142923".mCgvTimeFormat("20181214142930") '7초전' ==> 방금전
 */
String.prototype.mCgvTimeFormat = function (nowTime) {
    var _this = this;
    var dateComp = _this.mCgvTimeComp(nowTime, "SS");
    var outValue = 0;
    var outString = "";
    if (dateComp < 60) { // 1분전
        outString = "방금전";
    } else if (dateComp < 60 * 60) { // 1시간전
        outValue = Math.floor(dateComp / 60);
        outString = "분 전";
    } else if (dateComp < 60 * 60 * 24) { // 24시간전
        outValue = Math.floor(dateComp / (60 * 60));
        outString = "시간 전";
    } else if (dateComp < 60 * 60 * 24 * 7) { // 7일전
        outValue = Math.floor(dateComp / (60 * 60 * 24));
        outString = "일 전";
    } else {
        outValue = 0;
        outString = parseInt(_this.substr(4, 4).format("XX.XX").split(".")[0]) + "월" + parseInt(_this.substr(4, 4).format("XX.XX").split(".")[1]) + "일"
    }
    return (outValue == 0) ? outString : outValue + outString;
}

/*
 * "202009251330".mCgvDateFormat() => "09월 25일 오후 01:30" "20200925".mCgvDateFormat({type:"Y",amAt:false , weekAt:true}) => "2020년 09월 25일 "
 *
 */
String.prototype.mCgvDateFormat = function (options) {
    var setting = $.extend({
        type : "M", /* Y : 2020년도표시 , M : 년도표이안함 */
        amAt : true,
        secYn : false,
        weekAt : false,
        hanYn : true
    }, options);
    var _this = this.toString();
    var _this_length = _this.length;
    if (_this_length != 8 && _this_length != 12 && _this_length != 14) {
        return _this;
    }
    var _dt = _this.substring(0, 8);
    if (setting.weekAt) {
        _dt += [ '일', '월', '화', '수', '목', '금', '토' ][new Date(_dt.format("XXXX-XX-XX")).getDay()];
    }
    var _hh = "", _apm = "", _tm = "";

    if (setting.amAt) {
        _hh = parseInt(_this.substring(8, 10));
        _apm = _hh > 12 ? "오후" : "오전";
        _hh = _hh > 12 ? _hh - 12 : _hh;
        _hh = (_hh < 10 ? "0" : "") + _hh;
    } else {
        _hh = _this.substring(8, 10);
    }
    if (_this_length > 8) {
        _tm = _apm + _hh + _this.substring(10);
        _tm = _tm.format((setting.amAt ? " XX" : "") + " " + (_this_length == 12 ? Constants.TM_FORMAT_X : Constants.TIME_FORMAT_X));
    }
    var DATA_FORMAT = "";
    if (setting.type == "M" && setting.hanYn) {
        DATA_FORMAT = setting.hanYn ? Constants.DT_FORMAT_X_H : Constants.DT_FORMAT_X;
    } else {
        DATA_FORMAT = setting.hanYn ? Constants.DATE_FORMAT_X_H : Constants.DATE_FORMAT_X;
    }
    if (setting.type == 'M') {
        _dt = _dt.substring(4);
    }
    _this = _dt.format(DATA_FORMAT + (setting.weekAt ? " (X)" : "")) + _tm;

    return _this;
}