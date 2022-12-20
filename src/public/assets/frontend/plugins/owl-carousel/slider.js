$(document).ready(function() {
	$('#slide_banner').owlCarousel({
		items : 1, //10 items above 1000px browser width
		itemsDesktop : [1024,1], //5 items between 1024px and 901px
		itemsDesktopSmall : [900,1], // 3 items betweem 900px and 601px
		itemsTablet: [600,1], //2 items between 600 and 0;
		itemsMobile : [320,1],
		nav : true,
		navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right right_button' aria-hidden='true'></i>"],
		slideSpeed : 800,
		autoplay: true,
		dots: false,
		loop:true,
		afterMove: function (elem) {
			//var current = this.currentItem;
			//var src = elem.find(".owl-item").eq(current).find("img").attr('src');
			//if (src.indexOf('slide1') >= 0){
			//	$(".slideshow_full_width").removeClass('slide2_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide3_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide4_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide5_bgcolor');
			//	$(".slideshow_full_width").addClass('slide1_bgcolor');
			//} else if (src.indexOf('slide2') >= 0){
			//	$(".slideshow_full_width").removeClass('slide1_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide3_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide4_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide5_bgcolor');
			//	$(".slideshow_full_width").addClass('slide2_bgcolor');
			//}else if (src.indexOf('slide3') >= 0){
			//	$(".slideshow_full_width").removeClass('slide1_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide2_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide4_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide5_bgcolor');
			//	$(".slideshow_full_width").addClass('slide3_bgcolor');
			//}else if (src.indexOf('slide4') >= 0){
			//	$(".slideshow_full_width").removeClass('slide1_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide2_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide3_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide5_bgcolor');
			//	$(".slideshow_full_width").addClass('slide4_bgcolor');
			//}else if (src.indexOf('slide5') >= 0){
			//	$(".slideshow_full_width").removeClass('slide1_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide3_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide4_bgcolor');
			//	$(".slideshow_full_width").removeClass('slide2_bgcolor');
			//	$(".slideshow_full_width").addClass('slide5_bgcolor');
			//}
		}
	});
});