class Game {
	constructor(ctx) {
		this.word = "yeet";
		this.ctx = ctx;
		this.reset();

		this.sounds = {
			points: [new Audio("sound/hit1.wav"), new Audio("sound/hit2.wav"), new Audio("sound/hit3.wav"), new Audio("sound/hit4.wav")]
		}

		this.sounds.points.forEach((s) => {
			s.load();
			s.volume = 0.4;
		});


		this.clickables = [];
		// 0 = Menu, 1 = Game
		this.gameState = 0;		



		const playButton = new Button(
			{
				x: this.ctx.canvas.width / 2 - 80,
				y: this.ctx.canvas.height / 4,
				w: 160,
				h: 80
			},
			"yeet",
			() => {
				this.gameState = 1;
			}
		);

		this.clickables.push(playButton);

		window.addEventListener("keydown", (event) => {this.player.keydown(event)} );
		window.addEventListener("keyup", (event) => {this.player.keyup(event)} );
		window.addEventListener("deviceorientation", (event) => {this.player.tilt(event)} );


		this.mobile = false;
		this.ctx.canvas.ontouchstart = (event) => {
			this.mobile = true;

			const mouse = {
				x: parseInt(event.touches[0].clientX),
				y: parseInt(event.touches[0].clientY)
			};
			

			this.moveEvent(mouse);
		}

		this.ctx.canvas.ontouchend = (event) => {
			const mouse = {
				x: parseInt(event.changedTouches[0].clientX),
				y: parseInt(event.changedTouches[0].clientY)
			};
			
			this.moveEvent(mouse);
			this.clickEvent(mouse);
		}

		this.ctx.canvas.onmousemove = (event) => {
			const mouse = {
				x: event.offsetX,
				y: event.offsetY
			};

			if (!this.mobile) {
				this.moveEvent(mouse);
			}
		}

		this.ctx.canvas.onmousedown = (event) => {
			const mouse = {
				x: event.offsetX,
				y: event.offsetY
			};

			if (!this.mobile) {
				this.clickEvent(mouse);
			}
		}
	}

	reset() {
		this.score = 0;
		this.balls = [];
		this.ballCount = 1;
		for (let i = 0; i < this.ballCount; i++) {
			this.spawnBall();
		}
		this.player = new Player(this);

		this.bgLightnessMin = 4;
		this.bgLightness = this.bgLightnessMin;
		this.bgHue = 0;
		this.colour = "HSL(0,100%,50%)";

		this.streak = 0;
		this.streakTimer = 0;

		// reference to collidable objects
		this.collidables = [this.player];
		this.level = new Level(this.word, this);
		this.collidables = this.collidables.concat(this.level.blocks);

		this.gameObjects = [];
		this.gameObjects = this.gameObjects.concat(this.level.blocks);
	}

	moveEvent(pos) {
		this.clickables.forEach((c) => {
			if (c.rect.x < pos.x && c.rect.x + c.rect.w > pos.x
				&& c.rect.y < pos.y && c.rect.y + c.rect.h > pos.y) {
					document.body.style.cursor = "pointer";
					c.hover = true;
			} else {
				document.body.style.cursor = "default";
				c.hover = false;
			}
		});
	}

	clickEvent(pos) {
		this.clickables.forEach((c) => {
			if (c.rect.x < pos.x && c.rect.x + c.rect.w > pos.x) {
				if (c.rect.y < pos.y && c.rect.y + c.rect.h > pos.y) {
					c.click();
				}
			}
		});
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
		if (this.bgLightness > this.bgLightnessMin) {
			this.bgLightness -= 2;
		} else {
			this.bgLightness = this.bgLightnessMin;
		}

		if (this.streakTimer > 0) {
			this.streakTimer -= 1;
		} else {
			this.streak = 0;
		}

		if (this.gameState == 0) {
			this.clickables.forEach((c) => {
				c.update();
			});
			
			return;
		}

		this.player.update();

		this.balls.forEach((ball) => {
			ball.update();
		});

		this.gameObjects.forEach((c) => {
			c.update();
		});

		
		if (this.balls.length == 0) {
			this.gameState = 0;
			this.reset();
		}
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
		this.colour = "HSL(" + this.bgHue + ",100%," + this.bgLightness + "%)";
		this.ctx.fillStyle = this.colour;//"#" + colour + "0000";//colour + colour;
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		if (this.gameState == 0) {
			this.clickables.forEach((c) => {
				c.draw(this.ctx);
			});

			return;
		}

		this.balls.forEach((ball) => {
			ball.drawUnder(this.ctx);
		});

		this.balls.forEach((ball) => {
			ball.draw(this.ctx);
		});

		this.player.drawUnder(this.ctx);
		this.player.draw(this.ctx);
		
		this.gameObjects.forEach((c) => {
			c.drawUnder(this.ctx);
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