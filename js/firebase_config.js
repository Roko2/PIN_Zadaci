var firebaseConfig = {
    apiKey: "AIzaSyBE-iWA5w7wRBypPn24Tc_UZ3yRdWOhKkA",
    authDomain: "zadaci.firebaseapp.com",
    databaseURL: "https://zadaci-default-rtdb.firebaseio.com",
    projectId: "zadaci",
    storageBucket: "zadaci.appspot.com",
    messagingSenderId: "864228294191",
    appId: "1:864228294191:web:3fdd4419936de5a2a590da",
    measurementId: "G-7YF4RT5W72"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

var oDb = firebase.database(); //kompletna baza
var oDbZadaci = oDb.ref('zadaci/zadaci'); //čvor zadataka
var oDbKorisnici = oDb.ref('korisnici/korisnici');
var oDbStatusiZadataka = oDb.ref('statusZadataka/statusZadataka');
var oDbNapomene=oDb.ref('napomene/napomene');

