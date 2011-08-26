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
	var images = ["images/image1.jpg", "images/image2.jpg", "images/image3.jpg"]; //array of paths to images
	
	//init the mrsi gallery and set the images with shuffle parameter set to true
	var myGallery = new gallery({images: images, shuffle: true});
	
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

	//set keyboard shortcuts
	myGallery.setKeyboardShortcuts();
});
</script>
```