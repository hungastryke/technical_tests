(function($){
	var active = $('section:first-child a:first-child');
	var content = $('section:last-child');
	var el;
	var page = $('body');
	var _store;
	var store = $('section dt');
	// vars for internet explorer
	var ie = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
	var version = new Number(RegExp.$1);
	ie && version < 10 ? $('html').addClass('ie9') : "";
	var ie9 = $('html').hasClass('ie9');
	var tab = $('section a');
	var loadFX = function(value){
		var winWidth = $(window).innerWidth();
		var winHeight = $(window).innerHeight();
		var bWidth = $('html').attr('data-width');
		var bHeight = $('html').attr('data-height');
		var center = (winWidth/2) - 30;
		var vertical = (winHeight/2) - 30;
		// for ie
		var ieRotate = function(){
			var interval = null;
			var counter = 0;
			interval = setInterval(function(){
				counter -= 1;
				$('#loader').css({ '-ms-transform' : 'rotate(' + -counter + 'deg)' });
			}, 0);
		}
		var modality = function(){
			var winWidth = $(window).innerWidth();
			var winHeight = $(window).innerHeight();
			var bWidth = $('html').attr('data-width');
			var bHeight = $('html').attr('data-height');
			var center = (winWidth/2) - 30;
			var vertical = (winHeight/2) - 30;
			$('#modal').css({ 'width' : winWidth, 'height' : winHeight });
			$('.loadContainer').css({ 'top' : vertical, 'left' : center });
		}
		var showLoader = function(){
			page.prepend('<div id="modal"></div>'
				+ '<div class="loadContainer">'
				+ '<div id="loader"></div>'
				+ '<p>loading</p>'
				+ '</div>'
			);
			modality();
			ie9 ? ieRotate : "";
		}
		$(window).resize(function(){
			modality();
		});
		value ? showLoader() : $('#modal, .loadContainer').remove();
	} 
	// end ajax loader
	var centre = function(shop){
		$.ajax({
			url: 'http://www.westfield.com.au/api/deal/master/deals.json?centre=' + shop + '&state=published',
			type: 'GET',
			datatype: 'json',
			success: function(data,textStatus, jqXHR){
				for(j=0;j<data.length;j++){
						$('ul#' + shop).append('<li>'
							+ '<img src="img/nike.jpg" />'
							+ '<div>'
							+ '<h3>' + data[j].title + '</h3>'
							+ '<p>' +  data[j].terms_and_conditions + '</p>'
							+ '</div>'
							+ '<a href="#">View More &#9654;</a>'
							+ '</li>'
						);
						truncate();
				}
			},
			error: function(error, errorThrown, textStatus){
				console.log('error: ' + errorThrown);
			},
			complete: function(){ 
				loadFX(false);
			}
		})}
	var populate = function(country){
		$.ajax({
			url: 'http://www.westfield.com.au/api/centre/master/centres.json?state=' + country,
			type: 'GET',
			datatype: 'json',
			success: function(data,textStatus, jqXHR){
				content.html('');
				for(i=0;i<data.length;i++){
					// place in dt tag
					content.append('<dl>'
						+ '<dt id="centre' + [i] + '">'
						+ '<span>+</span>' 
						+ data[i].short_name 
						+ '</dt>'
						+ '<dd>'
						+ '<ul id="'+ data[i].short_name.toLowerCase().split(" ").join("") + '">'
						+ '</ul>'
						+ '</dd>'
						+ '</dl>'
					);
					centre(data[i].short_name.toLowerCase().split(" ").join(""));
				}
			},
			error: function(error, errorThrown, textStatus){
				console.log('error: ' + errorThrown);
			},
			complete: function(){
				//console.log('done');
			}
		});
	}
	// truncation
	var truncate = function(){
		$('ul DIV p').each(function(){			
			var a = $(this);
			var b = a.html();
			var c = b.length;
			if(c > 200){
				var d = b.substring(0,100);
				a.html(d + '...');
			}
		});
	}
	var category = function(el){
		this.el = el;
	}
	category.prototype.activate = function(){
		tab.removeClass('active');
		this.el.addClass('active');
	}
	category.prototype.close = function(){
		$('section:last-child dt').removeClass('slideDown').children('span').removeClass('selected').html('+');
		$('section:last-child dt').parent().children('dd').removeClass('show').addClass('hide').slideUp();
	}
	category.prototype.open = function(){
		var closed = new category($(this).not());
		closed.close();
		this.el.addClass('slideDown');
		this.el.children('span').addClass('selected').html('-');
		this.el.parent().children('dd').removeClass('hide').addClass('show').slideDown();
	}
	tab.on('click', function(event){
		event.preventDefault();
		if(!$(this).hasClass('active')){
			el = new category($(this));
			el.activate();
			populate($(this).html()); 
			loadFX(true);
		}
	});
	content.on('click', function(event){
		var title = event.target.id;
		title = $('#' + title);
		var _store = new category(title);
		title.hasClass('slideDown') ? _store.close() : _store.open();
	});
	// set it off
	$(window).on('load', function(){
		tab.eq(0).trigger('click');
	});
})(jQuery);