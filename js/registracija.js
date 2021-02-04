$(document).ready(function(){
  document.querySelector(".unosBroja").addEventListener("keypress", function (evt) {
    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
  });
  
  $('.date').datepicker({
    language: "hr",
    format: "d.m.yyyy",
    endDate: "today",
    startDate: '-120y',
    autoclose: true
  });
  $("#btnRegistracija").click(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    ProvjeriUnose();
  });
});

const ime = document.getElementById('inputIme');
const prezime = document.getElementById('inputPrezime');
const mail = document.getElementById('inptEmail');
const lozinka = document.getElementById('password');
const korisnickoIme = document.getElementById('uname');
const datumRodjenja = document.getElementById('inputDatum');
const oib = document.getElementById('inputOIB');
function ProvjeriUnose(){
  var valid=true;
  const imeValue = ime.value.trim(); //trim--micanje razmaka
	const prezimeValue = prezime.value.trim();
	const emailValue = mail.value.trim();
  const lozinkaValue = lozinka.value.trim();
  const korisnickoImeValue = korisnickoIme.value.trim();
  const oibValue = oib.value.trim();
  const datumRodjenjaValue=datumRodjenja.value.trim();
  if(imeValue === '') {
    PostaviGresku(ime, 'Ime ne može biti prazno');
    valid=false;
  } 
  
  else if(ime.value[0] != ime.value[0].toUpperCase()){
    PostaviGresku(ime,'Ime ne može počinjati prvim velikim slovom');
    valid=false;
  }
  //regex g-globalno i-case sensitive, u0161\u0111\u010D\u0107\u017E  hrvatska slova č,ć,š,đ,ž,/t brojevi
  else if(!(/^[a-z\u0161\u0111\u010D\u0107\u017E ]+$/gi.test(imeValue))){
    PostaviGresku(ime,'Ime ne može sadržavati znakove ili brojeve');
    valid=false;
  }
  else {
		PostaviValjano(ime);
  }
  
	if(prezimeValue === '') {
    PostaviGresku(prezime, 'Prezime ne može biti prazno');
    valid=false;
  } 
  else if(!(/^[a-z\u0161\u0111\u010D\u0107\u017E]+$/gi.test(prezimeValue))){
    PostaviGresku(prezime,'Prezime ne može sadržavati znakove ili brojeve');
    valid=false;
  }
  else if(prezime.value[0] != prezime.value[0].toUpperCase()){
    PostaviGresku(prezime,'Prezime ne može počinjati prvim velikim slovom');
    valid=false;
  }
  else {
		PostaviValjano(prezime);
  }
  
  if(oibValue===''){
    PostaviGresku(oib,'Oib ne može biti prazan');
    valid=false;
  }
  else if(oibValue.length!=11){
    PostaviGresku(oib,'Oib mora imati 11 znamenaka');
    valid=false;
  }
  else{
      oDbKorisnici.once('value',function(sOdogovorPosluzitelja){
        var oibValja=false;
        sOdogovorPosluzitelja.forEach(function(oKorisnikSnap){
          var korisnik=oKorisnikSnap.val();
          if(korisnik.OIB==oibValue){
            oibValja=true;
          }
        });
        if(oibValja==false){
          PostaviValjano(oib);
          }
          else{
            PostaviGresku(oib,'Oib već postoji');
            valid=false;
          }
      });
  }
  if(datumRodjenjaValue===''){
    PostaviGresku(datumRodjenja,'Datum rođenja ne može biti prazan');
    valid=false;
  }
  else{
    PostaviValjano(datumRodjenja);
  }

  if(emailValue===''){
    PostaviGresku(mail,'Email adresa ne može biti prazna');
    valid=false;
  }
  else if (!valjaniMail(emailValue)){
    PostaviGresku(mail,'Format email adrese nije valjan');
    valid=false;
  }
  else{
    oDbKorisnici.once('value',function(sOdogovorPosluzitelja){
      var postoji=false;
      sOdogovorPosluzitelja.forEach(function(oKorisnikSnap){
        var korisnik=oKorisnikSnap.val();
        if(korisnik.Email_adresa==emailValue){
          postoji=true;
        }
      });
      if(postoji==false){
        PostaviValjano(mail);
        }
        else{
          PostaviGresku(mail,'Email adresa već postoji');
          valid=false;
        }
    });
  }
  if(korisnickoImeValue==''){
    PostaviGresku(korisnickoIme,'Korisničko ime ne može biti prazno');
    valid=false;
  }
  else{
    PostaviValjano(korisnickoIme);
  }
  if(lozinkaValue==''){
    PostaviGresku(lozinka,'Lozinka ne može biti prazna');
    valid=false;
  }
  else if(lozinkaValue.length<8){
    PostaviGresku(lozinka,'Lozinka mora imati minimalno 8 znakova, brojeva ili slova');
    valid=false;
  }
  else{
    PostaviValjano(lozinka);
  }
  if(valid==true){
    Registracija();
  }
}

 function PostaviGresku(element,poruka){
   const formGrupa=element.parentElement;
   const tekst=formGrupa.querySelector('small');
   formGrupa.className='form-group error';
   tekst.innerText=poruka;
 }
 function PostaviValjano(poruka) {
	const formGrupa = poruka.parentElement;
	formGrupa.className = 'form-group success';
}

function Registracija(){
var broj;
  var sIme = $('#inputIme').val();
  var sPrezime = $('#inputPrezime').val();
  var sDatumRodjenja=$('#inputDatum').val();
  var sKorisnickoIme=$('#uname').val();
  var sEmail=$('#inptEmail').val();
  var sLozinka=$('#password').val();
  var odabir=document.querySelector('input[name="optradio"]:checked').value;
firebase.database().ref('korisnici/korisnici').once('value').then(function(snapshot) {
    for (key in snapshot.val()) { 
       broj=key;
    }
      var oKorisnik = 
    {
      Datum_rodjenja:sDatumRodjenja,
      Email_adresa:sEmail,
      Ime: sIme,
      Korisnicko_ime: sKorisnickoIme,
      Lozinka:sLozinka,
      Prezime: sPrezime,
      Spol:odabir,
      korisnik_id:parseInt(broj)+2,
    };
    var oZapis = {};
    oZapis[parseInt(broj)+1] = oKorisnik;
    oDbKorisnici.update(oZapis);
    var url = "index.html?korisnik_id=" +encodeURIComponent(parseInt(broj)+2);
    window.location.href = url;
 });
 }
 function valjaniMail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}
