function createMessage(content, response) {
	const message = document.createElement("div");
	message.className = "message";

	const messageContent = document.createElement("div");
	messageContent.className = "content";
	messageContent.innerHTML = content;

	const messageResponse = document.createElement("div");
	messageResponse.className = "response";
	messageResponse.innerHTML = response;

	message.appendChild(messageContent);
	message.appendChild(messageResponse);

	const messages = document.getElementById("messages");
	//messages.appendChild(message);
	//console.log(messages.childNodes);

	// Places message at the top of the message board
	messages.insertBefore(message, messages.childNodes[2]);
}

function loadMessages() {
	database.ref("/messages").once("value")
	.then(function(dataSnapshot) {
		const messages = dataSnapshot.toJSON();

		for (key in messages) {
			const content = messages[key]["Content"];
			const response = messages[key]["Response"];

			if (response != "") {
				createMessage(content, response);
			}
		}
	});
}

function sendMessage() {
	const textarea = document.getElementById("textarea");
	const content = textarea.value;

	if (content.length > 0 && content.length < 250) {
		textarea.value = "";

		const messagesRef = database.ref("/messages");
		
		const newMessageRef = messagesRef.push();
		newMessageRef.key = name;
		newMessageRef.set({
		  "Content": content,
		  "Response": ""
		});

		alert("Message sent binch (yo I swear I'm gonna make this alert box better later lmao)");
	}
}

function bodyLoad() {
	loadMessages();
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        // var isAnonymous = user.isAnonymous;
        var uid = user.uid;

        let stateCheck = setInterval(() => {
            if (document.readyState === 'complete') {
                clearInterval(stateCheck);

                bodyLoad();
            }
        }, 100);

    } else {
        // User is signed out.
        // console.log("Not logged in.");
    }
});