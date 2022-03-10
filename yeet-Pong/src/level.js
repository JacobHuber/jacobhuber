class Level {
	constructor(word, game) {
		this.word = word;
		this.game = game;

		this.width = game.ctx.canvas.width;
		this.height = game.ctx.canvas.height;
		this.char_size = 8; // Do not touch?
		this.margin = this.char_size * 2;
		this.spacing = this.char_size + 2
		this.block_size = this.width / (this.spacing* this.word.length + this.margin);

		this.blocks = [];

		this.generate();
	}

	generate() {
		for (let i = 0; i < this.word.length; i++) {
			const start_x = (this.width/2 - this.word.length/2 * this.spacing * this.block_size) + i*this.spacing * this.block_size;
			const start_y = (this.height / this.char_size);
			
			for (let y = 0; y < 8; y++) {
				for (let x = 0; x < 8; x++) {
					if (letters[this.word[i]][y][x] == "1") {
						const rect = {
							x: start_x + x * this.block_size,
							y: start_y + y * this.block_size,
							w: this.block_size,
							h: this.block_size
						};
						
						this.blocks.push(new Block(rect, this.game));
					}
				}
			}
		}
	}
}