/*
 * This is mrsi-gallery - a full-screen image gallery that takes advantage of the modern browser technologies.
 * Get it at https://github.com/mrfoto/mrsi-gallery
 *
 * The MIT License (MIT). Copyright (c) 2011 Miha Rekar <info@mr.si>
 */
(function ($, Modernizr, window) {
	'use strict';
	var gallery = function (opts) {
			var defaultOpts = {
				images: [],
				shuffle: false,
				transitionTime: 1000,
				type: 'cover',
				cssTransitions: false
			},
				self = this,
				removeOldImage = function () {
					self.oldDiv.remove();
					self.running = false;
				},
				stopRunning = function () {
					self.running = false;
				};

			opts = $.extend({}, defaultOpts, opts);

			this.setImages(opts.images, opts.shuffle);
			this.detectTransitionType();
			this.setTransitionTime(opts.transitionTime);
			this.type = opts.type;
			this.enableCSSTransitions(opts.cssTransitions);

			this.hiddenImg.load(function () {
				if (!self.running) {
					return;
				}

				self.addBackgroundImage(self.images[self.current]);
				self.loadingDiv.hide();

				if (self.oldDiv !== null) {
					if (self.transitionType) {
						self.oldDiv.css(self.transitionClass).addClass('fadeout').bind(self.transitionType, removeOldImage);
					} else {
						self.oldDiv.fadeOut(self.transitionTime, removeOldImage);
					}
				} else {
					if (self.transitionType) {
						self.backgroundDiv.css(self.transitionClass).removeClass('fadeout').bind(self.transitionType, stopRunning);
					} else {
						self.backgroundDiv.fadeIn(self.transitionTime, stopRunning);
					}
				}
			});

			this.running = true;
			this.hiddenImg.attr('src', this.images[this.current]);
		},
		randomizeArray;

	gallery.prototype.emptyDiv = '<div class="background new"></div>';
	gallery.prototype.oldDiv = null;
	gallery.prototype.hiddenImg = $('<img id="hiddenImg"/>').appendTo('body');
	gallery.prototype.loadingDiv = $('<div id="loading"></div>').appendTo('body');

	//sets transitonTime
	gallery.prototype.setTransitionTime = function (time) {
		this.transitionTime = parseInt(time, 10);
		time = time + 'ms';
		this.transitionClass = {
			'transition': time,
			'-moz-transition': time,
			'-webkit-transition': time,
			'-o-transition': time
		};
	};

	gallery.prototype.enableCSSTransitions = function (enable) {
		this.transitionType = enable ? this.detectTransitionType() : false;
	};

	// makes a copy of the original array so it returns the
	// shuffled array without changing the original
	// (implementation of the Fisher-Yates shuffle)
	randomizeArray = function (arr) {
		var tmp, arrayCopy = arr.slice(),
			i = arrayCopy.length,
			j;

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
		},
			oldImage;

		opts = $.extend({}, defaultOpts, opts);

		oldImage = this.images[this.current];
		this.setImages(opts.images, opts.shuffle);
		if (oldImage !== this.images[this.current]) {
			this.changeImage();
		}
	};

	//toggles between cover and contain CSS background type parameter
	gallery.prototype.toggleType = function () {
		var self = this,
			oldType;
		if (!this.running) {
			oldType = this.type;
			this.running = true;
			this.type = (this.type === 'cover') ? 'contain' : 'cover';

			if (self.transitionType) {
				this.backgroundDiv.css(self.transitionClass).addClass('fadeout').bind(this.transitionType, function () {
					$(this).removeClass(oldType);
					if (!Modernizr.backgroundsize) {
						self.resizeImage();
					}
					$(this).addClass(self.type).removeClass('fadeout').unbind(self.transitionType).bind(self.transitionType, function () {
						self.running = false;
						$(this).unbind(self.transitionType);
					});
				});
			} else {
				this.backgroundDiv.fadeOut('', function () {
					$(this).removeClass(oldType);
					if (!Modernizr.backgroundsize) {
						self.resizeImage();
					}
					$(this).addClass(self.type).fadeIn('', function () {
						self.running = false;
					});
				});
			}
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

	gallery.prototype.detectTransitionType = function () {
		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'transition': 'transitionEnd'
		};

		return Modernizr.csstransitions ? transEndEventNames[Modernizr.prefixed('transition')] : false;
	};

	//adds background image to div
	gallery.prototype.addBackgroundImage = function (image) {
		if (this.backgroundDiv === undefined) {
			if (this.transitionType) {
				this.backgroundDiv = $(gallery.prototype.emptyDiv).addClass('fadeout').appendTo('body');
			} else {
				this.backgroundDiv = $(gallery.prototype.emptyDiv).hide().appendTo('body');
			}
		}

		var el = this.backgroundDiv;

		if (!Modernizr.backgroundsize) {
			el.append('<img class="resizableImage" src="' + image + '">');
			this.resizeImage();
			$(window).resize(this.resizeImage);
		} else {
			el.css('background-image', 'url(' + image + ')').addClass(this.type);
		}
	};

	//resizes image in browsers that don't support background-size attribute
	gallery.prototype.resizeImage = function () {
		var image = $('img.resizableImage'),
			parent = image.parent(),
			imageWidth = image.width(),
			imageHeight = image.height(),
			imageRatio = imageWidth / imageHeight,
			browserWidth = window.innerWidth,
			browserHeight = window.innerHeight,
			browserRatio = browserWidth / browserHeight,
			marginLeft = 0,
			marginTop = 0;

		//lt IE 8 fix
		if (isNaN(browserRatio)) {
			browserWidth = window.document.documentElement.clientWidth;
			browserHeight = window.document.documentElement.clientHeight;
			browserRatio = browserWidth / browserHeight;
		}

		if (this.type === 'contain') {
			if (imageRatio > browserRatio) {
				imageHeight = browserWidth * imageHeight / imageWidth;
				imageWidth = browserWidth;
				marginTop = (browserHeight - imageHeight) / 2;
			} else {
				imageWidth = browserHeight * imageWidth / imageHeight;
				imageHeight = browserHeight;
				marginLeft = (browserWidth - imageWidth) / 2;
			}
		} else {
			if (imageRatio > browserRatio) {
				imageWidth = browserHeight * imageWidth / imageHeight;
				imageHeight = browserHeight;
				marginLeft = (browserWidth - imageWidth) / 2;
			} else {
				imageHeight = browserWidth * imageHeight / imageWidth;
				imageWidth = browserWidth;
				marginTop = (browserHeight - imageHeight) / 2;
			}
		}

		parent.width(browserWidth).height(browserHeight).css('overflow', 'hidden');
		image.attr('width', imageWidth).attr('height', imageHeight).css('margin', marginTop + 'px 0px 0px ' + marginLeft + 'px');
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
			return;
		}
		return;
	};

	// export the constructor function to the global namespace
	window.Gallery = gallery;
}(jQuery, Modernizr, window));