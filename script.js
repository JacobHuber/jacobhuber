let moving = false;
function toggleDropdown() {
	const dropdown = document.getElementById("dropdown");

	let v = dropdown.style.visibility;

	if (v == "visible") {
		closeDropdown();
	} else {
		openDropdown();
	}
}

function closeDropdown() {
	if (!moving) {
		moving = true;

		const dropdown = document.getElementById("dropdown");
		dropdown.style.visibility = "hidden";

		returnDropdown();
	}
}

function openDropdown() {
	if (!moving) {
		moving = true;

		const dropdown = document.getElementById("dropdown");
		dropdown.style.visibility = "visible";

		moveDropdown();
	}
}

const dropdown = document.getElementById("dropdown");
const burger = document.getElementById("hamburger");
const center_x = (document.body.clientWidth / 2) - (dropdown.clientWidth / 2);
const center_y = (document.body.clientHeight / 2);
const x_speed = center_x / 20;
const y_speed = (document.body.clientHeight / 2 - 68) / 20;
function moveDropdown() {
	let x = parseFloat(dropdown.style.left);
	let y = parseFloat(dropdown.style.top);

	if (isNaN(x)) {
		x = 0;
		y = 68;
	}

	if (x < center_x - x_speed) {
		const new_x = x_speed + x;
		const new_y = y_speed + y;
		dropdown.style.left = new_x + "px";
		dropdown.style.top = new_y + "px";

		burger.style.left = new_x + "px";
		burger.style.top = new_y - 68 + "px";
	

		setTimeout(moveDropdown, 20);
	} else {
		burger.style.left = center_x + "px"
		dropdown.style.left = center_x + "px";
		burger.style.top = center_y - 68 + "px";
		dropdown.style.top = center_y + "px";

		moving = false;
	}
}

function returnDropdown() {
	let x = parseFloat(dropdown.style.left);
	let y = parseFloat(dropdown.style.top);

	if (isNaN(x)) {
		x = 0;
		y = 70;
	}

	if (x > 0 + x_speed) {
		const new_x = x - x_speed;
		const new_y = y - y_speed;
		dropdown.style.left = new_x + "px";
		dropdown.style.top = new_y + "px";

		burger.style.left = new_x + "px";
		burger.style.top = new_y - 68 + "px";

	
		setTimeout(returnDropdown, 20);
	} else {
		burger.style.left = "0px"
		dropdown.style.left = "0px";
		burger.style.top = "0px";
		dropdown.style.top = "68px";

		moving = false;
	}
}