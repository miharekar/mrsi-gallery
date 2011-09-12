(function ($, Modernizr, window) {
	'use strict';
	var gallery = function (opts) {
		var defaultOpts = {
			images: [],
			shuffle: false,
			transitionTime: 1000,
			type: 'cover',
			keyboardShortcuts: false
		};
		
		opts = $.extend({}, defaultOpts, opts);
		
		this.setImages(opts.images, opts.shuffle);
		this.detectTerribleBrowser();
		this.detectTransitionType();		
		this.setTransitionTime(opts.transitionTime);
		this.type = opts.type;
		
		if (opts.keyboardShortcuts) {
			this.setKeyboardShortcuts();
		}
		
		var self = this;
		
		this.hiddenImg.load(function () {
			if (!self.running) {
				return;
			}
			
			self.addBackgroundImage(self.images[self.current]);
			self.loadingDiv.hide();
			
			if (self.oldDiv !== null) {
				if (self.transitionType) {
					self.oldDiv.addClass('fadeout').bind(self.transitionType, function () {
						self.oldDiv.remove();
						self.running = false;
					});
				} else {
					self.oldDiv.fadeOut(self.transitionTime, function () {
						self.oldDiv.remove();
						self.running = false;
					});
				}
			} else {
				
				self.backgroundDiv.fadeIn(self.transitionTime, function () {
					self.running = false;
				});
				
				//console.log(self.backgroundDiv);
				//self.backgroundDiv.removeClass('transition').addClass('fadeout').addClass('transition').removeClass('fadeout');
			}
		});
		
		this.running = true;
		this.hiddenImg.attr('src', this.images[this.current]);
	};
	
	gallery.prototype.emptyDiv          = '<div class="background new transition"></div>';
	gallery.prototype.backgroundDiv     = $(gallery.prototype.emptyDiv).hide().appendTo('body');
	gallery.prototype.oldDiv			= null;
	gallery.prototype.hiddenImg         = $('<img id="hiddenImg"/>').appendTo('body');
	gallery.prototype.loadingDiv        = $('<div id="loading"></div>').appendTo('body');
	
	//sets transitonTime
	gallery.prototype.setTransitionTime = function (time) {
		this.transitionTime = parseInt(time, 10);
	};
	
	// makes a copy of the original array so it returns the
	// shuffled array without changing the original	
	// (implementation of the Fisher-Yates shuffle)
	var randomizeArray = function (arr) {
		var tmp, arrayCopy = arr.slice(), i = arrayCopy.length, j;
		
		while (i) {
			i = i - 1;
			j = Math.round(Math.random() * i);
			tmp = arrayCopy[j];
			arrayCopy[j] = arrayCopy[i];
			arrayCopy[i] = tmp;
		}
		return arrayCopy;
	};
	
	//sets images array, optionally shuffles
	gallery.prototype.setImages = function (json, shuffle) {
		if (shuffle) {
			json = randomizeArray(json);
		}
		
		this.images = json;
		this.imagesMax = this.images.length - 1;
		this.current = 0;
	};
	
	//sets new images array - usefull when having multiple galleries
	gallery.prototype.setNewImages = function (opts) {
		var defaultOpts = {
			images: [],
			shuffle: false
		};
		
		opts = $.extend({}, defaultOpts, opts);

		var oldImage = this.images[this.current];
		this.setImages(opts.images, opts.shuffle);
		if (oldImage !== this.images[this.current]) {
			this.changeImage();
		}
	};

	//toggles between cover and contain CSS background type parameter
	gallery.prototype.toggleType = function () {
		var self = this;
		
		if (!this.running && !this.isTerribleBrowser) {
			var oldType = this.type;
			this.running = true;
			this.type = (this.type === 'cover') ? 'contain' : 'cover';
			this.backgroundDiv.fadeOut('', function () {
				$(this).removeClass(oldType).addClass(self.type).
					fadeIn('', function () {
						self.running = false;
					});
			});
			
			return true;
		}
		
		return;
	};

	//changes to next image in images array
	gallery.prototype.next = function () {
		if (this.running) {
			return;
		}
		
		this.current = (this.current === this.imagesMax) ? 0 : this.current + 1;
		return this.changeImage();
	};

	//changes to previous image in images array
	gallery.prototype.previous = function () {
		if (this.running) {
			return;
		}
		
		this.current = (this.current === 0) ? this.imagesMax : this.current - 1;
		return this.changeImage();
	};

	//changes to image on number position in images array
	gallery.prototype.changeTo = function (number) {
		if (number <= this.imagesMax && number >= 0 && number !== this.current) {
			this.current = number;
			return this.changeImage();
		}
		
		return;
	};

	//detects IE < 9 so it uses filter CSS attribute
	gallery.prototype.detectTerribleBrowser = function () {
		if (/MSIE (\d+\.\d+);/.test(window.navigator.userAgent)) {
			this.isTerribleBrowser = parseFloat(RegExp.$1, 10) < 9;
		}
	};
	
	gallery.prototype.detectTransitionType = function () {
		var transEndEventNames = {
		    'WebkitTransition' : 'webkitTransitionEnd',
		    'MozTransition'    : 'transitionend',
		    'OTransition'      : 'oTransitionEnd',
		    'msTransition'     : 'msTransitionEnd', // maybe?
		    'transition'       : 'transitionEnd'
		};
			
		this.transitionType = Modernizr.csstransitions ? transEndEventNames[Modernizr.prefixed('transition')] : false;
	};

	//adds background image to div
	gallery.prototype.addBackgroundImage = function (image) {
		var el = this.backgroundDiv;
		
		if (this.isTerribleBrowser) {
			var filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image + "', sizingMethod='scale')";
			el.css({
				'filter': filter,
				'-ms-filter': filter
			});
		} else {
			el.css('background-image', 'url(' + image + ')').addClass(this.type);
		}
	};

	//replaces old image with new one
	gallery.prototype.changeImage = function () {
		var self = this;

		if (!this.running) {
			this.oldDiv = this.backgroundDiv;
			this.backgroundDiv = $(this.emptyDiv).insertBefore(this.oldDiv);
			this.running = true;
			this.loadingDiv.show();
			this.oldDiv.addClass('old').removeClass('new');
			this.hiddenImg.attr('src', self.images[self.current]);

			return true;
		}
		
		return;
	};

	//set keyboard shortcuts on arrow keys
	gallery.prototype.setKeyboardShortcuts = function () {
		var self = this;
		
		$(window.document.documentElement).keyup(function (e) {
			if (!this.running) {
				if (e.keyCode === 39 || e.keyCode === 38) {
					self.next();
				}
				
				if (e.keyCode === 37 || e.keyCode === 40) {
					self.previous();
				}
			}
		});
	};
	
	// export the constructor function to the global namespace
	window.gallery = gallery;
}(jQuery, Modernizr, window));