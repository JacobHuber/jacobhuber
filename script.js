function load() {
	let boxes = document.getElementsByClassName("box");

	for (let i = 0; i < boxes.length; i++) {
		boxes[i].onclick = function() {
			toggleBox(boxes[i]);
		}
	}
}

function toggleBox(box) {
	let boxes = document.getElementsByClassName("box");
	if (box.className == "box active") {
		for (let i = 0; i < boxes.length; i++) {
			boxes[i].className = "box";
		}
		box.children[0].style.display = "none";
		box.children[0].className = "text";
	} else {
		for (let i = 0; i < boxes.length; i++) {
			if (boxes[i] != box) {
				boxes[i].className = "box off";
			}
			box.className = "box active";
			window.setTimeout(function() { box.children[0].style.display = "inherit";}, 500);
			window.setTimeout(function() { box.children[0].className = "text active";}, 550);

		}
	}
}

window.onload = function() {
	load();
}