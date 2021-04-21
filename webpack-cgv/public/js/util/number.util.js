/**
 * number.util.js
 */
//'use strict';
Number.prototype.zf = function (len) {
    return this.toString().zf(len);
};

Math.log10 = Math.log10 || function(x) {
    return Math.log(x) * Math.LOG10E;
};
Math.sign = Math.sign || function(x) {
    return ((x > 0) - (x < 0)) || +x;
};

/* var a = 1234556;
 * a.abbrFormat()  =>    "1.2M"
 * a = 123456789012;
 * a.abbrFormat()  =>  "123.4G"
 * Number.abbrFormat(123322300000);  => "123.3G"
 * */
window.abbrMax = "G";
Number.prototype.abbrFormat = Number.abbrFormat = function(value){
    value = Number(( typeof this  == "function" ) ? value || 0 : this);
    value = isNaN(value) ? 0 : value;

    var signGbn = Math.sign(value);
    value = signGbn * value;

    var bv = 1000;
    var abbrStrMap = ['','k','M','G','T','P','E'];
    var abbrMap = {
        '': Math.pow(bv, 0),
        'k': Math.pow(bv, 1),
        'M': Math.pow(bv, 2),
        'G': Math.pow(bv, 3),
        'T': Math.pow(bv, 4),
        'P': Math.pow(bv, 5),
        'E': Math.pow(bv, 6)
    };
    var abbrIndex = Math.min(Math.floor(value == 0 ? 0 : Math.log10(value) / Math.log10(bv)), abbrStrMap.length - 1, abbrStrMap.indexOf(abbrMax));
    return (Math.floor( value * 10 / abbrMap[abbrStrMap[abbrIndex]] ) / 10) * signGbn + abbrStrMap[abbrIndex];
}

/*
 * var n = 123456; a.format() => "123,456" Number.format(4567) => "4,567"
 */
Number.format = Number.prototype.format = function(value){
    value = Number((typeof this  == "function") ? value || 0 : this);
    if (value == 0) {
        return 0;
    }
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (value + '');
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + Constants.SEPARATOR_NUMBER + '$2');
    }
    return n;
};