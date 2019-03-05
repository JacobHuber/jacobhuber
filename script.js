function load(page_name) {
	clearTable();
	fillTable(page_name);
}

function clearTable() {
	let table = document.getElementById("table-main");
	table.innerHTML = "<tr><th style='width: 30px'></th><th></th></tr>";
}

function fillTable(page_name) {
	let table = document.getElementById("table-main");

	let page = data[page_name];

	for (let i = 1; i < page['lines'] + 1; i++) {
		let row = document.createElement("tr");
		row.id = "line" + i;
		row.className = "table-line";


		let lineNumber = document.createElement("td");
		lineNumber.innerHTML = i;

		let text = document.createElement("td");
		text.className = "table-text";

		let dataText = page[row.id];
		if (dataText != null) {
			text.innerHTML = dataText;
		}

		row.appendChild(lineNumber);
		row.appendChild(text);


		table.appendChild(row);
	}
}