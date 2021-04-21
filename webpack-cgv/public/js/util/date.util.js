//'use strict';
Date.prototype.format = function (f) {
    if (!this.valueOf()) {
        return " ";
    }

    var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
        case "yyyy":
            return d.getFullYear();
        case "yy":
            return (d.getFullYear() % 1000).zf(2);
        case "MM":
            return (d.getMonth() + 1).zf(2);
        case "dd":
            return d.getDate().zf(2);
        case "E":
            return weekName[d.getDay()];
        case "HH":
            return d.getHours().zf(2);
        case "hh":
            return ((h = d.getHours() % 12) ? h : 12).zf(2);
        case "mm":
            return d.getMinutes().zf(2);
        case "ss":
            return d.getSeconds().zf(2);
        case "a/p":
            return d.getHours() < 12 ? "오전" : "오후";
        default:
            return $1;
        }
    });
};
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var weekName = {"US" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                   ,"KR" : ["일요일", "월요일", "화요일" , "수요일"   , "목요일"  , "금요일", "토요일"  ] };
    var meridiemName = {"US" : ["AM"  ,"PM"  ],"KR" : ["오전","오후"]};
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[mCgv.localeString][d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? meridiemName[mCgv.localeString][0] : meridiemName[mCgv.localeString][1];
            default: return $1;
        }
    });
};

Date.prototype.is24hourDiffer = function() {
	var regdt = this;
	var regDate = new Date(regdt);
	var nowDate = new Date();

	var r = parseFloat(regDate.format('yyyyMMddHHmmss'));
	var d = parseFloat(nowDate.format('yyyyMMddHHmmss')) - 1000000; // 전날 뺌

	return (r > d);
};

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
};