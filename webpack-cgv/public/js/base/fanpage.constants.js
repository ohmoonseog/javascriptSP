//'use strict';
window.Constants = new Object();
Constants.SEPARATOR_DATE = ".";
Constants.SEPARATOR_TIME = ":";
Constants.SEPARATOR_NUMBER = ",";
Constants.SEPARATOR_DEFAULT = "-";
Constants.DATE_FORMAT = "yyyy" + Constants.SEPARATOR_DATE + "mm" + Constants.SEPARATOR_DATE + "dd";
Constants.DATE_FORMAT_H = "yyyy년 mm월 dd일";
Constants.DATE_FORMAT_X = "XXXX" + Constants.SEPARATOR_DATE + "XX" + Constants.SEPARATOR_DATE + "XX";
Constants.DATE_FORMAT_X_H = "XXXX년 XX월 XX일";
Constants.DT_FORMAT = "mm" + Constants.SEPARATOR_DATE + "dd";
Constants.DT_FORMAT_H = "mm월 dd일";
Constants.DT_FORMAT_X = "XX" + Constants.SEPARATOR_DATE + "XX";
Constants.DT_FORMAT_X_H = "XX월 XX일";
Constants.TIME_FORMAT = "hh" + Constants.SEPARATOR_TIME + "mi" + Constants.SEPARATOR_TIME + "ss";
Constants.TIME_FORMAT_X = "XX" + Constants.SEPARATOR_TIME + "XX" + Constants.SEPARATOR_TIME + "XX";
Constants.TM_FORMAT = "hh" + Constants.SEPARATOR_TIME + "mi";
Constants.TM_FORMAT_X = "XX" + Constants.SEPARATOR_TIME + "XX";
Constants.DATE_TIME_FORMAT = Constants.DATE_FORMAT + " " + Constants.TIME_FORMAT;
Constants.DATE_TIME_FORMAT_X = Constants.DATE_FORMAT_X + " " + Constants.TIME_FORMAT_X;
Constants.DATE_TIME_FORMAT_X_H = Constants.DATE_FORMAT_X_H + " " + Constants.TIME_FORMAT_X;