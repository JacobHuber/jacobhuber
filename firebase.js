// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDwKgTWy93ihZFbvZenllIyAxdFbkuC8pE",
    authDomain: "jacobhuber-82523.firebaseapp.com",
    databaseURL: "https://jacobhuber-82523.firebaseio.com",
    projectId: "jacobhuber-82523",
    storageBucket: "",
    messagingSenderId: "499683958888",
    appId: "1:499683958888:web:0ebd7705e256d673"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
});

var uid = null;
var loaded = false;
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