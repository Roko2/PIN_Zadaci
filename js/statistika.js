var sUrl = window.location.href ;
var oUrl = new URL(sUrl);
var sKorisnik = oUrl.searchParams.get("korisnik_id");
var korisnici=[];
var statusi=[];
$(document).ready(function(){
  DohvatiKorisnike();
  DohvatiStatus();
  Statistika();
oDbKorisnici.once('value', function(oOdgovorPosluzitelja)
{
  var oTrenutniKorisnik = $('#korisnik');
  var oTrenutniKorisnik2 = $('#korisnikTrenutni');
  oOdgovorPosluzitelja.forEach(function(oLoginSnapshot)
  {
    var oLogin = oLoginSnapshot.val();
  if(oLogin.korisnik_id==sKorisnik){
    var sRow = '<div>' + oLogin.Ime+" "+oLogin.Prezime +'</div>';
     oTrenutniKorisnik.find('#ImePrezime').append(sRow);
     oTrenutniKorisnik2.find('button').append(sRow);
   }
   });
  });
});

function DohvatiKorisnike(){
  oDbKorisnici.on('value', function(oOdgovorPosluzitelja)
  {
    oOdgovorPosluzitelja.forEach(function(oKorisnikSnapshot)
    {
      var oKorisnik = oKorisnikSnapshot.val();
      const korisnik = new Korisnik(oKorisnik.Ime,oKorisnik.Prezime,oKorisnik.korisnik_id);
      korisnici.push(korisnik);
     });
    });
}

function DohvatiStatus(){
oDbStatusiZadataka.on('value', function(oOdgovorPosluzitelja)
{
  oOdgovorPosluzitelja.forEach(function(oStatusSnapshot)
  {
    var oStatus = oStatusSnapshot.val();
    const zadatak = new Status(oStatus.id_zadatka,oStatus.status);
    statusi.push(zadatak);
   });
  });
}

  function GoToKorisnici(){
    var url = "Korisnici.html?korisnik_id=" +encodeURIComponent(sKorisnik);
      window.location.href = url;
  }
  function IstaStranica(){
    var url = "index.html?korisnik_id=" +encodeURIComponent(sKorisnik);
      window.location.href = url;
  }
  function Odjava(){
    var url = "pocetna.html";
      window.location.href = url;
  }

  function Statistika(){
    oDbZadaci.on('value',function(sOdgovorFirebase) {
    var rijeseni=$('#statistikaRijesenih');
    var nerijeseni=$('#statistikaNeRijesenih');
    var zadano=$('#zadano');
    var primljeno=$('#primljeno');
    var brojacRijesenih=0;
    var brojacNeRijesenih=0;
    var rijesenost=0;
    var neRijesenih=0;
    var Zadano=0;
    zadano.find('#ukupnoZadano').empty();
    rijeseni.find('#zeleniPalac').empty();
    nerijeseni.find('#crveniPalac').empty();
    primljeno.find('#ukupnoPrimljeno').empty();
    var brojZadataka=statusi.length;
      sOdgovorFirebase.forEach(function(oZadatakSnapshot)
    {
    var oZadatak = oZadatakSnapshot.val();
    var oZadatakKey=oZadatakSnapshot.key;
 
    oDbKorisnici.on('value',function(){
    korisnici.forEach(function(x) {
    if(x.id==oZadatak.korisnikRjesavatelj_id && oZadatak.korisnikRjesavatelj_id==sKorisnik){
      brojacRijesenih++;
      oDbStatusiZadataka.on('value',function() {
        statusi.forEach(function(y){
          if(y.id==oZadatakKey && y.status=="true"){
            rijesenost++;
          }
        })
      });
    }
    if(x.id==oZadatak.korisnikVlasnik_id && oZadatak.korisnikVlasnik_id==sKorisnik){
      Zadano++;
    }
    if(x.id==oZadatak.korisnikRjesavatelj_id && oZadatak.korisnikRjesavatelj_id==sKorisnik){
      brojacNeRijesenih++;
      oDbStatusiZadataka.on('value',function() {
       
        statusi.forEach(function(y){
          if(y.id==oZadatakKey && y.status=="false"){
            neRijesenih++;
          }
        })
      });
    }
  });
  });
  });
  console.log(rijesenost+' '+neRijesenih);
  if(rijesenost==0){
    var rezultatRijeseni='<span>Nema zadataka</span>';
  }
  else{
    var rezultatRijeseni='<i class="fas fa-thumbs-up fa-2x"></i><span class="ml-2">'+ ((rijesenost/brojacRijesenih)*100).toFixed(2) +'%</span>';

  }
  if(neRijesenih==0){
    var rezultatNeRijeseni='<span>Nema zadataka</span>';
  }
  else{
    var rezultatNeRijeseni='<i class="fas fa-thumbs-down fa-2x"></i><span class="ml-2">'+ ((neRijesenih/brojacRijesenih)*100).toFixed(2) +'%</span>';
  }
   var ukupnoZadano='<i class="fas fa-file fa-2x"></i><span class="ml-2">'+Zadano +'/'+ brojZadataka+'</span>';
   var ukupnoPrimljeno='<i class="fas fa-file fa-2x"></i><span class="ml-2">'+brojacRijesenih +'/'+ brojZadataka+'</span>';
   rijeseni.find('#zeleniPalac').append(rezultatRijeseni);
   nerijeseni.find('#crveniPalac').append(rezultatNeRijeseni);
   zadano.find('#ukupnoZadano').append(ukupnoZadano);
   primljeno.find('#ukupnoPrimljeno').append(ukupnoPrimljeno);
});

}