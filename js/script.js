
var sUrl = window.location.href ;
var oUrl = new URL(sUrl);
var sKorisnik = oUrl.searchParams.get("korisnik_id");
function LinkMojiZadaci(){
  var url = "MojiZadaci.html?korisnik_id=" +encodeURIComponent(sKorisnik);
    window.location.href = url;
}
function GoToKorisnici(){
  var url = "Korisnici.html?korisnik_id=" +encodeURIComponent(sKorisnik);
    window.location.href = url;
}
function IstaStranica(){
  var url = "index.html?korisnik_id=" +encodeURIComponent(sKorisnik);
    window.location.href = url;
}
   
 oDbKorisnici.once('value', function(oOdgovorPosluzitelja)
{
  var oTrenutniKorisnik = $('#korisnik');
  oOdgovorPosluzitelja.forEach(function(oLoginSnapshot)
  {
    var sLoginKey = oLoginSnapshot.key;
    var oLogin = oLoginSnapshot.val();
  if(oLogin.korisnik_id==sKorisnik){
    var sRow = '<div>' + oLogin.Ime+" "+oLogin.Prezime +'</div>';
     oTrenutniKorisnik.find('button').append(sRow);
   }
   });
  });

  function LinkStatistika(){
    var url = "statistika.html?korisnik_id=" +encodeURIComponent(sKorisnik);
      window.location.href = url;
  }
  function LinkZadaci(){
    var url = "ZadaciZaRijesiti.html?korisnik_id=" +encodeURIComponent(sKorisnik);
      window.location.href = url;
  }
  function Odjava(){
    var url = "pocetna.html";
      window.location.href = url;
  }
     
