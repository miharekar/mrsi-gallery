(function($) {

	// export the constructor function to the global namespace
	window.gallery = function() {
		this.init = init;
		this.setImages = setImages;
		this.toggleType = toggleType;
		this.next = next;
		this.previous = previous;
		this.changeTo = changeTo;
		this.setKeyboardShortcuts = setKeyboardShortcuts;
	
		var isTerribleBrowser = false;
		var emptyDiv = '<div class="background new"></div>';
		var running = false;
		var current = 0;
		var transitionTime = 1000;
		var images = new Array();
		var imagesMax = 0;
		var type = 'cover';
	
		function init(images, shuffle) {
			detectTerribleBrowser();
			$('body').append('<div class="background new" style="display: none;"></div><img id="hiddenImg"/><div id="loading"></div>');
			setImages(images, shuffle);
			fadeInFirstImage();
		}
	
		function setImages(json, shuffle) {
			if (shuffle) {
				json = randomizeArray(json);
			}
			images = json;
			imagesMax = images.length - 1;
			current = 0;
		}
	
		function toggleType() {
			if (!running && !isTerribleBrowser) {
				running = true;
				oldType = type;
				type = (type === 'cover') ? 'contain' : 'cover';
				$('.background').fadeOut('', function() {
					$(this).removeClass(oldType).addClass(type).
						fadeIn('', function() {
							running = false;
						});
				});
				return true;
			}
			return false;
		}
	
		function next() {
			current = (current + 1) % imagesMax;
			return changeImage();
		}
	
		function previous() {
			current = (current - 1 + imagesMax) % imagesMax;
			return changeImage();
		}
	
		function changeTo(number) {
			if (number <= imagesMax && number >= 0 && number != current) {
				current = number;
				return changeImage();
			}
			return false;
		}

		function detectTerribleBrowser() {
			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
				isTerribleBrowser = parseFloat(RegExp.$1, 10) < 9;
			}
		}
	
		function fadeInFirstImage() {
			$('#hiddenImg').
				attr('src', images[current]).
				load(function() {
					addBackgroundImage(images[current]);
					$('.new').fadeIn(transitionTime);
				});	
		}
	
		function addBackgroundImage(image) {
			var n = $('.new');
			if (isTerribleBrowser) {
				var filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image + "', sizingMethod='scale')";
				n.css({
					'filter': filter,
					'-ms-filter': filter
				});
			} else {
				n.css('background-image', "url(" + image + ")").addClass(type);
			}
		}
	
		function changeImage() {
			if (!running) {
				running = true;
				$('#loading').show();
				$('.new').addClass('old').removeClass('new');
				$('body').append(emptyDiv);
				$('#hiddenImg').
					attr('src', images[current]).
					load(function() {
						addBackgroundImage(images[current]);
						$('#loading').hide();
						$('.old').fadeOut(transitionTime, function() {
							$(this).remove()
							running = false;
						});
					});
				return true;
			}
			return false;
		}
	
		function setKeyboardShortcuts() {
			$(document.documentElement).keyup(function (e) {
				if (!running) {
					if (e.keyCode == 39 || e.keyCode == 38) next();
					if (e.keyCode == 37 || e.keyCode == 40) previous();
				}
			});
		}
		
		// makes a copy of the original array so it returns the
		// shuffled array without changing the original	
		// (implementation of the Fisher-Yates shuffle)
		function randomizeArray(array) {
			var tmp, arrayCopy = array.slice(), i = arrayCopy.length, j;
			while (--i) {
				j = Math.round(Math.random() * i);
				tmp = arrayCopy[j];
				arrayCopy[j] = arrayCopy[i];
				arrayCopy[i] = tmp;
			}
			return arrayCopy;
		}
	};
})(jQuery);
