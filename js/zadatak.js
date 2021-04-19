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
var sZadatakKey = oUrl.searchParams.get("zadatak_key");

var oZadatakRef = oDb.ref('zadaci/' + sZadatakKey);

oZadatakRef.once('value', function(oOdgovorPosluzitelja)
{
	var oZadatak = oOdgovorPosluzitelja.val();
	// Popunjavanje elemenata forme za uređivanje
	$('#korisnik-vlasnik').prepend(oZadatak.korisnikVlasnik_id);
	$('#zadatak-naziv').text(oZadatak.zadatak_naziv);
	$('#vijest-tekst').html(oZadatak.vijest_tekst);
});
hideURLParams();