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
    //var errorCode = error.code;
    //var errorMessage = error.message;
});