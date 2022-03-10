class Button {
	constructor(rect, text, callback) {
		this.rect = rect;
		this.callback = callback;
		this.text = text;
		this.hover = false;
	}

	click() {
		this.hover = false;
		this.callback();
	}

	update() {

	}

	draw(ctx) {
		ctx.strokeStyle = "white";
		ctx.lineWidth = 4;
		ctx.strokeRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

		if (this.hover) {
			ctx.fillStyle = "#EEE";
			ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

			ctx.fillStyle = "black";
			const fontSize = 40;
			ctx.font = fontSize + "px impact";
			ctx.textAlign = "center";

			ctx.fillText(this.text, this.rect.x + this.rect.w / 2 - 4, this.rect.y + this.rect.h / 2 + fontSize / 3 - 4);
			ctx.fillText(this.text, this.rect.x + this.rect.w / 2 + 4, this.rect.y + this.rect.h / 2 + fontSize / 3 + 4);
		}

		ctx.fillStyle = "white";
		const fontSize = 40;
		ctx.font = fontSize + "px impact";
		ctx.textAlign = "center";
		ctx.fillText(this.text, this.rect.x + this.rect.w / 2, this.rect.y + this.rect.h / 2 + fontSize / 3);
	}
}