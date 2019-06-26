function Ball(game) {
	this.update_velocity = function() {
		this.x_speed = Math.cos(this.angle*Math.PI/180) * this.speed;
		this.y_speed = Math.sin(this.angle*Math.PI/180) * -this.speed;
	}

	this.reset = function() {
		this.angle = Math.random()*30 + 30;
		left = Math.random() < 0.5;
		if (left) {
			this.angle += 90;
		}
		
		this.speed = 6; //(Math.random()*8 + 4);

		this.update_velocity();

		//console.log(this.angle);

		this.x = window.innerWidth/2;
		this.y = window.innerHeight/2;
		this.div.style.left = this.x + "px";
		this.div.style.top = this.y + "px";
	}
	this.game = game;

	this.sound = new Audio("click.mp3"); // document.createElement("audio");
	this.sound.load()
	this.sound.volume = 0.4;
	//this.sound.style.display = "none";
	//document.body.appendChild(this.sound);

	this.div = document.createElement("div");
	this.div.id = "ball";
	document.body.appendChild(this.div);

	this.width = this.div.clientWidth;
	this.height = this.div.clientHeight;

	this.reset();

	this.update = function() {
		this.x += this.x_speed;
		this.y += this.y_speed;
		this.div.style.left = this.x - this.width/2 + "px";
		this.div.style.top = this.y - this.height/2 + "px";

		//this.collide_walls();
		//this.collide_paddle();
		this.collide();
	}

	this.bounce = function(up) {
		
		if (up) {
			var opposite = 360 - this.angle;
			this.angle = opposite;
		} else {
			this.angle = 180 - this.angle;
		}

		if (this.angle > 360) this.angle -= 360;
		if (this.angle < 0) this.angle += 360;

		this.speed *= 1.01;
		this.update_velocity();

		this.sound.currentTime = 0;
		this.sound.play();

		// 13 so that background isn't too bright.
		var r = (Math.random()*13).toString(16);
		var g = (Math.random()*13).toString(16);
		var b = (Math.random()*13).toString(16);
		document.body.style.backgroundColor = "#"+r[0]+g[0]+b[0];
	}

	this.collide_rect = function(x, y, rect) {
		return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
	}

	this.collide = function() {
		for (var i = 0; i < this.game.blocks.length; i++) {
			var block = this.game.blocks[i];
			if (this.collide_rect(this.x + this.width/2 + this.x_speed, this.y, block.rect) || this.collide_rect(this.x - this.width/2 + this.x_speed, this.y, block.rect) ) {
				this.bounce(false);
				if (block.constructor.name == "Block") block.destroy();
			} else if (this.collide_rect(this.x, this.y + this.height/2 + this.y_speed, block.rect) || this.collide_rect(this.x, this.y - this.height/2 + this.y_speed, block.rect)) {
				this.bounce(true);
				if (block.constructor.name == "Block") block.destroy();
			}
		}
	}
}

function Player(game) {
	this.x = window.innerWidth/2;
	this.y = window.innerHeight-80;

	this.div = document.createElement("div");
	this.div.id = "paddle";

	document.body.appendChild(this.div);
	this.rect = this.div.getBoundingClientRect();
	
	this.width = this.div.clientWidth;
	this.div.style.left = this.x - this.width/2 + "px";
	this.div.style.top = this.y + "px";

	this.speed = 12;
	this.x_speed = 0;
	this.momentum = 1;
	this.tilt = false;

	this.keys = {};

	this.game = game;

	this.keydown = function(event) {
		switch (event.key) {
			case "a":
			case "d":
			case "ArrowRight":
			case "ArrowLeft":
				this.keys[event.key] = true;
				break;
			default:
				break;
		}
		this.div.style.left = this.x - this.width/2 + "px";
	}

	this.keyup = function(event) {
		switch (event.key) {
			case "a":
			case "d":
			case "ArrowRight":
			case "ArrowLeft":
				this.keys[event.key] = false;
			default:
				break;
		}
	}

	this.tilt = function(event) {
		this.tilt = true;
		if (event.gamma != null) {
			this.momentum = Math.abs(event.gamma);
			if (event.gamma > 2) {
				this.keys["d"] = true;
				this.keys["a"] = false;
			} else if (event.gamma < -2) {
				this.keys["d"] = false;
				this.keys["a"] = true;
			} else {
				this.keys["d"] = false;
				this.keys["a"] = false;
			}
		}
	}

	this.collide_walls = function(speed) {
		return (this.x + this.width/2 + speed < window.innerWidth - 4 && this.x - this.width/2 + speed > 0);
	}

	this.update = function() {
		
		const left = this.keys["a"] || this.keys["ArrowLeft"];
		const right = this.keys["d"] || this.keys["ArrowRight"];

		if ( (!left && !right) || (left && right) ) {
			this.x_speed = this.x_speed * 0.9;
		} else if (left) {
			if (this.tilt) {
				this.x_speed = -this.speed;
			} else {
				if (this.x_speed > -this.speed) {
					this.x_speed -= this.momentum;
				} else {
					this.x_speed = -this.speed;
				}
			}
		} else if (right) {
			if (this.tilt) {
				this.x_speed = this.speed;
			} else {
				if (this.x_speed < this.speed) {
					this.x_speed += this.momentum;
				} else {
					this.x_speed = this.speed;
				}
			}
		}
		



		if (this.collide_walls(this.x_speed)) {
			this.x += this.x_speed;
		} else {
			this.x_speed = 0;

			if (this.x > window.innerWidth/2) {
				this.x = window.innerWidth - (this.width/2 + 4);
			} else {
				this.x = this.width/2;
			}
		}
		
		this.div.style.left = this.x - this.width/2 + "px";

		this.rect = this.div.getBoundingClientRect();
		this.game.blocks[0] = this;
	}
}

function Block(div, game) {
	this.div = div;
	this.game = game;
	this.rect = this.div.getBoundingClientRect();

	this.destroy = function() {
		var index = this.game.blocks.indexOf(this);
		//console.log(this.game.blocks[index]);
		this.game.blocks.splice(index, 1);
		this.div.remove();
	}
}

function Wall(rect) {
	this.rect = rect;
}

function Level(word, game) {
	var width = window.innerWidth;
	var char_size = 8; // Do not touch
	var margin = char_size * 2;
	var spacing = char_size + 2
	var block_size = width/(spacing*word.length + margin);

	var blocks = [];

	for (var i = 0; i < word.length; i++) {
		var left = (window.innerWidth/2 - word.length/2*spacing*block_size) + i*spacing * block_size;
		var top = (window.innerHeight/char_size);
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				if (letters[word[i]][y][x] == "1") {
					var div = document.createElement("div");
					div.className = "block";
					div.style.width = block_size + "px";
					div.style.height = block_size + "px";
					div.style.left = left + x*block_size;
					div.style.top = top + y*block_size;
					document.body.appendChild(div);
					blocks.push(new Block(div, game));
				}
			}
		}
	}

	return blocks;
}

function Game() {
	var word = "yeet";

	ball = new Ball(this);
	player = new Player(this);

	
	this.blocks = [player];
	this.blocks = this.blocks.concat(Level(word, this));
	this.blocks.push(new Wall(new DOMRect(-100, 0, 100, window.innerHeight)));
	this.blocks.push(new Wall(new DOMRect(window.innerWidth, 0, 100, window.innerHeight)));
	this.blocks.push(new Wall(new DOMRect(-100, -100, window.innerWidth+200, 100)));

	window.addEventListener("keydown", player.keydown.bind(player))
	window.addEventListener("keyup", player.keyup.bind(player));

	window.addEventListener("deviceorientation", player.tilt.bind(player));

	this.update = function() {
		ball.update();
		player.update();

		if (ball.y > window.innerHeight) {
			return false;
		} else {
			return true;
		}
	}
}

function Play() {
	var game = new Game();


	this.update = function() {
		if (!game.update()) {
			document.body.innerHTML = "";
			game = new Game();
		}
	}
}

function load() {
	var play = new Play();
	window.setInterval(play.update, 15);
}

window.onload = load;