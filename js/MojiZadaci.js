
var sUrl = window.location.href ;
var oUrl = new URL(sUrl);
var sKorisnik = oUrl.searchParams.get("korisnik_id");
statusZadataka=[];
korisnici=[];
noviStatusi=[];

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
    statusZadataka.push(zadatak);
   });
  });
}
$(document).ready(function(){
  Nacrtaj();
  ProvjeriZadatkeTablice();
  IspisiNapomene();
  DohvatiStatus();
  DohvatiKorisnike();
  TrenutniKorisnik();
  ListaRjesavatelja();
  $("#pretraga").on("keyup", function() {
     var value = $(this).val().toLowerCase();
     $("#tablica-zadaci .pretrazi").filter(function() {
       $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  klik();
  setTimeout(function(){
    ProvjeriTablicu();
    ProvjeriAccordion();
    ProvjeriNapomene();
  },1000);
  });

function klik(){
      setTimeout(function() {
            $('#blok').click();
    }, 1150);
    }
  
function ProvjeriTablicu(){
      var tablica=$('#tablica-zadaci');
  if ($('#tablica-zadaci tbody tr').length == 0){
    var sNoviRedak='<tr><td class="text-center" colspan="7">Nema zadataka</td></tr>';
    tablica.find('tbody').append(sNoviRedak);
 } 
    }

function ProvjeriAccordion(){
  var accordion=$('#accordion');
  if ($('.upis div').length == 0){
    var sNoviRedak='<strong class="text-white">Nema zadataka za rješavanje</strong>';
    $(".upis").addClass("accordionRjesavanje");
    accordion.find('.upis').append(sNoviRedak);
 } 
}

function ProvjeriNapomene(){
  var napomena=$("#napomene");
  if($('.upisNapomene').is(':empty')){
    var sNoviRedak='<strong>Nema napomena</strong>';
    $(".upisNapomene").addClass("sredinaNapomene");
    napomena.find('.upisNapomene').append(sNoviRedak);
 } 
}

function Obojaj(){
    oDbZadaci.on('value', function(oOdgovorPosluzitelja)
{
  oOdgovorPosluzitelja.forEach(function(oZadatakSnapshot)
  {
    var oZadatak = oZadatakSnapshot.val();
    var oZadatakKey = oZadatakSnapshot.key;
          oDbStatusiZadataka.on('value',function () {
            statusZadataka.forEach(function(x) {
              if(sKorisnik==oZadatak.korisnikRjesavatelj_id){
              if(x.id==oZadatakKey && x.status=="true"){
                  document.getElementById("btnObavljen"+oZadatakKey).disabled = true;
                   document.getElementById("btnProslijedi"+oZadatakKey).disabled = true; 
                  $('#cardHeader'+oZadatakKey).addClass("cardObavljeni");
                  document.getElementById("unosNapomene"+oZadatakKey).disabled = true;
                }
                if(x.id==oZadatakKey && x.status=="false"){
                   $('#cardHeader'+oZadatakKey).addClass("cardNeObavljeni");
                }
              }
            });
          });
   });
  });
  }

  function True(sZadatakKey){
    oDbZadaci.once('value', function(oOdgovorPosluzitelja)
{
  oOdgovorPosluzitelja.forEach(function(oZadatakSnapshot)
  {
    var oZadatak = oZadatakSnapshot.key;
    if(oZadatak == sZadatakKey){
      $('#cardHeader'+sZadatakKey).css("backgroundColor", "lightgreen"); 
      $('#unosNapomene'+sZadatakKey).css("pointer-events", "none"); 
      document.getElementById("btnObavljen"+sZadatakKey).disabled = true;
      document.getElementById("btnProslijedi"+sZadatakKey).disabled = true;
      oDbStatusiZadataka.on('value',function () {
        statusZadataka.forEach(function(x) {
          if(x.id==sZadatakKey){
            PromijeniStatusZadatka(sZadatakKey);
            $('#cardHeader'+sZadatakKey).removeClass("cardNeObavljeni");
          }
        });
      });
   }
   });
  });
  }
  
function Nacrtaj() {
oDbZadaci.on('value', function(oOdgovorPosluzitelja) 
{
  var oTablicaZadataka = $('#tablica-zadaci');
  var oAccordionRjesavanje=$('#accordion');
  oAccordionRjesavanje.find('.upis').empty();
	oTablicaZadataka.find('tbody').empty();
  var nRbr = 1;
  var nRbr2=1;
	oOdgovorPosluzitelja.forEach(function(oZadatakSnapshot)
	{
    var sZadatakKey=oZadatakSnapshot.key;
    var oZadatak = oZadatakSnapshot.val();
	oDbKorisnici.once('value', function(oOdgovorPosluzitelja)
{
  oOdgovorPosluzitelja.forEach(function(oKorisnikSnapshot)
  {
  var oKorisnik = oKorisnikSnapshot.val();
  if(sKorisnik==oKorisnik.korisnik_id){
    if(sKorisnik==oZadatak.korisnikVlasnik_id){ 
      oOdgovorPosluzitelja.forEach(function(oKorisnikSnap){
        var oRjesavatelj=oKorisnikSnap.val();
        if(oRjesavatelj.korisnik_id==oZadatak.korisnikRjesavatelj_id){
            var sRow = '<tr id="redak'+sZadatakKey+'" class="pretrazi"><td>' + nRbr++ + '.</td><td>' + oZadatak.zadatak_naziv + '</td><td>' + oZadatak.rok + '</td><td>'+oRjesavatelj.Ime+' '+oRjesavatelj.Prezime+'</td><td>'+oZadatak.komentar+'</td>'+
            '<td><button id="gumbAzuriraj'+sZadatakKey+'" type="button" onclick="ModalUrediZadatak('+sZadatakKey+')" class="btnTablica rounded my-auto"><i class="fa fa-refresh"></i></button></td>'+
            '<td><button id="Kliknuti" type="button" onclick="Potvrda('+sZadatakKey+')" data-toggle="modal" data-target="#modalObrisi" class="btnTablica rounded my-auto"><i class="fa fa-trash" aria-hidden="true"></i></button></td>'+
            '</tr>';
             oTablicaZadataka.find('tbody').append(sRow); 
        }
      }
      )};
      if(sKorisnik==oZadatak.korisnikRjesavatelj_id){
        oOdgovorPosluzitelja.forEach(function(oVlasnikSnap){
          var oVlasnik=oVlasnikSnap.val();
          if(oVlasnik.korisnik_id==oZadatak.korisnikVlasnik_id){
        var sRowRjesavanje = '<div class="card mx-auto">'+
                             '<div id="cardHeader'+sZadatakKey+'" data-toggle="collapse" href="#collapse'+nRbr2+'" class="card-header w-100 text-center text-dark">'+
                             '<div class="card-link d-inline">'+oZadatak.zadatak_naziv+'</div><small id="greska'+sZadatakKey+'" class="ml-1 nijeIstekao">Zadatku je istekao rok rješavanja</small><button id="btnProslijedi'+sZadatakKey+'" type="button" class="btn btn-primary pull-right mb-2" onclick="ModalShare('+sZadatakKey+')"><i class="fa fa-share text-blue" aria-hidden="true"></i></button>'+
                              '</div><div id="collapse'+nRbr2+'" class="collapse hide" data-parent="#accordion">'+
                              '<div id="zadaciRjesavanje" class="card-body">'+
                              '<ul><li>Rbr: ' + nRbr2++ + '.</li><li>Vlasnik: '+oVlasnik.Ime+' '+oVlasnik.Prezime +'</li><li id="krajZadatka'+sZadatakKey+'" value="'+oZadatak.rok+'">Rok: '+oZadatak.rok+'</li><li>Komentar: '+oZadatak.komentar+'</li><br>'+
                             '<textarea id="unosNapomene'+sZadatakKey+'" rows="2" placeholder="Napomena"></textarea></ul></div><center><button id="btnObavljen'+sZadatakKey+'" onclick="Obavi('+sZadatakKey+')" class="btn btn-success mb-1">Obavi</button></center></div></div>';
        oAccordionRjesavanje.find('.upis').append(sRowRjesavanje);
        try{
          ProvjeriRok(sZadatakKey);
          }catch{    
          }
        }
      }
        )};
  }
   });
  });
  });
});
 }
$('.date').datepicker({
  language: "hr",
  format: "d.m.yyyy",
  startDate: "today",
  endDate: '+5y',
  autoclose: true
});

function IspisiNapomene(){
  oDbNapomene.once('value',function(sOdgovorPosluzitelja){
    var oNapomena=$('#napomene');
    oNapomena.find(".upisNapomene").empty();
    sOdgovorPosluzitelja.forEach(function(oNapomenaSnapshot){
      var napomena=oNapomenaSnapshot.val();
       oDbZadaci.once('value',function(sOdgovor){
        sOdgovor.forEach(function(oZadaciSnap){
          var oZadatak=oZadaciSnap.val();
          var oZadatakKey=oZadaciSnap.key;
           if(sKorisnik==oZadatak.korisnikVlasnik_id && napomena.zadatak_id==oZadatakKey){
             oDbKorisnici.once('value',function(){
               korisnici.forEach(function(x){
                 if(x.id==oZadatak.korisnikRjesavatelj_id){
            var sRow='<ul><li><strong>Korisnik: </strong>'+x.ime+' '+x.prezime+'<br><strong>Zadatak: </strong>'+oZadatak.zadatak_naziv+'</li><strong>Datum objave</strong>: '+napomena.datum+'<br><strong>Napomena:</strong> '+napomena.opis+'</ul>';
            oNapomena.find(".upisNapomene").append(sRow);
                 }
          });
        });
           }
         });
       });
    });
  });
}

function ModalShare(sZadatakKey){
  $('#modalShare').modal('show');
  $('#proslijediZadatak').click(function () {
    ProslijediZadatak(sZadatakKey);
    ProvjeriAccordion();
 });  
}
function Napomene(sNapomenaKey){
  var sTekstNapomene=$('#unosNapomene'+sNapomenaKey).val();
  var danasnjiDatum=DajDanasnjiDatum();
  var oNapomenaTekst = 
  {
       datum:danasnjiDatum,
       opis:sTekstNapomene,
       zadatak_id:sNapomenaKey,
  };

  var oNapomena = {};
  oNapomena[sNapomenaKey] = oNapomenaTekst;
  oDbNapomene.update(oNapomena);
}

function ListaRjesavatelja(){
  oDbKorisnici.on('value', function()
{
  var listaMogucihRjesavatelja=$("#odabirRjesavateljaZadatka");
  var listaMogucihRjesavatelja2=$("#odabirRjesavateljaZadatka2");
  var listaMogucihRjesavatelja3=$("#odabirRjesavateljaZadatka3");
  
  listaMogucihRjesavatelja.find('#odabirRjesavatelja').empty();
  listaMogucihRjesavatelja2.find('#odabirRjes').empty();
  listaMogucihRjesavatelja3.find('#KorisnikRjesavatelj').empty();
  korisnici.forEach(function(x)
  {
    if(sKorisnik !=x.id){
      var Popis='<option  value="'+x.id +'">'+x.ime+' '+x.prezime+'</option>';
      listaMogucihRjesavatelja2.find("#odabirRjes").append(Popis); 
      listaMogucihRjesavatelja.find("#odabirRjesavatelja").append(Popis);  
      listaMogucihRjesavatelja3.find('#KorisnikRjesavatelj').append(Popis);
    }
});
});
}

function DajDanasnjiDatum() 
{
    var oDatum = new Date();
    var dd = oDatum.getDate();
    var M = oDatum.getMonth(); 
    var yyyy = oDatum.getFullYear(); 
    var sDatum = dd + "." + (M+1) + "." + yyyy;
    return sDatum;
}

function ProvjeriRok(sZadatakKey){
  var datumNapomene=$('#krajZadatka'+sZadatakKey).attr('value');
  var noviDatum=datumNapomene.split(".");
  var datum=DajDanasnjiDatum();
  var oDatum=new Date();
  var dd = oDatum.getDate();
  var M = oDatum.getMonth(); 
  var yyyy = oDatum.getFullYear();
  var danas=new Date(yyyy,M,dd);
  var rok=new Date(parseInt(noviDatum[2]),parseInt(noviDatum[1])-1,parseInt(noviDatum[0]));

  if(datum<rok){
    $('#greska'+sZadatakKey).removeClass('nijeIstekao');
    $('#greska'+sZadatakKey).addClass('istekaoTekst');
    $('#cardHeader'+sZadatakKey).addClass('istekaoZadatakHeader');
    document.getElementById("btnObavljen"+sZadatakKey).disabled = true;
    document.getElementById("btnProslijedi"+sZadatakKey).disabled = true;
    document.getElementById("unosNapomene"+sZadatakKey).disabled = true;
  }
}

function TrenutniKorisnik(){

oDbKorisnici.on('value', function()
{
  var oTrenutniKorisnik = $('#korisnik');
  var oTrenutniKorisnik2 = $('#korisnikTrenutni');
  korisnici.forEach(function(y)
  {
  if(y.id==sKorisnik){
    var sRow = '<div>' + y.ime+" "+y.prezime +'</div>';
     oTrenutniKorisnik.find('#ImePrezime').append(sRow);
     oTrenutniKorisnik2.find('button').append(sRow);
   }
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

  function DodajStatus(ZadatakKey){
    var oZadatakStatus = 
    {
        id_zadatka:ZadatakKey,
        status:"false",
    };

    var oZapis = {};
    oZapis[ZadatakKey] = oZadatakStatus;
    oDbStatusiZadataka.update(oZapis);
  }

  function Dodaj() 
{
  if(ProvjeraUnosaDodavanja()==true){
var broj;
var sZadatakOpis = $('#inptOpisZadatka').val();
var sZadatakRok = $('#Rok').val();
var sZadatakKomentar=$('#odabirKomentar').val();
var sZadatakRjesavatelj=$('#odabirRjes option:selected').val();
firebase.database().ref('zadaci/zadaci').once('value').then(function(snapshot) {
  for (key in snapshot.val()) { 
     broj=key;
  }
    var oZadatak = 
    {
        komentar:sZadatakKomentar,
        korisnikRjesavatelj_id: sZadatakRjesavatelj,
        korisnikVlasnik_id: sKorisnik,
        rok:sZadatakRok,
        zadatak_naziv:sZadatakOpis,
    };

    var oZapis = {};
    oZapis[parseInt(broj)+1] = oZadatak;
    oDbZadaci.update(oZapis);
    DodajStatus(parseInt(broj)+1);
    ProvjeriZadatkeTablice();
  });
  $("#modalDodaj").modal('toggle');
}
}
function Odjava(){
  var url = "pocetna.html";
  window.location.href = url;
}

function Brisanje(sZadatakKey){
	var oZadatak = oDb.ref('zadaci/zadaci/' + sZadatakKey);
  oZadatak.remove();
}
function Potvrda(sZadatakKey){
  document.getElementById('Kliknuti').onclick = function() {
      Brisanje(sZadatakKey);
      ObrisiNapomenu(sZadatakKey);
      ObrisiStatus(sZadatakKey);
      ProvjeriTablicu();
      ProvjeriZadatkeTablice();
 }
}

function ObrisiStatus(ZadatakKey){
  oDbStatusiZadataka.on('value',function(){
    statusZadataka.forEach(function(oStatus){
      if(oStatus.id==ZadatakKey){
        var oStatusZadatka = oDb.ref('statusZadataka/statusZadataka/' + ZadatakKey);
          oStatusZadatka.remove();
      }
    });
  });
}

function ModalUrediZadatak(sZadatakKey)
{	
	var oZadatakRef = oDb.ref('zadaci/zadaci/' + sZadatakKey);
	oZadatakRef.once('value', function(oOdgovorPosluzitelja)
	{
		var Zadatak = oOdgovorPosluzitelja.val();
		$('#inptNazivZadatka').val(Zadatak.zadatak_naziv);
    $('#RokIzvrsavanja').val(Zadatak.rok);
    $('#odabirRjesavatelja').val(Zadatak.korisnikRjesavatelj_id);  
    $('#inptKomentarZadatka').val(Zadatak.komentar);
		$('#btnAzuriraj').attr('onclick', 'ProvjeraUnosaAzuriranja('+sZadatakKey+')');
		$('#modalAzuriraj').modal('show');
  });
}

function SpremiAzuriraniZadatak(sZadatakKey)
{
	var oZadatakRef = oDb.ref('zadaci/zadaci/' + sZadatakKey);
  oZadatakRef.once('value', function(oOdgovorPosluzitelja)
	{
    var Zadatak = oOdgovorPosluzitelja.val();
    var sZadatakRjesavatelj = $('#odabirRjesavatelja option:selected').val();
  	var sZadatakNaziv = $('#inptNazivZadatka').val();
    var sZadatakRokIzvrsavanja = $('#RokIzvrsavanja').val();
  var sZadatakKomentar=$('#inptKomentarZadatka').val();
	var oZadatak = 
	{
		'zadatak_naziv': sZadatakNaziv, 
    'rok': sZadatakRokIzvrsavanja,
    'korisnikRjesavatelj_id':sZadatakRjesavatelj,
    'komentar':sZadatakKomentar
  };
  oZadatakRef.update(oZadatak);
 ObavijestProslijedena(Zadatak.korisnikRjesavatelj_id,sZadatakRjesavatelj);
});
}

function ProslijediZadatak(sKeyZadatka){
  var oZadatakRef = oDb.ref('zadaci/zadaci/' + sKeyZadatka);
   oZadatakRef.once('value', function(oOdgovorPosluzitelja)
	{
    var Proslijedi=true;
    var zadatak=oOdgovorPosluzitelja.val();
  var sZadatakRjesavatelj = $('#KorisnikRjesavatelj').val();
  if(zadatak.korisnikVlasnik_id==sZadatakRjesavatelj){
   alert("Ne možete proslijediti zadatak korisniku koji je vlasnik zadatka!");
    Proslijedi=false;
  }
  if(Proslijedi==true){
	var oZadatak = 
	{
    'korisnikRjesavatelj_id':sZadatakRjesavatelj
	};
  oZadatakRef.update(oZadatak);
  ZadatakProslijeden(sKorisnik,sZadatakRjesavatelj);
  ProvjeriAccordion();
}
});
}
function ZadatakProslijeden(trenutni,proslijedeni){
  oDbKorisnici.on('value',function(){
    var obavijest=$('#proslijedi');
  obavijest.find('#porukaProslijedi').empty();
  var trenutniKorisnik;
  var noviKorisnik;
    korisnici.forEach(function(x) {
      if(x.id==trenutni){
        trenutniKorisnik=x.ime+" "+x.prezime;
      }
      if(x.id==proslijedeni){
        noviKorisnik=x.ime+" "+x.prezime;
      }    
    })  
  var tekst='<p>Korisnik '+trenutniKorisnik+' je proslijedio zadatak korisniku '+noviKorisnik+'</p>';
  obavijest.find('#porukaProslijedi').append(tekst);
  });
  $("#ZadatakProsljedivanje").toast('show');
}

function ObavijestProslijedena(oTrenutni,oProslijedeni){
  oDbKorisnici.on('value',function(){
    var obavijest=$('#poruka');
  obavijest.find('#upisi').empty();
  var trenutniKorisnik;
  var noviKorisnik;
    korisnici.forEach(function(x) {
      if(x.id==oTrenutni){
        trenutniKorisnik=x.ime+" "+x.prezime;
      }
      if(x.id==oProslijedeni){
        noviKorisnik=x.ime+" "+x.prezime;
      }    
    })  
  var poruka='<p>Zadatak je promijenio korisnika iz '+trenutniKorisnik+' u '+noviKorisnik+'</p>';
  obavijest.find('#upisi').append(poruka);
  console.log(trenutniKorisnik+' '+noviKorisnik);
  });
  $("#obavijestProsljedivanje").toast('show');
}

function Obavi(sZadatakKey){
  $("#obavijest").toast('show');
  Napomene(sZadatakKey);
  True(sZadatakKey);
}

function PromijeniStatusZadatka(sZadatakKey){
  var oStatusRef = oDb.ref('statusZadataka/statusZadataka/' + sZadatakKey);
	var oStatus = 
	{
    'status':"true"
	};
	oStatusRef.update(oStatus);
}

function ProvjeriZadatkeTablice(){
  oDbKorisnici.once('value',function(){
    korisnici.forEach(function(x){
      if(sKorisnik==x.id){
        oDbZadaci.once('value',function(sOdgovorPosluzitelja){
          sOdgovorPosluzitelja.forEach(function(oZadatakSnap){
            var oZadatak=oZadatakSnap.val();
            var oZadatakKey=oZadatakSnap.key;
            oDbStatusiZadataka.once('value',function(){
              statusZadataka.forEach(function(x){
                if(oZadatak.korisnikVlasnik_id==sKorisnik){
                  if(oZadatakKey==x.id){
                  if(x.status=="true"){
                      try{
                      document.getElementById("gumbAzuriraj"+oZadatakKey).disabled=true;
                      $("#gumbAzuriraj"+oZadatakKey).addClass("gumbAzuriraj");
                      $('#redak'+oZadatakKey).addClass("obavljeniZadatakMojiZadaci");
                  }
                  catch{
                  }
                  }
                }
                }
              });
            });
          });
        });
      }
    });
  });
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

const opisZadatka = document.getElementById('inptOpisZadatka');
const rokZadatka = document.getElementById('Rok');

function ProvjeraUnosaDodavanja(){
  var dodaj=true;
	const opisZadatkaValue = opisZadatka.value.trim();
  const rokZadatkaValue = rokZadatka.value.trim();
  
  if(opisZadatkaValue==''){
    PostaviGresku(opisZadatka,'Opis zadatka ne može biti prazan');
    dodaj=false;
  }
  else{
    PostaviValjano(opisZadatka);
  }
  if(rokZadatkaValue===''){
    PostaviGresku(rokZadatka,'Rok izvršavanja zadatka ne može biti prazan');
    dodaj=false;
  }
  else{
    PostaviValjano(rokZadatka);
  }
  return dodaj;
}

const opisZadatkaAzuriranje=document.getElementById("inptNazivZadatka");
const rokIzvrsavanjaAzuriranje=document.getElementById("RokIzvrsavanja");

function ProvjeraUnosaAzuriranja(sZadatakKey){
var azuriraj=true;
const opisZadatkaAzurirajValue=opisZadatkaAzuriranje.value.trim();
const rokIzvrsavanjAzuriranjaValue=rokIzvrsavanjaAzuriranje.value.trim();

if(opisZadatkaAzurirajValue==''){
  PostaviGresku(opisZadatkaAzuriranje,'Opis zadatka ne može biti prazan');
  azuriraj=false;
}
else{
  PostaviValjano(opisZadatkaAzuriranje);
}
if(rokIzvrsavanjAzuriranjaValue===''){
  PostaviGresku(rokIzvrsavanjaAzuriranje,'Rok izvršavanja ne može biti prazan');
  azuriraj=false;
}
else{
  PostaviValjano(rokIzvrsavanjaAzuriranje);
}
if(azuriraj==true){
  $('#modalAzuriraj').modal('toggle');
  SpremiAzuriraniZadatak(sZadatakKey);
  ProvjeriZadatkeTablice();
}
}
function ObrisiNapomenu(sZadatakKey){
  try{
    oDbNapomene.on('value',function(sOdgovorPosluzitelja){
      sOdgovorPosluzitelja.forEach(function(oNapomenaSnap){
        var oNapomena=oNapomenaSnap.val();
        var oNapomenaKey=oNapomenaSnap.key;
        if(oNapomena.zadatak_id==sZadatakKey){
          var oNapomenaZadatka = oDb.ref('napomene/napomene/' + oNapomenaKey);
          oNapomenaZadatka.remove();
        }
      });
    });
  }
  catch{
  }
  ProvjeriNapomene();
}