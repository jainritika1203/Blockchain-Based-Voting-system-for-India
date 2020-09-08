import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyD3dMyTLD2bb46NpXct9hXhP--FnpY1u5g",
    authDomain: "ind-viva.firebaseapp.com",
    databaseURL: "https://ind-viva.firebaseio.com",
    projectId: "ind-viva",
    storageBucket: "ind-viva.appspot.com",
    messagingSenderId: "12802079780",
    appId: "1:12802079780:web:5a8ab504556283fc852cb1",
    measurementId: "G-MCHHB6JCHJ"
};

firebase.initializeApp(firebaseConfig);
export default firebase;