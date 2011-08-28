mrsi gallery
=============

mrsi gallery is a simple full screen background image gallery that uses CSS3 background-size attribute instead of JavaScript for completely filling up the browser window with images.

Browser Support
-------

It works in most modern browsers ([reference](http://www.w3schools.com/cssref/css3_pr_background-size.asp)) and it even (somewhat) works with IE < 9 but then it switches to filter attributes.

Why?
-------

I needed something like that for my new website ([WIP](http://mr.si/index2.php)) and I didn't find anything like it so I made this from scratch.

How far are we?
-------

It's still very much work in progress so any ideas / bug reports /suggestions are highly welcomed and appreciated.

Demo
-------

The demo is available in the folder demo (download and try localy) or online at: http://mr.si/index2.php

Requirements
-------

* jQuery

Example usage
-------
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script src="js/gallery.js"></script>
<script>
$(function() {
	//init the mrsi gallery
	//all parameters are optional, but you should at least define the images if you want something to show :P
	//images: the array of images to display
	//shuffle: boolean - depending on if you want to display images in random order or not
	//transitionTime: integer - sets for how long the transition between images last on image change
	//type: string - either 'cover' or 'contain' - gallery.toggleType toggles between them
	//keyboardShortcuts: boolean - if you want arrow keys to change images set to true
	var options = {
		images: ["images/image1.jpg", "images/image2.jpg", "images/image3.jpg"], //array of paths to images
		shuffle: true,
		transitionTime: 500,
		type: 'cover',
		keyboardShortcuts: true
	};
	var myGallery = new gallery(options);
	
	//set menu controls
	$('#toggle').click(function(){
		myGallery.toggleType();
	});
	$('#previous').click(function(){
		myGallery.previous();
	});
	$('#next').click(function(){
		myGallery.next();
	});
	
	//you can also change the images array if you plan to have multiple galleries	
	var options2 = {
		images: ["images2/image1.jpg", "images2/image2.jpg", "images2/image3.jpg"], //array of paths to images in gallery2
		shuffle: false
	};
	myGallery.setNewImages(options2);
});
</script>
```