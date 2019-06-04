
var bubbles = [];

Bubble = function(x,y,size) {
	this.x = x;
	this.y = y;
	this.div = document.createElement("div");
	this.div.style.backgroundColor = "#FFF";
	this.div.style.border = "solid 2px rgba(255,255,255,0.5)";
	this.size = size;
	//this.div.style.borderRadius = this.size+"px";
	this.div.style.width = this.size+"px";
	this.div.style.height = this.size+"px";
	this.div.style.position = "absolute";
	this.div.style.left = this.x;
	this.div.style.top = this.y;
	this.ySpeed = - (5 + Math.random()*5);
	this.xSpeed = Math.random()-0.5;

	
	bubbles[bubbles.length] = this;

	this.move = function() {
		this.y -= this.ySpeed;
		this.x += this.xSpeed;
		if (this.y >= document.body.clientHeight+50) {
			this.y = -50;
		}
		if (this.x <= -50) {
			this.x = document.body.clientWidth+50;
		} else if (this.x >= document.body.clientWidth+50) {
			this.x = -50;
		}
		this.div.style.top = this.y;
		this.div.style.left = this.x;
	}
}

var maxBubbles = 50;
for (var count = 1; count <= maxBubbles/2; count++) {
	var bubble = new Bubble(count*document.body.clientWidth/(maxBubbles/2), -(50 + Math.random()*1200), 2);
	document.body.appendChild(bubble.div);
}


function mainLoop() {
	for (var index = 0; index < bubbles.length; index++) {
		bubbles[index].move();
	}
}




function playSong() {
	const music = document.getElementById("music");
	music.src = "";

	setTimeout(function() {
		const music = document.getElementById("music");
		music.src = "song.mp3";
	}, 100);
}

let started = false;


function start() {
	if (!started) {
		started = true;

		const button = document.getElementById("startButton");
		button.style.opacity = 0;

		setTimeout(function() {
			button.remove();

			const interval = setInterval(mainLoop, 25);
			playSong();
		}, 1000);

	}
}