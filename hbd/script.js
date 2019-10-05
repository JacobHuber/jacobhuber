// Source
// https://stackoverflow.com/questions/14766951/convert-digits-into-words-with-javascript
var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

function inWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
    return str;
}

let counter = 1

function showCard() {
	const outside = document.getElementById("outside");
	outside.style.visibility = "visible";

	const card = document.getElementById("card");
	card.innerHTML = drawCard();
}

function closeCard() {
	const outside = document.getElementById("outside");
	outside.style.visibility = "hidden";
}



function drawCard() {
	let card = "Spencer takes " + inWords(counter) + " (" + counter + ") drink"
	if (counter > 1) {
		card += "s";
	}

	counter += 1;
	
	return card;
}