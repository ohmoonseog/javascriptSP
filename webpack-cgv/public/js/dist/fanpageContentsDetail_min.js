window.contentCommentListOption={movieIdx:null,contentsIdx:null,scrollTop:-1,listInitYn:"Y",loaddingYn:"N",totCnt:0,endRowYn:"N",endRow:0,pageIndex:1,pageSize:10,totCnt:0,loading:!1},contentCommentListOption.init=function(t){"page"==t&&(contentCommentListOption.listInitYn="Y",contentCommentListOption.loaddingYn="N",contentCommentListOption.scrollTop=-1,contentCommentListOption.pageIndex=1,contentCommentListOption.pageSize=10,contentCommentListOption.endRowYn="N",contentCommentListOption.endRow=0,contentCommentListOption.movieIdx=strMovieIdx,contentCommentListOption.contentsIdx=strContentsIdx,contentCommentListOption.totCnt=parseInt(commentTotCnt),contentCommentListOption.loading=!1)},contentCommentListOption.setEvent=function(){$("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx] a.btn_comment").off("click").on("click",fnCommentReplayReg),$("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx] a.btn_reply").off("click").on("click",(function(){var t=$(event.target).parents("li[comment_idx]");if(t.find("ul.fp_comment_inner_list").hasClass("active")){var e=50*t.find("ul.fp_comment_inner_list li").length;t.find("ul.fp_comment_inner_list").removeClass("active").slideUp(e,(function(){$(this).children().remove(),$(this).css("display","none")})).parent().find(".reply_more").remove()}else{var n=$(event.target).attr("data-count"),o=t.attr("comment_idx");fnCmtsPreviewContentReply(o,$(event.target),1,10,n)}})),$(window).off("scroll").on("scroll",(function(t){$(window).scrollTop()>=.9*($(document).height()-$(window).height())&&$(window).scrollTop()>=$(document).height()-$(window).height()-100&&(contentCommentListOption.scrollTop=$(document).scrollTop(),contentCommentListOption.totCnt>contentCommentListOption.pageIndex*contentCommentListOption.pageSize&&!contentCommentListOption.loading?(contentCommentListOption.pageIndex++,contentCommentListOption.loading=!0,fnContentsCommentList()):contentCommentListOption.endRowYn="Y")})),$("div.fp_contbox.observationReview_wrap ul.fp_comment_list li a[data-popup]").off("click").on("click",(function(){if(!$(this).data("popupOnclick")){event.target;var t=$(event.target).parents("li[comment_idx]"),e=t.attr("comment_idx")||"",n=t.attr("cmts_reg_id")||"",o=t.attr("reply_idx")||"",i=t.find("div.add_img_wrap > img").attr("src")||"",r=$(this).data("popup")||null,m=$(this).data("popup-direction")||null,a=$(this).data("popup-depth")||null;$("#"+r).attr("comment_idx",e),$("#"+r).attr("reply_idx",o),$("#"+r).attr("cmts_reg_id",n),$("#"+r).attr("cmts_gubun","2"),$("#"+r).attr("old_file_url",i),$.fn.openPopup(r,m,a)}})),$("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx] .btn_allView").off("click").on("click",(function(){$(this).parents(".add_img_wrap").addClass("fullView"),$(this).remove()}))},contentCommentListOption.getHtmlList=function(t,e,n,o){var i="";return i+="<li contents_idx='"+contentCommentListOption.contentsIdx+"' comment_idx='"+t.COMMENT_IDX+"' cmts_reg_id='"+t.USER_CODE+"'  cmts_gubun='1'>",i+="<div class='img_wrap'>",i+="<img src='"+(isNull(t.commentUserImage)?"":t.commentUserImage)+"' onerror=\"this.src='/images/fanpage/common/bg_profile_noImage.svg'\" alt=''/>",i+="</div>",i+="<div class='writer_wrap'>",i+="<a href='javascript:void(0)' class='btn_fp_more' data-popup='"+("N"==t.MY_COMMENT_YN?"popWorkEditor":"popWriteEditor")+"' data-popup-direction='CENTER'>더보기</a>",i+="<p class='writer_info_wrap'>",i+="<span class='writer_name'>"+t.commentUserName+"</span>",i+="<span class='writer_date'>"+t.INSERT_DATE.uformat("XXXX-XX-XX XX:XX:XX").mCgvTimeFormat(o)+"</span>",t.MediaCode.split("^").filter((function(t,e){return!isNull(String.prototype.mediaCodeMap[t])}))>0&&(i+="<span class='writer_screenType'>"+t.MediaCode.split("^").reduce((function(t,e,n){return t+(e.codeToName()+" ")}),"").trim()+"</span>"),i+="</p>",i+="<div class='writer_comment' style='word-break:break-all;'>"+t.COMMENT_CONTENTS+"</div>",isNull(t.FILE_URL)||(i+="<div class='add_img_wrap'>",i+="<img src='"+e+t.FILE_URL.replaceAll(n,"")+"' alt='가로이미지 Sample'/>",i+="<a href='javascript:void(0)' class='btn_allView'>이미지 모두보기</a>",i+="</div>"),i+="<div class='comment_info_Wrap'>",i+="<div class='comment_btnWrap'>",i+="<div class='com_checkbox_comment_heart'>",i+="<input type='checkbox' id='checkCommentHeart0' "+(0==t.USER_GOOD_YN?"":"checked ")+"  onclick=\"fnContentCommentOpt('CG');\"/>",i+="<label for='checkCommentHeart0'>",i+="<span class='ico_comment_heart'></span>",i+="<span class='favorite_count'  cmts_gubun='1'>"+t.LIKE_CNT+"</span>",i+="</label>",i+="</div>",i+="<a href='javascript:void(0)' class='btn_reply'  data-count='"+t.REPLY_CNT+"'></a>",i+="</div>",i+="<a href='javascript:void(0)' class='btn_comment' >댓글쓰기</a>",i+="</div>",i+="</div>",i+="<ul class='fp_comment_inner_list'></ul>",(i+="</li>")+""},contentCommentListOption.getCommentList=function(t){var e=t.strImageServer,n=t.strImageServer2;return t.contentsCommentList.reduce((function(o,i,r){return contentCommentListOption.endRow++,o+contentCommentListOption.getHtmlList(i,e,n,t.sysdate)}),"")},contentCommentListOption.setContentCommentList=function(t){var e=contentCommentListOption.getCommentList(t);$("div.fp_contbox.observationReview_wrap ul.fp_comment_list").append(e),contentCommentListOption.setEvent(),contentCommentListOption.loading=!1},window.fnContentsCommentList=function(){$.ajaxCgv({url:"/fanpage/contentsCommentList",delayYn:!0,data:JSON.stringify({movieIdx:contentCommentListOption.movieIdx,contentsIdx:contentCommentListOption.contentsIdx,pageIdx:contentCommentListOption.pageIndex,pageSize:contentCommentListOption.pageSize}),success:function(t){contentCommentListOption.setContentCommentList(t)}})},window.fileObject,$(document).ready((function(){fileObject=new FileObject,IsWebView_Master&&basicNavigation(3,"",""),contentCommentListOption.init("page"),fileObject.init($("#itemFile"),$("#itemList"),(function(t,e){return'<li><div class="inner"><img src="'+t+'" itemIdx="" attachKey="'+e+'" OLD_URL="" alt=""></div><button type="button" class="btn_del" onclick="fileObject.fnDelItem()">삭제</button></li>'}),"div#popCommentReplyWrite.popup_dim"),"N"==previewYn&&fnContentsCommentList(),fnapageVideos=document.querySelectorAll("video"),enableVideosDetail(),"Y"==mainToFan&&(fnWriteContentsComment("CI",strContentsIdx),mainToFan="N")})),window.fnContentCommentsReg=function(){if(!loginCheck())return!1;var t="popCommentReplyWrite";$("#"+t).attr("contents_idx",strContentsIdx),$("#"+t).attr("comment_idx",""),$("#"+t).attr("cmts_reg_id",strUcd),$("#"+t).attr("cmts_gubun","2"),$("#"+t).attr("old_file_url",""),$("#"+t).find("textarea#commentContent").val(""),$("#"+t).find("strong.myComments_title").text("댓글달기"),$("#"+t).find("a.btn_enrollment").off("click").on("click",(function(){fnCommentReplayRegSave("CI")})).text("등록"),$.fn.openPopup(t,"UP",1),fileObject.readyCommentReplayRegContentsEdit("C")},window.fnCommentReplayReg=function(){if(!loginCheck())return!1;if(!$(this).data("popupOnclick")){var t=$(event.target).parents("li[comment_idx]"),e=t.attr("contents_idx")||"",n=t.attr("comment_idx")||"",o=t.attr("cmts_reg_id")||"",i="popCommentReplyWrite",r=""==n?"CI":"RI";$("#"+i).attr("contents_idx",e),$("#"+i).attr("comment_idx",n),$("#"+i).attr("cmts_reg_id",o),$("#"+i).attr("cmts_gubun","2"),$("#"+i).attr("old_file_url",""),$("#"+i).find("textarea#commentContent").val(""),$("#"+i).find("strong.myComments_title").text("댓글달기"),$("#"+i).find("a.btn_enrollment").off("click").on("click",(function(){fnCommentReplayRegSave(r)})).text("등록"),$.fn.openPopup(i,"UP",1),fileObject.readyCommentReplayRegContentsEdit("C")}},window.fnCommentReplyView=function(t){if(!loginCheck())return!1;if(!$(this).data("popupOnclick")){var e,n=$(event.target).parents("div[comment_idx]"),o=(n.attr("contents_idx"),n.attr("comment_idx")||""),i=n.attr("reply_idx")||"",r=n.attr("cmts_reg_id")||"",m=n.attr("old_file_url")||"",a="popCommentReplyWrite",c=""==i?"CU":"RU";e=""==i?$("div.fp_contbox.observationReview_wrap ul.fp_comment_list li[comment_idx='"+o+"']").find("div.writer_comment").text():$("ul.fp_comment_inner_list li[comment_idx='"+o+"'][reply_idx='"+i+"']").find("div.writer_comment").text(),$("#"+a).attr("comment_idx",o),$("#"+a).attr("cmts_reg_id",r),$("#"+a).attr("reply_idx",i),$("#"+a).attr("old_file_url",m),$("#"+a).attr("cmts_gubun","2"),$("#"+a).find("textarea#commentContent").val(e),$("#"+a).find("strong.myComments_title").text("댓글수정"),$("#"+a).find("a.btn_enrollment").off("click").on("click",(function(){fnCommentReplayRegSave(c)})).text("수정"),$.fn.openPopup(a,"UP",1),fileObject.readyCommentReplayRegContentsEdit("R",m)}},window.fnCommentReplayRegSave=function(t){var e,n="popCommentReplyWrite",o=$(event.target).parents("#"+n),i=o.attr("comment_idx"),r=o.attr("reply_idx")||"",m=(o.attr("chk_is_show_view"),o.attr("cmts_reg_id")),a=o.attr("old_file_url")||"",c=o.find("#commentContent").val();c=c.emojiToString();var s="";if($(this).find("img"),$("#itemList li").each((function(){var t=$(this).find("img").attr("attachKey"),e=null;if(!isNull(t)&&null==(e=fileObject.getFileFromMap(t)))return alert(t+"를 찾을 수 없습니다."),check=!1,!1;s=e})),e={gubun:t,movieIdx:strMovieIdx,contentsIdx:strContentsIdx,commentIdx:i,replyIdx:r,commentContent:c,fileFile:s,recvUcode:m,oldFileUrl:a},confirm("저장 하시겠습니까?"))if(""==c)alert("내용을 입력해 주세요.");else{if(c.emojiLength()>2e3)return alert("내용은 2000자 이하로 등록하셔야 합니다."),!1;fnSendGALog("1","",AppVersion_Master>=448?"MA_팬페이지":"MW_팬페이지","관련소식_댓글달기",movieGroupTitle),$.ajax({method:"post",url:"/fanpage/editContentsComment",processData:!1,contentType:!1,dataType:"json",data:jsJsonToFormData(e),success:function(i){if("CI"==e.gubun){contentCommentListOption.totCnt++,$("div.cover_list a.btn_reply span").text(contentCommentListOption.totCnt);var r=i.addContentComment.reduce((function(t,e,n){return contentCommentListOption.endRow++,t+contentCommentListOption.getHtmlList(e,i.strImageServer,i.strImageServer2,i.sysdate)}),"");$(r).prependTo("div.fp_contbox.observationReview_wrap ul.fp_comment_list").slideDown(300),contentCommentListOption.setEvent()}else if("CU"==e.gubun)if(o.attr("old_file_url",""),(o=$("ul.fp_comment_list li[comment_idx='"+e.commentIdx+"']")).find(".writer_comment").html(e.commentContent),""==i.FILE_URL)o.find(".add_img_wrap").remove();else if(0==o.find(".add_img_wrap").length){var m="";m+="<div class='add_img_wrap'>",m+="<img src='"+i.FILE_URL+"' alt='가로이미지 Sample'/>",m+="<a href='javascript:void(0)' class='btn_allView'>이미지 모두보기</a>",m+="</div>",o.find(".writer_comment").after(m)}else o.find(".add_img_wrap").find("img").attr("src",i.FILE_URL);else{o.attr("old_file_url","");var a=(o=$("ul.fp_comment_list li[comment_idx='"+e.commentIdx+"']")).find(".btn_reply"),c=parseInt(a.attr("data-count"));if("RI"==t&&(c++,a.attr("data-count",c)),a.off("click").on("click",(function(){if(o.find("ul.fp_comment_inner_list").hasClass("active")){var t=50*o.find("ul.fp_comment_inner_list li").length;o.find("ul.fp_comment_inner_list").removeClass("active").slideUp(t,(function(){$(this).children().remove(),$(this).css("display","none")})).parent().find(".reply_more").remove()}else{var e=$(event.target).attr("data-count"),n=o.attr("comment_idx");fnCmtsPreviewContentReply(n,$(event.target),1,10,e)}})),o.find("ul.fp_comment_inner_list").hasClass("active")){$(event.target).attr("data-count");var s=o.attr("comment_idx");if($_obj_reply_more=o.parents("li[comment_idx='"+e.commentIdx+"']").find("div.reply_more"),$_obj_reply_more.length>0){var l=parseInt($_obj_reply_more.find("a").attr("total-count"));$_obj_reply_more.find("a").attr("total-count",l+1)}else fnCmtsPreviewContentReply(s,$(event.target),1,c,0)}}$.fn.closePopup(n)},error:function(){alert("처리 중 에러가 발생하였습니다.\n잠시 후에 다시 이용해 주세요.")}})}},window.fnGetCommentsCopy=function(t){var e,n=$(event.target).parents("div[comment_idx]"),o=n.attr("comment_idx"),i=n.attr("reply_idx");n.attr("target_gbn"),"CC"==t?e=$("ul.fp_comment_list li[comment_idx='"+o+"']").first().find("div.writer_comment").first():"CR"==t&&(e=$("ul.fp_comment_list li[comment_idx='"+o+"'][reply_idx='"+i+"']").first().find("div.writer_comment").first());var r=e.text();r=r.replaceAll("<br>","\n"),gfnGetCommentsCopy(r)},window.fnContectCommentDel=function(t){if(!loginCheck())return!1;if(confirm("해당 글을 삭제하시겠습니까?")){var e={};e.gubun=t,e.movieIdx=strMovieIdx,e.contentsIdx=strContentsIdx;var n=$(event.target).parents("div[comment_idx]");e.commentIdx=n.attr("comment_idx"),e.replyIdx=n.attr("reply_idx"),$.ajax({method:"post",url:"/fanpage/delContentsComment",dataType:"json",data:e,success:function(t){if("success"==t.result_code&&"0"==t.resultCd){alert("정상적으로 삭제되었습니다.");var n=null,o=null;if("CD"==e.gubun)n=$("ul.fp_comment_list li[comment_idx='"+e.commentIdx+"']"),contentCommentListOption.endRow--,contentCommentListOption.totCnt--,$("div.cover_list a.btn_reply span").text(contentCommentListOption.totCnt),n.slideUp(300,(function(){$(this).remove()}));else{o=$("ul.fp_comment_list li[comment_idx='"+e.commentIdx+"']").has("[reply_idx]"),$_obj_reply=o.find(".btn_reply");var i=parseInt($_obj_reply.attr("data-count"))-1;$_obj_reply.attr("data-count",i),o.find("[reply_idx='"+e.replyIdx+"']").slideUp(300,(function(){$(this).remove()})),0==i&&o.find("ul.fp_comment_inner_list").removeClass("active").css("display","none")}}},error:function(){location.href=gateURL+"Fanpage/Gateway.aspx?movieIdx="+strMovieIdx+"&fanpageReturnUrl="+encodeURIComponent("contentsDetail?movieIdx="+strMovieIdx+"&contentsIdx="+window.document.location.href.split("contentsIdx=")[1])}})}},window.fnContentCommentOpt=function(t){if(!loginCheck())return event.preventDefault(),!1;if("R"==t[1]){if(!confirm("해당 글을 신고하시겠습니까?"))return!1}else if("H"==t[1]&&!confirm("해당 글을 숨기시겠습니까?"))return!1;var e="",n={},o=null;o="G"==t[1]?"C"==t[0]?$(event.target).parents("li[comment_idx]").first():$(event.target).parents("li[comment_idx][reply_idx]").first():$(event.target).parents("div.popup_dim"),n.optKind=t,n.movieIdx=strMovieIdx,n.contentsIdx=strContentsIdx,n.commentIdx=o.attr("comment_idx"),n.recvUcode=o.attr("cmts_reg_id"),n.rUtype=o.attr("reg_user_type"),n.replyIdx=o.attr("reply_idx");var i=null;"C"==t[0]?(e="/fanpage/commentOpt",i=$("ul.fp_comment_list li[comment_idx='"+n.commentIdx+"']").first()):(e="/fanpage/replyOpt",n.replyIdx=o.attr("reply_idx"),i=$("ul.fp_comment_list li[comment_idx='"+n.commentIdx+"'][reply_idx='"+n.replyIdx+"']")),$.ajax({method:"post",url:e,dataType:"json",data:n,success:function(e){if("R"==t[1])"0"==e.resultCd?alert("신고가 접수되었습니다."):alert("이미 신고한 글입니다.");else if("H"==t[1])if("0"==e.resultCd){var o=null;o="C"==t[0]?i.find("a.btn_reply"):i.parents("[comment_idx='"+n.commentIdx+"']").find("a.btn_reply");var r=parseInt(o.first().attr("data-count"));o.first().attr("data-count",r-1),i.slideUp(300,(function(){$(this).remove()}))}else alert("이미 숨긴 글입니다.");else if("G"==t[1]){var m=parseInt(i.find("span.favorite_count").first().text());"0"==e.resultCd?(i.find("input#checkCommentHeart0").first().prop("checked",!0),i.find("span.favorite_count").first().text(m+1)):(i.find("input#checkCommentHeart0").first().prop("checked",!1),i.find("span.favorite_count").first().text(m-1))}},error:function(){location.href=gateURL+"Fanpage/Gateway.aspx?movieIdx="+strMovieIdx+"&fanpageReturnUrl="+encodeURIComponent("contentsDetail?movieIdx="+strMovieIdx+"&contentsIdx="+window.document.location.href.split("contentsIdx=")[1])}})},window.closeWrite=function(){"push"==fanpageGubunVal?window.history.go(-1):(opener.window.location.reload(),window.close())};