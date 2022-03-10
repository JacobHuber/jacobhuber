class Player {
	constructor(game) {
		this.game = game;

		this.rect = {
			x: this.game.ctx.canvas.width / 2,
			y: this.game.ctx.canvas.height - 80,
			w: 80,
			h: 10
		}

		this.charge = 0;

		this.speed = 12;
		this.x_speed = 0;
		this.momentum = 1;
		this.useTilt = false;
		this.tiltDeadzone = 2;

		this.keys = {};

		this.cheat = false;
	}

	keydown(event) {
		switch (event.key) {
			case "a":
			case "ArrowLeft":
				this.keys["left"] = true;
				break;
			case "d":
			case "ArrowRight":
				this.keys["right"] = true;
				break;
			default:
				break;
		}
	}

	keyup(event) {
		switch (event.key) {
			case "a":
			case "ArrowLeft":
				this.keys["left"] = false;
				break;
			case "d":
			case "ArrowRight":
				this.keys["right"] = false;
				break;
			default:
				break;
		}
	}

	tilt(event) {
		if (event.gamma != null) {
			this.useTilt = true;
			this.speed = Math.abs(event.gamma);

			this.keys["right"] = event.gamma > this.tiltDeadzone;
			this.keys["left"] = event.gamma < -this.tiltDeadzone;
		}
	}

	inside_walls(speed) {
		const wallLeft = 0;
		const wallRight = this.game.ctx.canvas.width;
		const paddleLeft = this.rect.x + speed;
		const paddleRight = this.rect.x + this.rect.w + speed;

		const insideRight = paddleRight < wallRight;
		const insideLeft = paddleLeft > wallLeft;
		return (insideRight && insideLeft);
	}

	update() {
		if (this.cheat) {
			const dist = ((this.game.ctx.canvas.height - 80) - this.game.balls[0].rect.y);
			const dx = Math.cos(this.game.balls[0].angle*Math.PI/180) * dist;

			this.rect.x = this.game.balls[0].rect.x + dx - this.rect.w / 2;
		}

		const left = this.keys["left"];
		const right = this.keys["right"];

		if ( (!left && !right) || (left && right) ) {
			this.x_speed = this.x_speed * 0.9;
		} else if (left) {
			if (this.useTilt) {
				this.x_speed = -this.speed;
			} else {
				if (this.x_speed > -this.speed) {
					this.x_speed -= this.momentum;
				} else {
					this.x_speed = -this.speed;
				}
			}
		} else if (right) {
			if (this.useTilt) {
				this.x_speed = this.speed;
			} else {
				if (this.x_speed < this.speed) {
					this.x_speed += this.momentum;
				} else {
					this.x_speed = this.speed;
				}
			}
		}
		


		if (this.inside_walls(this.x_speed)) {
			this.rect.x += this.x_speed;
		} else {
			this.x_speed = 0;

			const rightWall = this.game.ctx.canvas.width;
			if (this.rect.x > rightWall / 2) {
				this.rect.x = rightWall - this.rect.w;
			} else {
				this.rect.x = 0;
			}
		}
		
		if (this.charge >= 10) {
			this.charge -= 10;

			this.rect.w *= 1.05;
		}

		this.game.collidables[0] = this;
	}

	draw(ctx) {
		ctx.strokeStyle = "white";
		ctx.lineWidth = 3;
		ctx.strokeRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

		
		ctx.fillStyle = "white";
		const percent = ( (this.charge) / 10 );
		ctx.fillRect(this.rect.x, this.rect.y, this.rect.w * percent, this.rect.h);
		

		const fontSize = 20;
		ctx.font = fontSize + "px impact";
		ctx.textAlign = "center";
		ctx.fillText(this.game.score, this.rect.x + this.rect.w / 2, this.rect.y + this.rect.h + fontSize + 10);
	}
}