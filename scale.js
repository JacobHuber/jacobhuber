let paths = [];
let items = [];

function setup() {
	const silhouette = document.getElementById("silhouette");

	for (let i = 0; i < silhouette.children.length; i++) {
		const child = silhouette.children[i];
		if (child.nodeName != "defs") {
			paths.push(child);
		}
	}

	const content = document.getElementById("content");
	items.push(content);

	for (let i = 0; i < content.children.length; i++) {
		items.push(content.children[i]);
	}
}

setup();

function scale(coefficient) {
	const size = current_scale();
	const new_size = size * coefficient;

	set_scale(new_size);
}

function set_scale(size) {
	for (let i = 0; i < paths.length; i++) {
		const bbox = paths[0].getBBox();
		const center_x = bbox.x + bbox.width / 2;
		const center_y = bbox.y + bbox.height / 2;

		trans_x = (1 - size) * center_x;
		trans_y = (1 - size) * center_y;

		paths[i].setAttribute("transform", "translate(" + trans_x + ", " + trans_y + ") scale(" + size + ")");
	}
}

function current_scale() {
	let size = paths[0].getAttribute("transform");
	if (size == null) {
		size = "translate(0, 0) scale(1)";
	}
	size = size.slice(size.indexOf("scale") + 6); // 6 is length of "scale("
	size = parseFloat(size.slice(0, size.length - 1));

	return size;
}

let running = false;
function scale_up() {
	if (current_scale() < 100) {
		scale(1.1);
		setTimeout(scale_up, 5);
	} else {
		show_content();

		set_scale(100);
		running = false;
	}
}

function scale_down() {
	if (current_scale() > 1.1) {
		scale(0.9);
		setTimeout(scale_down, 5);
	} else {
		set_scale(1);
		hide_content();
		running = false;
	}
}

function fade_content() {
	for (let i = 0; i < items.length; i++) {
		items[i].style.opacity = "0";
	}
}

function hide_content() {
	for (let i = 0; i < items.length; i++) {
		items[i].style.visibility = "hidden";
	}
}

function show_content() {
	for (let i = 0; i < items.length; i++) {
		items[i].style.visibility = "visible";
		items[i].style.opacity = "1";
	}
}

function toggle_scale() {
	if (!running) {
		running = true;

		if (current_scale() == 1) {
			scale_up();
		} else {
			fade_content();
			setTimeout(scale_down, 350);
		}
	}
}