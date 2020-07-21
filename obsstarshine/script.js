var width = 1920;
var height = 1080;
var starNum = 100;

starBrightening = [];

for (var i = 0; i < starNum; i++) {
	var x = Math.floor(Math.random() * width);
	var y = Math.floor(Math.random() * height);
	var startOpacity = Math.random();
	var size = 10 + Math.floor(Math.random() * 11);
	document.getElementById("wrapper").innerHTML += "<img src='star.png' class='star' style='opacity: " + startOpacity + ";' />";
	document.getElementsByClassName("star")[i].style.left = x + "px";
	document.getElementsByClassName("star")[i].style.top = y + "px";
	document.getElementsByClassName("star")[i].style.maxWidth = size + "px";
	starBrightening[i] = true;
}

var stars = document.getElementsByClassName("star");
var interval = setInterval(function() {
	for (var i = 0; i < stars.length; i++) {
		var increment = 0.01 + Math.random() * 0.05;
		if (!starBrightening[i]) increment *= -1;
		var opacity = parseFloat(stars[i].style.opacity) + increment;
		if (opacity >= 1) starBrightening[i] = false;
		else if (opacity <= 0) starBrightening[i] = true;
		stars[i].style.opacity = opacity;
	}
}, 50);
