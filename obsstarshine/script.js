var width = 1920;
var height = 1080;
var starNum = 100;

// Checks whether or not the star should be brightening
starBrightening = [];

// Create starNum stars
for (var i = 0; i < starNum; i++) {
	// Set the star's coordinates at a random location
	var x = Math.floor(Math.random() * width);
	var y = Math.floor(Math.random() * height);
	// Give the star a random starting opacity
	var startOpacity = Math.random();
	// Give the star a random size
	var size = 10 + Math.floor(Math.random() * 11);
	// Add the star inside the wrapper
	document.getElementById("wrapper").innerHTML += "<img src='star.png' class='star' style='opacity: " + startOpacity + ";' />";
	// Apply the style randomized above
	document.getElementsByClassName("star")[i].style.left = x + "px";
	document.getElementsByClassName("star")[i].style.top = y + "px";
	document.getElementsByClassName("star")[i].style.maxWidth = size + "px";
	// By default, the star always starts by brightening (this may be randomized in the future, too)
	starBrightening[i] = true;
}

// Save the class "star" to a variable to make referring to it easier
var stars = document.getElementsByClassName("star");
// Start an interval to continuously roll the animation
var interval = setInterval(function() {
	for (var i = 0; i < stars.length; i++) {
		// Randomize the amount of opacity the star gains or loses
		var increment = 0.01 + Math.random() * 0.05;
		if (!starBrightening[i]) increment *= -1;
		var opacity = parseFloat(stars[i].style.opacity) + increment;
		// Change whether the star is brightening or dimming based on the reached opacity
		if (opacity >= 1) starBrightening[i] = false;
		else if (opacity <= 0) starBrightening[i] = true;
		// Apply the opacity
		stars[i].style.opacity = opacity;
	}
}, 25);
