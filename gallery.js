function gallery()
{
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
	
	function init(images, shuffle)
	{
		detectTerribleBrowser();
		$('body').append('<div class="background new" style="display: none;"></div><img id="hiddenImg"/><div id="loading"></div>');
		setImages(images, shuffle);
		fadeInFirstImage();
	}
	
	function setImages(json, shuffle)
	{
		if (shuffle)
		{
			json = randomizeArray(json);
		}
		images = json;
		imagesMax = images.length - 1;
		current = 0;
	}
	
	function toggleType()
	{
		if (!running && !isTerribleBrowser)
		{
			running = true;
			oldType = type;
			type = (type === 'cover') ? 'contain' : 'cover';
			$('.background').fadeOut('', function()
			{
				$(this).removeClass(oldType).addClass(type)
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
			$('.new').css('background-image', "url('" + image + "')").addClass(type);
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
	
	function randomizeArray(array)
	{
		var tmp, current, top = array.length;
		if (top) while(--top)
		{
			current = Math.floor(Math.random() * (top + 1));
			tmp = array[current];
			array[current] = array[top];
			array[top] = tmp;
		}
		return array;
	}
}