/**
 * Fanpage Core
 */
//'use strict';
var fanpage = new Object();

//-------------------------------------------------
// Constants
//-------------------------------------------------
var minYn = "N";
//-------------------------------------------------

;(function ($){
    $.extend({
        initCore: function() {
            var arrCoreInfo = null;
            mArrOption.cssList = new Array();
            mArrOption.styleMarker = $("script").eq(0);

            var strRoot = $("script[src*='fanpage.core']").attr("src");
            var intRootIndex = strRoot.indexOf("fanpage.core");
            var viewType = getParams(origin + strRoot,'viewType')||'';
            minYn = getParams(origin + strRoot,'minYn') || minYn;
            var cssList = (getParams(origin + strRoot,'cssList')||'').split("|");
            mArrOption.rootPath = strRoot.substring(0, intRootIndex);
            var jsonFile = minYn == "Y" ?  "fanpage_min.core.json" : "fanpage.core.json";

            $.ajax({
                dataType: "json",
                type: "GET",
                url: mArrOption.rootPath + jsonFile,
                cache: false,
                async: false,
                success: function(objData, strStatus, xhr) {
                    arrCoreInfo = objData;
                },
                error: function(jqXHR, txtStatus, errorThrown) {
                    alert("에러로 인하여 데이터를 로딩할수 없습니다. 에러원인:"+ txtStatus);
                }
            });

            if (arrCoreInfo == null) {
                return false;
            }

            var arrScript = arrCoreInfo.statics.scripts;
            var arrStyle = arrCoreInfo.statics.styles.filter(item => cssList.indexOf(item.name)>-1)
            var onDemandComponents = arrCoreInfo.components;
            var onDemandFunctions = arrCoreInfo.functions;


            $.each(arrStyle, function(index, element) {
                $.addStyle(element, function() {});
            });

            $.each(arrScript, function(index, element) {
                if (ajaxRequest(element) == false) {
                    return false;
                }
            });

            if (onDemandFunctions) {
                $.each(onDemandFunctions, function(index, element) {
                    eval("$."+element.name +"=function(param){if(!ajaxRequest(element)){return false;} return $."+element.name+"(param);};");
                });
            }

            if (onDemandComponents) {
                $.each(onDemandComponents, function(index, element) {
                    eval("$.fn."+ element.name +"=function() {"+
                    " var obj=$(this);"+
                    " if(ajaxRequest(element) == false){ return false; }"+
                    " return obj."+ element.name +"(arguments[0]);"+
                    "};");
                });
            }

            function getParams(urlStr,paramName){
            	return (new URL(origin + strRoot)).searchParams.get(paramName);
            }

            function ajaxRequest(element) {
                var boolResult = true;
                var url = "";
                if ((element.js).indexOf("http") > -1) {
                    url = element.js;
                } else {
                    url = mArrOption.rootPath + element.js;
                }

                $.ajax({
                    dataType : "script",
                    type : "GET",
                    url : url,
                    cache : true,
                    async : false,
                    success: function(obj) {
                        boolResult = true;
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        //alert("에러로 인하여  데이터를 로딩할수 없습니다."+ errorThrown);
                        boolResult = false;
                    }
                });
                return boolResult;
            };
            if ( viewType != "" && Array.isArray(arrCoreInfo.statics.viewScripts[viewType])) {
                $.each(arrCoreInfo.statics.viewScripts[viewType], function(index, element) {
                    if (ajaxRequest(element) == false) {
                        return false;
                    }
                });
            }

        },
        addStyle: function(element, objCompleteFunction) {
            var strStyleUrl = element.css;
            var strFileName = element.name;
            var exist = $.containStyle(mArrOption.cssList, strFileName);
            if (exist == false) {
                //don't set href attribute
                mArrOption.styleMarker.before("<link rel='stylesheet' type='text/css' id='"+ strFileName +"'/>");

                $("#"+strFileName).bind('load', function() {
                    $("#"+strFileName).unbind('load');
                    objCompleteFunction();
                });
                $("#"+strFileName).attr("href", strStyleUrl);

                mArrOption.cssList.push(strFileName);

                $.checkStyle(strFileName, 218, 0);
            } else {
                objCompleteFunction();
            }
        },
        // workaround to check if a style is loaded
        checkStyle : function (strFileName, value, time) {
            if ($('#'+strFileName).css('z-index') == value) {
                $('#'+strFileName).trigger('load');
            } else {
                if (time < mArrOption.timeout) {
                    setTimeout(function() {
                        $.checkStyle(strFileName, value, time + mArrOption.range);
                    }, mArrOption.range);
                }
            }
        },
        containStyle : function(a, obj) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        },
    });

    var mArrOption = {
        cssList: null,
        version: "1.0",
        rootPath: "",
        range: 100,
        timeout: 4000
    };
    $.initCore();
})(jQuery);