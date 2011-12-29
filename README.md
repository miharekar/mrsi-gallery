mrsi-gallery
=============

mrsi-gallery is a is a full-screen image gallery that takes advantage of the modern browser technologies. It uses CSS3 background-size and transition attributes when available and when not it fallbacks to JavaScript.

Browser Support
-------

It works super fast in most modern browsers - that being browsers that support CSS3 [bg-size](http://www.w3schools.com/cssref/css3_pr_background-size.asp) and [transition](http://www.w3schools.com/cssref/css3_pr_transition.asp)) attributes. When there is no such browser support, the script fallbacks to JS which is a bit slower, but still reasonably fast. It should work in every possible browser that supports JS. That's right, it even works on the good old IE 6 :D

Why?
-------

I needed full-screen gallery for my new website ([WIP](http://mr.si/index2.php)) but I didn't find any that uses CSS3 background-size attribute so I made mrsi-gallery.

Is it production ready?
-------

It is (should be? :D). Any and all ideas / bug reports / suggestions are still highly welcomed and appreciated.

Demo
-------

You can:
* download the project and try it locally - just open the "index.html" in the "demo" folder
* test it on my work in progress website at: http://mr.si/index2.php

Requirements
-------

* jQuery 1.4.3+
* Modernizr [minimum](http://www.modernizr.com/download/#-backgroundsize-csstransitions-iepp-prefixed-testprop-testallprops-domprefixes)

Example usage
-------
```html
<link rel="stylesheet" href="css/style.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="js/modernizr.js"></script>
<script src="js/gallery.min.js"></script>
<script>
$(function() {
	//init the mrsi-gallery
	//all parameters are optional, but you should at least define the images if you want something to show :P
	//images: the array of images to display
	//shuffle: boolean - depending on if you want to display images in random order or not
	//transitionTime: integer - sets for how long the transition between images last on image change
	//type: string - either 'cover' or 'contain' - gallery.toggleType toggles between them
	//cssTransitions: boolean - if you have transtions in CSS and want to use that. It gives it major performance boost.
	var options = {
		images: ["images/image1.jpg", "images/image2.jpg", "images/image3.jpg"], //array of paths to images
		shuffle: false,
		transitionTime: 1000,
		type: 'cover',
		cssTransitions: false
	};
	var myGallery = new Gallery(options);
	
	//set menu controls
	$('#toggle').on('click', function(){
		myGallery.toggleType();
	});
	$('#previous').on('click', function(){
		myGallery.previous();
	});
	$('#next').on('click', function(){
		myGallery.next();
	});
	
	//you can also change the images array if you plan to have multiple galleries	
	var options2 = {
		images: ["images2/image1.jpg", "images2/image2.jpg", "images2/image3.jpg"], //array of paths to images in second gallery
		shuffle: false
	};
	myGallery.setNewImages(options2);
	
	//set keyboard shortcuts
	$(window.document.documentElement).on('keyup', function (e) {
		if (!myGallery.running) {
			if (e.keyCode === 39 || e.keyCode === 38) {
				myGallery.next();
			}
			
			if (e.keyCode === 37 || e.keyCode === 40) {
				myGallery.previous();
			}
		}
	});
});
</script>
```