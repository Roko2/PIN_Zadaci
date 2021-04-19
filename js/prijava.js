
var inputLozinka = document.getElementById("inptLozinka");
var inputEmail=document.getElementById("inptEmail");
inputLozinka.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("gumbPrijava").click();
  }
});
inputEmail.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("gumbPrijava").click();
  }
});

function Prijava(){
  oDbKorisnici.once('value', function(oOdgovorPosluzitelja)
{
  var valid=true;
  var Email=$("#inptEmail").val();
  var Lozinka=$("#inptLozinka").val();
  const mail = document.getElementById('inptEmail');
const lozinka = document.getElementById('inptLozinka');
  oOdgovorPosluzitelja.forEach(function(oLoginSnapshot)
  {
    var sLoginKey = oLoginSnapshot.key;
    var oLogin = oLoginSnapshot.val();
    if(Email!=oLogin.Email_adresa || Lozinka!=oLogin.Lozinka){
      valid=false;
    }
  if(Email==oLogin.Email_adresa && Lozinka==oLogin.Lozinka){
    PostaviValjano(mail);
    PostaviValjano(lozinka);
    var url = "index.html?korisnik_id=" +encodeURIComponent(oLogin.korisnik_id);
    window.location.href = url;
   }
   });
   if(valid==false){
    PostaviGresku(lozinka);
    PostaviGresku(mail);
     }
  });
}
function ZaboravljenaLozinka(){
  var email=$("#inptEmail").val();
  var nepostojeci=false;
  if(email==''){
    alert("Upišite email adresu");
  }
  else{
  oDbKorisnici.once('value',function(sOdogovorPosluzitelja){
    sOdogovorPosluzitelja.forEach(function(oKorisnikSnapshot){
      var oKorisnik=oKorisnikSnapshot.val();
      if(oKorisnik.Email_adresa==email){
        nepostojeci=true;
      }
    });
    if(nepostojeci==true){
      $("#inptEmailRecover").val($('#inptEmail').val());
      $("#klik").click();
    }
    if(nepostojeci==false){
      alert("Email koji ste upisali ne postoji, ako nemate račun registrirajte se.");
    }
  });
}
}

function Slanje(){
  if ( $('#validacija')[0].checkValidity() ) 
  {
    var mail=$("#inptEmailRecover").val();
    alert("Lozinka je poslana na e-mail adresu "+mail);
 }
  } 

  function PostaviGresku(element){
    const formGrupa=element.parentElement;
    const tekst=formGrupa.querySelector('small');
    formGrupa.className='form-group error';
  }
  function PostaviValjano(poruka) {
   const formGrupa = poruka.parentElement;
   formGrupa.className = 'form-group success';
 }