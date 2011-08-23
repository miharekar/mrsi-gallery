$script.ready('jquery', function () {
	(function($, window) {

		var gallery = function (images, opts) {
			var opts = opts || {shuffle: false};
			
			this.detectTerribleBrowser();
			$('body').append('<div class="background new" style="display: none;"></div><img id="hiddenImg"/><div id="loading"></div>');
			this.setImages(images, opts.shuffle);
			this.fadeInFirstImage();
		};
		
		gallery.prototype = {
			isTerribleBrowser: false,
			emptyDiv: '<div class="background new"></div>',
			running: false,
			current: 0,
			transitionTime: 1000,
			images: new Array(),
			imagesMax: 0,
			type: 'cover',
				
			setImages: function (json, shuffle) {
				if (shuffle) {
					json = this.randomizeArray(json);
				}
				this.images = json;
				this.imagesMax = this.images.length - 1;
				this.current = 0;
			},
		
			toggleType: function () {
				var self = this;

				if (!this.running && !this.isTerribleBrowser) {
					this.running = true;
					this.oldType = this.type;
					this.type = (this.type === 'cover') ? 'contain' : 'cover';
					$('.background').fadeOut('', function() {
						$(this).removeClass(self.oldType).addClass(self.type).
							fadeIn('', function() {
								self.running = false;
							});
					});
					return true;
				}
				return false;
			},
		
			next: function () {
				this.current = (this.current + 1) % this.imagesMax;
				return this.changeImage();
			},
		
			previous: function () {
				this.current = (this.current - 1 + this.imagesMax) % this.imagesMax;
				return this.changeImage();
			},
		
			changeTo: function (number) {
				if (this.number <= this.imagesMax && this.number >= 0 && this.number != this.current) {
					this.current = this.number;
					return this.changeImage();
				}
				return false;
			},

			detectTerribleBrowser: function () {
				if (/MSIE (\d+\.\d+);/.test(window.navigator.userAgent)) {
					this.isTerribleBrowser = parseFloat(RegExp.$1, 10) < 9;
				}
			},
		
			fadeInFirstImage: function () {
				var self = this;

				$('#hiddenImg').
					attr('src', this.images[this.current]).
					load(function() {
						self.addBackgroundImage(self.images[self.current]);
						$('.new').fadeIn(self.transitionTime);
					});	
			},
		
			addBackgroundImage: function (image) {
				var n = $('.new');
				if (this.isTerribleBrowser) {
					var filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image + "', sizingMethod='scale')";
					n.css({
						'filter': filter,
						'-ms-filter': filter
					});
				} else {
					n.css('background-image', "url(" + image + ")").addClass(this.type);
				}
			},
		
			changeImage: function () {
				var self = this;
				
				if (!this.running) {
					this.running = true;
					$('#loading').show();
					$('.new').addClass('old').removeClass('new');
					$('body').append(this.emptyDiv);
					$('#hiddenImg').
						attr('src', this.images[this.current]).
						load(function() {
							self.addBackgroundImage(self.images[self.current]);
							$('#loading').hide();
							$('.old').fadeOut(self.transitionTime, function() {
								$(this).remove();
								self.running = false;
							});
						});
					return true;
				}
				return false;
			},
		
			setKeyboardShortcuts: function () {
				$(window.document.documentElement).keyup(function (e) {
					if (!this.running) {
						if (e.keyCode == 39 || e.keyCode == 38)
						{
							this.next();
						}
						if (e.keyCode == 37 || e.keyCode == 40)
						{
							this.previous();
						}
					}
				});
			},
			
			// makes a copy of the original array so it returns the
			// shuffled array without changing the original	
			// (implementation of the Fisher-Yates shuffle)
			randomizeArray: function (array) {
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
		
		// export the library container to the global namespace
		window.gallery = {
			// export the factory method
			newGallery: function (images, options) {
				var newG = new gallery(images, options);
				
				return newG;
			}
		};
	}) (jQuery, window);
});
