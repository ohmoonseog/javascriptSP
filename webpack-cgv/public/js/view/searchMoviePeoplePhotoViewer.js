	    function fnchangedcallback(event) {
	        var idx = event.item.index;
	        var str = (idx - 1) + " / " + stillCnt;
	        $("#cnt span").html(str);
	    }

	    function PosterDownload() {
	        if (AppVersion_Master > 410) {
				var u = $(".active img").attr("src");
				CGVFanpageAppInterface.PosterDownload(u, "0");
	        }
	    }

	    function close_viewer(movieIdx, peopleIdx) {
	    	var url = gateURL + "fanpage/Gateway.aspx?movieIdx=" + movieIdx + "&fanpageReturnUrl=moviePeopleView?PeopleIdx=" + peopleIdx;
	    	location.href = url;
	    }

		$(document).ready(function () {
			if(IsWebView_Master){
				basicNavigation(4, "", "");
				simpleCloseNavigation(movieGroupTitle, '10');

				if (AppVersion_Master > 410) {
		            $("#saveLink").show();

		         	// 앱용 CSS 적용
            		$(".slides").css("padding-top", "0");
            		$(".slide_paging").css("top", "15px");
		        }
			}
		});

		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
			});

			$(window).load(function () {
				$('#stillWrap2').height($(window).height());
				$('.slides .item').height($(window).height() - $('.stillview').outerHeight()).attr('data-height', $('.stillview').outerHeight());
				var stillCut = $('.slides').on('initialized.owl.carousel', function (event) {
					fnchangedcallback(event);
					imgFit(event);
		        }).owlCarousel({
	                items: 1,
					lazyLoad: true,
					loop: true,
					nav: false,
	                dots: false,
					startPosition: iCnt - 1,
				}).on('changed.owl.carousel', function (event) {
					fnchangedcallback(event);
					imgFit(event);
		        }).on('resized.owl.carousel', function (event) {
					imgFit(event);
				})
			});

	        var imgFit = function () {
				var $slides = $('.slides .item');
				$slides.each(function(){
					var maxWidth = $slides.width();
					var maxHeight = $slides.height();
					var ratio = 0;
					var imgs = $(this).find('img');
					var width = imgs.width();
					var height = imgs.height();
					if (width < maxWidth || width > maxWidth) {
						ratio = maxWidth / width;
						imgs.css('width', maxWidth);
						imgs.css('height', height * ratio);
						height = height * ratio;
						width = width * ratio;
					}

					if (height > maxHeight) {
						ratio = maxHeight / height;
						imgs.css('height', maxHeight);
						imgs.css('width', width * ratio);
						width = width * ratio;
					}
				});
			};

			$(window).resize(function () {
				$('#stillWrap2').height($(window).height());
				$('.slides .item').height($(window).height() - $('.stillview').outerHeight()).attr('data-height', $('.stillview').outerHeight());
			});