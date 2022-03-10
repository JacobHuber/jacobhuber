class Main {
	constructor() {
		this.canvas = document.getElementById("gameCanvas");
		this.ctx = this.canvas.getContext("2d");
		this.game = new Game(this.ctx);

		// State refers to which screen to show
		// 0 = menu, 1 = game
		this.state = 0;
		this.states = [this.game];
	}

	update() {
		this.states[this.state].update();
		this.draw();
	}

	draw() {
		this.states[this.state].draw(this.ctx);
	}
}

window.addEventListener('resize', callbackWindowSize);

function callbackWindowSize() {
	const canvas = document.getElementById("gameCanvas");

	canvas.height = window.innerHeight;
	if (window.innerWidth > window.innerHeight) {
		// Landscape
		canvas.width = Math.max(window.innerWidth * 0.4, 640);
	}  else {
		// Portrait
		canvas.width = window.innerWidth;
	}
}


let gameTick;
document.addEventListener("DOMContentLoaded", (event) => {
	callbackWindowSize();

	setup();
});

let gameDriver;
function setup() {
	gameDriver = new Main();
	gameTick = window.setInterval(function() {
		gameDriver.update();
	}, 15);
}