class Game {
	constructor(ctx) {
		const word = "yeet";
		this.ctx = ctx;

		this.score = 0;
		this.balls = [];
		this.ballCount = 1;
		for (let i = 0; i < this.ballCount; i++) {
			this.spawnBall();
		}
		this.player = new Player(this);

		this.bgLightness = 0;
		this.bgHue = 0;

		this.sounds = {
			points: [new Audio("sound/hit1.wav"), new Audio("sound/hit2.wav"), new Audio("sound/hit3.wav"), new Audio("sound/hit4.wav")]
		}

		this.sounds.points.forEach((s) => {
			s.load();
			s.volume = 0.4;
		})

		this.streak = 0;
		this.streakTimer = 0;

		// reference to collidable objects
		this.collidables = [this.player];
		this.level = new Level(word, this);
		this.collidables = this.collidables.concat(this.level.blocks);

		this.gameObjects = [];
		this.gameObjects = this.gameObjects.concat(this.level.blocks);

		window.addEventListener("keydown", this.player.keydown.bind(this.player))
		window.addEventListener("keyup", this.player.keyup.bind(this.player));

		window.addEventListener("deviceorientation", this.player.tilt.bind(this.player));
	}

	spawnBall(pos=null) {
		if (pos == null) {
			pos = {
				x: this.ctx.canvas.width / 2,
				y: this.ctx.canvas.height / 2
			}
		}

		this.balls.push(new Ball(this, pos));

	}

	update() {
		this.player.update();

		this.balls.forEach((ball) => {
			ball.update();
		});

		this.gameObjects.forEach((c) => {
			c.update();
		});

		if (this.bgLightness > 2) {
			this.bgLightness -= 2;
		} else {
			this.bgLightness = 2;
		}

		if (this.streakTimer > 0) {
			this.streakTimer -= 1;
		} else {
			this.streak = 0;
		}

		/*
		if (this.ball.y > window.innerHeight) {
			return false;
		} else {
			return true;
		}*/
	}

	flash() {
		this.bgLightness += 10;
		if (this.bgLightness > 50) {
			this.bgLightness = 50;
		}	
	}

	changeColour() {
		this.bgHue = Math.random() * 360;
	}

	draw() {
		// Set background
		let colour = this.bgLightness.toString(16).padStart(2, "0");
		const hsl = "HSL(" + this.bgHue + ",100%," + this.bgLightness + "%)";
		this.ctx.fillStyle = hsl;//"#" + colour + "0000";//colour + colour;
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		this.player.draw(this.ctx);

		this.balls.forEach((ball) => {
			ball.draw(this.ctx);
		});
		
		this.gameObjects.forEach((c) => {
			c.draw(this.ctx);
		});
	}

	addScore() {
		this.score += 1;

		this.player.charge += 1;

		this.flash();

		let i = this.streak % this.sounds.points.length;
		if (Math.floor(this.streak / this.sounds.points.length) % 2 == 1) {
			i = this.sounds.points.length - 1 - (this.streak % 4);
		}
		this.sounds.points[i].currentTime = 0;
		this.sounds.points[i].play();
		
		this.streak += 1;
		this.streakTimer = 100;
	}
}