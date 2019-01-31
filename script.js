var mx = 0;
var my = 0;
var diffX = 0;
var diffY = 0;
var doDrag = false;

window.onload = function() {
	window.addEventListener("mousemove", function(event) {
		mx = event.clientX;
		my = event.clientY;
	});
}



function moveOffPage(div, the_speed_that_will_be_used_that_is_passed_as_an_argument_to_this_function) {
	let y = div.getBoundingClientRect().top;

	if (y > -350) {	
		y += 95 + the_speed_that_will_be_used_that_is_passed_as_an_argument_to_this_function;
		//console.log(x);
		div.style.top = y + "px";
		setTimeout(function() {
			moveOffPage(div, the_speed_that_will_be_used_that_is_passed_as_an_argument_to_this_function-1);
		}, 15);
	} else {
		div.remove();
		// DELETE THE div
	}
}

function dragStart(div) {
	var rect = div.getBoundingClientRect();
	var centerX = (rect.left + rect.right)/2;
	var centerY = (rect.top + rect.bottom)/2;

	diffX = mx - centerX;
	diffY = my - centerY;

	doDrag = true;
	drag(div);
}

function drag(div) {
	if (doDrag) {
		div.style.left = mx - diffX + "px";
		div.style.top = my - diffY + "px";
		setTimeout(function() { drag(div); }, 1);
	}
}

function dragEnd() {
	doDrag = false;
}