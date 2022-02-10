const GUESS_LENGTH = 5;
const MAX_GUESSES = 6;

let current_options = [];
let current_guess = "";

let guess_count = 0;

const boxClass = ["grey", "yellow", "green"];
const boxParity = {
	"grey" : 0,
	"yellow" : 1,
	"green" : 2
};

function newGuess() {
	current_options = word_list;
}

function fetchGuessParity() {
	const tds = [...document.getElementById("guessTable").children];
	let guess_parity = [];

	for (let i = 0; i < tds.length; i++) {
		guess_parity.push([ tds[i].innerHTML, boxParity[tds[i].className] ]);
	}

	return guess_parity;
}

/*
* if the word is "apple"
* and the guess is "altar"
* guess_parity = [ ["a", 2], ["l", 1], ["t", 0], ["a", 0], ["r", 0] ]
*/
function pruneChoices(guess_parity) {
	const greens = [];
	const yellows = [];
	const greys = [];

	guess_parity.forEach((pair, i) => {
		const letter = pair[0];

		const order = [letter,i];
		if (pair[1] == 1) yellows.push(order);
		else if (pair[1] == 2) greens.push(order);
		else greys.push(letter)
	});

	let pruned_options = [];

	current_options.forEach(word => {
		let use_word = true;

		for (let i = 0; i < greys.length; i++) {
			const letter = greys[i];

			if (word.includes(letter)) {
				use_word = false;
				break;
			}
		}

		if (use_word) {
			for (let i = 0; i < greens.length; i++) {
				const letter = greens[i][0];
				const index = greens[i][1];

				if (!word.includes(letter) || !(word.charAt(index) == letter)) {
					use_word = false;
					break;
				}
			}
		}

		if (use_word) {
			for (let i = 0; i < yellows.length; i++) {
				const letter = yellows[i][0];
				const index = yellows[i][1];	

				if (!word.includes(letter) || (word.charAt(index) == letter)) {
					use_word = false;
					break;
				}
			}
		}

		if (use_word) pruned_options.push(word);
	});


	current_options = pruned_options;
}

function addLetter(letter) {
	if (current_guess.length < GUESS_LENGTH) {
		current_guess += letter;
	}

	updateDOM();
}

function removeLetter() {
	if (current_guess.length > 0)
		current_guess = current_guess.slice(0, current_guess.length - 1);

	updateDOM();
}

function updateDOM() {
	updateGuessTableDOM();
	updateAnswerDOM();
}

function updateGuessTableDOM() {
	const guessTable = document.getElementById("guessTable");

	if (!guessTable) return;

	const tds = [...guessTable.children];

	for (let i = 0; i < current_guess.length; i++) {
		tds[i].innerHTML = current_guess.charAt(i);
	}

	for (let i = current_guess.length; i < GUESS_LENGTH; i++) {
		tds[i].innerHTML = "";
	}
}

function updateAnswerDOM() {
	const spanAmount = document.getElementById("answerListSize");
	spanAmount.innerHTML = current_options.length;

	const divAnswers = document.getElementById("answers");
	let formatted = current_options.join(", ")
	answers.innerHTML = formatted;
}

function showAnswers() {
	const divAnswers = document.getElementById("answers");
	const toggle = document.getElementsByClassName("special")[0].children[0];

	if (divAnswers.style.display == "initial") {
		divAnswers.style.display = "none";
		toggle.className = "toggleOff";
	} else {
		divAnswers.style.display = "initial";
		toggle.className = "toggleOn";
	}
}

function cycleParity(element) {
	const curr = element.className;

	element.className = boxClass[(boxClass.indexOf(curr) + 1) % boxClass.length];
}

function pressEnter() {
	if (current_guess.length != GUESS_LENGTH) return;
	
	guess_count++;
	if (guess_count >= MAX_GUESSES) return;


	const guess_parity = fetchGuessParity();
	pruneChoices(guess_parity);

	document.getElementById("guessTable").removeAttribute("id");

	createTable();
	current_guess = "";

	updateDOM();
}

document.addEventListener("keydown", function(event) {
	const key = event.key.toLowerCase();

	if (key.match(/[a-z]/) && key.length == 1) {
		addLetter(key);
	} else if (key == "backspace") {
		removeLetter();
	} else if (key == "enter") {
		pressEnter();
	}
});

function createTable() {
	const table = document.createElement("table");
	table.id = "guessTable";

	for (let i = 0; i < GUESS_LENGTH; i++) {
		const td = document.createElement("td");
		td.className = "grey";
		td.addEventListener("click", function() {
			cycleParity(this);
		});

		table.appendChild(td);
	}

	document.body.appendChild(table);
}


window.onload = function() {
	createTable();
	newGuess();
	updateDOM();
}