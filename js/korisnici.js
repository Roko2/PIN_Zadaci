$(document).ready(function(){
  $("#unos").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tablica-korisnici .pretraga").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
function getURLParameter(name) {
	return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}
function hideURLParams() {
	var hide = ['korisnik_id'];
	for(var h in hide) {
		if(getURLParameter(h)) {
      console.log("jesam");
			history.replaceState(null, document.getElementsByTagName("title")[0].innerHTML, window.location.pathname);
		}
	}
}
var sUrl = window.location.href ;
var oUrl = new URL(sUrl);
var sKorisnik = oUrl.searchParams.get("korisnik_id");

function Index(){
	var url = "Index.html?korisnik_id=" +encodeURIComponent(sKorisnik);
    window.location.href = url;
}

oDbKorisnici.on('value', function(oOdgovorPosluzitelja) 
{
	var oTrenutniKorisnik = $('#korisnik');
	var oTablicaKorisnici = $('#tablica-korisnici');
	oTablicaKorisnici.find('tbody').empty();
	var nRbr = 1;
	oOdgovorPosluzitelja.forEach(function(oKorisnikSnapshot)
	{
		var oKorisnik = oKorisnikSnapshot.val();
		var sRow = '<tr class="pretraga"><td>' + nRbr++ +'.</td><td>'+ oKorisnik.Ime+ '</td><td>'+oKorisnik.Prezime+'</td><td>'+oKorisnik.Datum_rodjenja+'</td><td>'+oKorisnik.Spol+'</td><td>'+oKorisnik.Email_adresa+'</td><td>'+oKorisnik.korisnik_id+'</td></tr>';
		oTablicaKorisnici.find('tbody').append(sRow);
  		if(oKorisnik.korisnik_id==sKorisnik){
    		var sRowKorisnik = '<div>' + oKorisnik.Ime+" "+oKorisnik.Prezime +'</div>';
			 oTrenutniKorisnik.find('button').append(sRowKorisnik);
 	 }
	});
});

function Odjava(){
	var url = "pocetna.html";
	  window.location.href = url;
  }
  hideURLParams();