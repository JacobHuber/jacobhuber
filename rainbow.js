const rainbowText = document.getElementsByClassName("rainbow-text");
const rainbowBG = document.getElementsByClassName("rainbow-bg");
const hamburger = document.getElementsByTagName("rect");

let hue = 0;

const timer = window.setInterval(function() {

	hue = (hue + 1) % 360;

	for (let i = 0; i < rainbowText.length; i++) {
		rainbowText[i].style.color = "hsl(" + hue + ", 100%, 50%)";
	}

	for (let i = 0; i < rainbowBG.length; i++) {
		rainbowBG[i].style.backgroundColor = "hsl(" + hue + ", 100%, 50%)";
	}

	for (let i = 0; i < hamburger.length; i++) {
		hamburger[i].style.stroke = "hsl(" + hue + ", 100%, 50%)";
	}
}, 50);