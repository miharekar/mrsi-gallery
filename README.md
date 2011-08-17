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

The demo is (for now) available only at: http://mr.si/index2.php

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
	images = ["images/image1.jpg", "images/image2.jpg", "images/image3.jpg"]; //array of paths to images
	gallery = new gallery();
	gallery.init(images);
	$('#toggle').click(function(){
		gallery.toggleSize();
	});
	$('#previous').click(function(){
		gallery.previous();
	});
	$('#next').click(function(){
		gallery.next();
	});
});
</script>
```