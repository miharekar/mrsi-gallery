function gallery()
{
	this.init = init;
	this.setImages = setImages;
	this.toggleSize = toggleSize;
	this.next = next;
	this.previous = previous;
	this.changeTo = changeTo;
	this.setTransitionTime = setTransitionTime;
	
	var isTerribleBrowser = false;
	var emptyDiv = '<div class="background new"></div>';
	var running = false;
	var current = 0;
	var transitionTime = 1000;
	var images = new Array();
	var imagesMax = 0;
	
	function init(images)
	{
		detectTerribleBrowser();
		$('body').append('<div class="background new" style="display: none;"></div><img id="hiddenImg"/><div id="loading"></div>');
		setImages(images);
		fadeInFirstImage();
		setKeyboardShortcuts();
	}
	
	function setImages(json)
	{
		images = json;
		imagesMax = images.length - 1;
		current = 0;
	}
	
	function setTransitionTime(time)
	{
		transitionTime = time;
	}
	
	function toggleSize()
	{
		if (!running && !isTerribleBrowser)
		{
			running = true;
			var type = ($('.background').css('background-size') === 'cover') ? 'contain' : 'cover';
			$('.background').fadeOut('', function()
			{
				$(this)
					.css('-webkit-background-size', type)
					.css('-moz-background-size', type)
					.css('-o-background-size', type)
					.css('background-size', type)
					.fadeIn('', function()
					{
						running = false;
					});
			});
			return true;
		}
		return false;
	}
	
	function next()
	{
		current = (current === imagesMax) ? 0 : current + 1;
		return changeImage();
	}
	
	function previous()
	{
		current = (current === 0) ? imagesMax : current - 1;
		return changeImage();
	}
	
	function changeTo(number)
	{
		if (number <= imagesMax && number >= 0 && number != current)
		{
			current = number;
			return changeImage();
		}
		return false;
	}

	function detectTerribleBrowser()
	{
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
		{
			isTerribleBrowser = Number(RegExp.$1) < 9;
		}
	}
	
	function fadeInFirstImage()
	{
		$('#hiddenImg')
			.attr('src', images[current])
			.load(function()
			{
				addBackgroundImage(images[current]);
				$('.new').fadeIn(transitionTime);
			});	
	}
	
	function addBackgroundImage(image)
	{
		if (isTerribleBrowser)
		{
			var filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image + "', sizingMethod='scale')";
			$('.new').css('filter', filter);
			$('.new').css('-ms-filter', '"' + filter + '"');
		}
		else
		{
			$('.new').css('background-image', "url('" + image + "')");
		}
	}
	
	function changeImage()
	{
		if (!running)
		{
			running = true;
			$('#loading').show();
			$('.new').addClass('old').removeClass('new');
			$('body').append(emptyDiv);
			$('#hiddenImg')
				.attr('src', images[current])
				.load(function()
				{
					addBackgroundImage(images[current]);
					$('#loading').hide();
					$('.old').fadeOut(transitionTime, function()
					{
						$(this).remove()
						running = false;
					});
				});
			return true;
		}
		return false;
	}
	
	function setKeyboardShortcuts()
	{
		$(document.documentElement).keyup(function (e)
		{
			if (!running)
			{
				if (e.keyCode == 39 || e.keyCode == 38) next();
				if (e.keyCode == 37 || e.keyCode == 40) previous();
			}
		});
	}
}