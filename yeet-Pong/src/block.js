class Block {
	constructor(rect, game) {
		this.rect = rect;
		this.game = game;

		this.destroyed = false;

		this.colour = "#FFF";
		this.decay = {
			speed: 10,
			amount: 0.5,
			colour: "#F50"
		};

		let halfSpeed = this.decay.speed / 2;
		this.vel = {
			x: Math.random() * this.decay.speed - halfSpeed,
			y: Math.random() * this.decay.speed - halfSpeed
		};
	}

	destroy(ball) {
		const index = this.game.collidables.indexOf(this);
		this.game.collidables.splice(index, 1);

		this.destroyed = true;
		let hue = 150 - (ball.speed * 10);
		if (hue < 0) hue += 360;
		this.colour = "HSL(" + hue.toString() + ",100%,50%)";
	}

	delete() {
		const index = this.game.gameObjects.indexOf(this);
		this.game.gameObjects.splice(index, 1);
	}

	update() {
		if (this.destroyed) {
			if (this.rect.w > 0) {
				this.rect.w -= this.decay.amount;
				this.rect.h -= this.decay.amount;

				this.rect.x += this.vel.x;
				this.rect.y += this.vel.y;
			} else {
				this.delete();
			}
		}
	}

	drawUnder(ctx) {
		if (!this.destroyed) {
			const shadowOffset = 10;
			ctx.fillStyle = "HSL(" + this.game.bgHue + ",100%," + (this.game.bgLightness - 2) + "%)";
			ctx.fillRect(this.rect.x, this.rect.y, this.rect.w + shadowOffset, this.rect.h + shadowOffset);

			const borderOffset = 6;
			ctx.fillStyle = "black";
			ctx.fillRect(this.rect.x - borderOffset, this.rect.y - borderOffset, this.rect.w + borderOffset * 2, this.rect.h + borderOffset * 2);
		}
	}

	draw(ctx) {
		if (!this.destroyed) {
			

			ctx.fillStyle = this.colour;
			ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
		}
	
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.colour;
		ctx.strokeRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
	}
}