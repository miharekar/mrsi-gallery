(function($, window) {

	var gallery = function (opts) {
		var defaultOpts = {
			images: [],
			shuffle: false
		};
		
		opts = opts || defaultOpts;
		
		this.detectTerribleBrowser();
		this.setImages(opts.images, opts.shuffle);
		
		var self = this;
		
		this.hiddenImg.load(function() {
			if (!self.running) {
				return;
			}
			
			self.addBackgroundImage(self.images[self.current]);
			self.loadingDiv.hide();
			
			if (self.oldDiv !== null) {
				self.oldDiv.fadeOut(self.transitionTime, function() {
					$(this).remove();
					self.running = false;
				});
			}
			else {
				self.backgroundDiv.fadeIn(self.transitionTime, function () {
					self.running = false;
				});
			}
		});
		
		this.running = true;
		this.fadeInFirstImage();
	};
	
	gallery.prototype.isTerribleBrowser = false;
	gallery.prototype.running           = false;
	gallery.prototype.type              = 'cover';
	
	gallery.prototype.images            = [];
	gallery.prototype.imagesMax         = 0;
	gallery.prototype.current           = 0;
	gallery.prototype.transitionTime    = 1000;
	
	gallery.prototype.emptyDiv          = '<div class="background new"></div>';
	gallery.prototype.backgroundDiv     = $(gallery.prototype.emptyDiv).hide().appendTo('body');
	gallery.prototype.oldDiv			= null;
	gallery.prototype.hiddenImg         = $('<img id="hiddenImg"/>').appendTo('body');
	gallery.prototype.loadingDiv        = $('<div id="loading"></div>').appendTo('body');
	
	gallery.prototype.setImages = function (json, shuffle) {
		if (shuffle) {
			json = randomizeArray(json);
		}
		
		this.images = json;
		this.imagesMax = this.images.length - 1;
		this.current = 0;
	};

	gallery.prototype.toggleType = function () {
		var self = this;
		
		if (!this.running && !this.isTerribleBrowser) {
			var oldType = this.type;
			this.running = true;
			this.type = (this.type === 'cover') ? 'contain' : 'cover';
			this.backgroundDiv.fadeOut('', function() {
				$(this).removeClass(oldType).addClass(self.type).
					fadeIn('', function() {
						self.running = false;
					});
			});
			
			return true;
		}
		
		return false;
	};

	gallery.prototype.next = function () {
		if (this.running) {
			return;
		}
		
		this.current = (this.current + 1) % this.imagesMax;
		return this.changeImage();
	};

	gallery.prototype.previous = function () {
		if (this.running) {
			return;
		}
		
		this.current = (this.current - 1) % this.imagesMax;
		return this.changeImage();
	};

	gallery.prototype.changeTo = function (number) {
		if (number <= this.imagesMax && number >= 0 && number != this.current) {
			this.current = number;
			return this.changeImage();
		}
		
		return false;
	};

	gallery.prototype.detectTerribleBrowser = function () {
		if (/MSIE (\d+\.\d+);/.test(window.navigator.userAgent)) {
			this.isTerribleBrowser = parseFloat(RegExp.$1, 10) < 9;
		}
	};

	gallery.prototype.fadeInFirstImage = function () {
		this.hiddenImg.attr('src', this.images[this.current]);	
	};

	gallery.prototype.addBackgroundImage = function (image) {
		var el = this.backgroundDiv;
		
		if (this.isTerribleBrowser) {
			var filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.image + "', sizingMethod='scale')";
			el.css({
				'filter': filter,
				'-ms-filter': filter
			});
		} else {
			el.css('background-image', 'url(' + image + ')').addClass(this.type);
		}
	};

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
		
		return false;
	};

	gallery.prototype.setKeyboardShortcuts = function () {
		var self = this;
		
		$(window.document.documentElement).keyup(function (e) {
			if (!this.running) {
				if (e.keyCode == 39 || e.keyCode == 38) self.next();
				if (e.keyCode == 37 || e.keyCode == 40) self.previous();
			}
		});
	};
	
	gallery.prototype.setTransitionTime = function (time) {
		this.transitionTime = parseInt(time, 10);
	};
	
	// makes a copy of the original array so it returns the
	// shuffled array without changing the original	
	// (implementation of the Fisher-Yates shuffle)
	var randomizeArray = function (arr) {
		var tmp, arrayCopy = arr.slice(), i = arrayCopy.length, j;
		
		while (--i) {
			j = Math.round(Math.random() * i);
			tmp = arrayCopy[j];
			arrayCopy[j] = arrayCopy[i];
			arrayCopy[i] = tmp;
		}
		return arrayCopy;
	};
	
	// export the constructor function to the global namespace
	window.gallery = gallery;
})(jQuery, window);