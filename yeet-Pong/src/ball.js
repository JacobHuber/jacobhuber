class Ball {
	constructor(game, pos) {
		this.game = game;

		this.sound = new Audio("sound/drum.wav");

		this.sound.load()
		this.sound.volume = 0.8;

		this.size = 12;
		this.rect = {
			x: pos.x,
			y: pos.y,
			w: this.size,
			h: this.size
		};

		this.speedStart = 6;
		this.speed = 0;
		this.angle = 0;
		this.vel = {
			x: 0,
			y: 0
		}
		this.stop = false;

		this.timeStop = false;


		this.trail = [];
		this.trailMaxStart = 5;
		this.trailMax = 5;

		this.reset();
	}

	reset() {
		this.angle = Math.random()*30 + 30;
		const left = Math.random() < 0.5;
		if (left) {
			this.angle += 90;
		}
		
		this.speed = this.speedStart;

		this.update_velocity();

		this.collision = {
			col: false,
			ver: false
		};
	}

	update_velocity() {
		this.vel.x = Math.cos(this.angle*Math.PI/180) * this.speed;
		this.vel.y = Math.sin(this.angle*Math.PI/180) * -this.speed;
	}

	bounce(up) {
		if (up) {
			var opposite = 360 - this.angle;
			this.angle = opposite;
		} else {
			this.angle = 180 - this.angle;
		}

		if (this.angle > 360) this.angle -= 360;
		if (this.angle < 0) this.angle += 360;

		this.speed *= 1.005;
		this.update_velocity();

		this.sound.currentTime = 0;
		this.sound.play();
		this.game.changeColour();

		navigator.vibrate(100);

		//console.log(this.trailMax);

		// 13 so that background isn't too bright.
		/*
		var r = (Math.random()*13).toString(16);
		var g = (Math.random()*13).toString(16);
		var b = (Math.random()*13).toString(16);
		document.body.style.backgroundColor = "#"+r[0]+g[0]+b[0];
		*/
	}

	collide_borders(x, y) {
		const left = 0;
		const right = this.game.ctx.canvas.width;
		const top = 0;

		const outsideLeft = x <= 0;
		const outsideRight = x >= this.game.ctx.canvas.width;
		const outsideTop = y <= 0;

		if (outsideLeft) {
			this.bounce(false);
			this.rect.x = left;
		} else if (outsideRight) {
			this.bounce(false);
			this.rect.x = right;
		} else if (outsideTop) {
			this.bounce(true);
			this.rect.y = top;
		}
	}

	collide_line(x3, y3, x4, y4, verbose=false) {
		const x = this.rect.x;
		const y = this.rect.y;
		const w = this.rect.w;
		const h = this.rect.h;

		const corners = [x, y, x+w, y, x, y+h, x+w, y+h];

		let collide = false;
		for (let i = 0; i < 4; i++) {
			const x1 = corners[i * 2];
			const y1 = corners[i * 2 + 1];
			const x2 = x1 + this.vel.x;
			const y2 = y1 + this.vel.y;
			
			// http://www.jeffreythompson.org/collision-detection/line-line.php
			const magnitude = ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
			
			const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / magnitude;
			const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / magnitude;

			if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
				collide = true;
				break;
			}
		}

		return collide;
	}

	collide_rect_lines(x, y, rect, ver, verbose=false) {
		const c_top = this.collide_line(rect.x, rect.y, rect.x + rect.w, rect.y, verbose);
		const c_left = this.collide_line(rect.x, rect.y, rect.x, rect.y + rect.h, verbose);
		const c_bottom = this.collide_line(rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h, verbose);
		const c_right = this.collide_line(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h, verbose);

		if (ver) {
			return c_top || c_bottom;
		} else {
			return c_left || c_right;
		}
	}

	collide_rect(x, y, rect) {
		const points = [
			{x: x, y: y},
			{x: x + this.rect.w, y: y},
			{x: x, y: y + this.rect.h},
			{x: x + this.rect.w, y: y + this.rect.h}
		];

		for (let i = 0; i < points.length; i++) {
			const p = points[i];

			if (p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h) {
				return true;
			}
		}

		return false;
	}

	collide() {
		const new_x = this.rect.x + this.vel.x;
		const new_y = this.rect.y + this.vel.y;
		this.collision = {
			col: false,
			ver: false
		};

		// Bounce on walls
		this.collide_borders(new_x, new_y);

		for (let i = 0; i < this.game.collidables.length; i++) {
			const block = this.game.collidables[i];

			if (this.collide_rect(new_x, this.rect.y, block.rect)) {
				this.collision.col = true;
			} else if (this.collide_rect(this.rect.x, new_y, block.rect)) {
				this.collision.col = true;
				this.collision.ver = true;
			}

			if (!this.collision.col) {
				if (this.collide_rect_lines(new_x, new_y, block.rect, true)) {
					this.collision.col = true;
					this.collision.ver = true;
				} else if (this.collide_rect_lines(new_x, new_y, block.rect, false)) {
					this.collision.col = true;
				}
			}

			if (this.collision.col) {
				this.bounce(this.collision.ver);
				if (block.constructor.name == "Block") {
					block.destroy(this);
					
					this.game.addScore();
					this.game.flash();
				}


				break;
			}
		}
	}

	update() {
		this.collide();

		this.rect.x += this.vel.x;
		this.rect.y += this.vel.y;

		this.trailMax = this.trailMaxStart + Math.floor(this.speed - this.speedStart);
		if (this.speed > this.rect.w) {
			let sx = this.rect.x - this.vel.x;
			let sy = this.rect.y - this.vel.y;

			for (let d = 0; d < this.speed; d += this.rect.w) {
				const ratio = (d / this.speed)
				const dx = ratio * this.vel.x;
				const dy = ratio * this.vel.y;
				this.trail.unshift({
					x: sx + dx,
					y: sy + dy
				});
			}
		} else {
			this.trail.unshift({
				x: this.rect.x,
				y: this.rect.y
			});
		}
		while (this.trail.length > this.trailMax) {
			this.trail.pop();
		}

		if (this.rect.y >= this.game.ctx.canvas.height + 50) {
			const index = this.game.balls.indexOf(this);
			this.game.balls.splice(index, 1);
		}

		/*
		if (!this.timeStop) {
			if (this.rect.y <= this.game.ctx.canvas.height - 80) {
				this.collide();

				this.rect.x += this.vel.x;
				this.rect.y += this.vel.y;
			} else {
				for (let i = 0; i < 1; i++) {
					if (this.collision.col) {
						console.log("Collided");
					}

					let new_x = this.rect.x + this.vel.x;
					let new_y = this.rect.y + this.vel.y;

					if (this.collide_rect_lines(new_x, new_y, this.game.player.rect, true, true)) {
						console.log("After ???????");
					}
					//this.speed /= 1.01;
					//this.update_velocity()
					this.rect.x -= this.vel.x;
					this.rect.y -= this.vel.y;
					//this.collide();

					new_x = this.rect.x + this.vel.x;
					new_y = this.rect.y + this.vel.y;
					if (this.collide_rect_lines(new_x, new_y, this.game.player.rect, true, true)) {
						console.log("Before ???????");
					}
				}

				this.timeStop = true;
			}
		}
		*/

		//this.collide_walls();
		//this.collide_paddle();
	}

	drawUnder(ctx) {
		ctx.fillStyle = "HSL(" + this.game.bgHue + ",100%," + (this.game.bgLightness + 20) + "%)";
		ctx.lineWidth = 2;
		//ctx.moveTo(this.rect.x, this.rect.y);
		for (let i = 0; i < this.trail.length; i++) {
			const ratio = (this.rect.w / 2) / this.trail.length;
			const size = (30 + this.trail.length - 1 - i) * ratio;
			const p = this.trail[i];

			const amount = 5;
			const dx = ((Math.random() * amount) - amount/2) * (i / this.trail.length + 0.5);
			const dy = ((Math.random() * amount) - amount/2) * (i / this.trail.length + 0.5);

			//ctx.lineTo(p.x, p.y);
			ctx.beginPath()
			ctx.ellipse(p.x + dx, p.y + dy, size, size, 0, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
		}
	}

	draw(ctx) {
		ctx.fillStyle = "HSL(" + this.game.bgHue + ",100%,50%)";//"#F00";
		ctx.strokeStyle = "#FFF";
		ctx.lineWidth = 2;
		//ctx.moveTo(this.rect.x, this.rect.y);
		for (let i = 0; i < this.trail.length; i++) {
			const ratio = (this.rect.w / 2) / this.trail.length;
			const size = (this.trail.length - 1 - i) * ratio;
			const p = this.trail[i];

			const amount = 20;
			const dx = ((Math.random() * amount) - amount/2) * (i / this.trail.length);
			const dy = ((Math.random() * amount) - amount/2) * (i / this.trail.length);

			//ctx.lineTo(p.x, p.y);
			ctx.beginPath()
			ctx.ellipse(p.x + dx, p.y + dy, size, size, 0, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}


		ctx.fillStyle = "white";
		ctx.strokeStyle = "#000";
		//ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

		/*
		ctx.beginPath()
		ctx.ellipse(this.rect.x, this.rect.y, this.rect.w / 2, this.rect.h / 2, 0, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		*/


		/*
		ctx.strokeStyle = "red";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.rect.x, this.rect.y);
		ctx.lineTo(this.rect.x + this.vel.x, this.rect.y + this.vel.y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.rect.x + this.rect.w, this.rect.y);
		ctx.lineTo(this.rect.x + this.rect.w + this.vel.x, this.rect.y + this.vel.y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.rect.x, this.rect.y + this.rect.h);
		ctx.lineTo(this.rect.x + this.vel.x, this.rect.y + this.rect.h + this.vel.y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.rect.x + this.rect.w, this.rect.y + this.rect.h);
		ctx.lineTo(this.rect.x + this.rect.w + this.vel.x, this.rect.y + this.rect.h + this.vel.y);
		ctx.closePath();
		ctx.stroke();
		*/
	}
}