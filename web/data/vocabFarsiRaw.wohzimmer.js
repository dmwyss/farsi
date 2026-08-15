
qerqere,                    gargle

change this one for         you saw (past)
diddi - cheghadr aasoone,   see - how easy that is


translate the following sentence into informal farsi:

The old Persian word created the Turkish word: "tülbent".

Oon kalameye ghadimie farsie, kalameye „tülbent“-e torkiro dorost kard.
Oon kalameye ghadimie farsie, in kalameye torkiro dorost kard: tülbent.


nabaayad be kasi begi,          must-not to someone say
baayad vaasam bekharish,        must for me buy-it
baayad ajale konim,             must hurry do-we

fahmidam chi gofti,                     I understood what you said
baayad kheili movazeb baashi,           must very careful be-you
baayad ghataare badi ro savar shim,     must train next ride-on
kelidam gom shode baayad peydaash konam,    key lost must find-do-I
mikhaam too Sandringham ye khoone bekharam, want in Sandringham one house buy
nabyaayad zood tasmim begiri,           not-must early decision take

hamine ke hast,                         it is what it is
che khabare?,                           what is going on?
mesele aabe khordane,                   its easy (like drinking water)
yek saanie vaastaa - begu chi khaastaa, one second stop - tell what wanted-you
cheraagh ro roshan kon,                 light thatone turn-on do
badan behem zang bezan,                 call me later
badan behem peyam bezan,                text me later
shookhi mikoni vali mifahmam,           joking you but I understand
yekkam bolandtar sobhat kon,            little-bit louder speak-do
har rooz ye chize jadid yaad migiri,    each day one thing new thought take
rooze khoobi daashti?,                  day good-one had?
jashn chetor bood?,                     party good was?
kelidam ro peydaa nemikonam,            I cant find my key
istgaahe badi piaade misham,            I get off at the next stop


aftab az khorshid miad,                 sunshine comes from the sun
too ye maah chahaar hafte hast,         there are 4 weeks in a month
har saal davaazdah maah-e,              each year twelve months-is
be nazaram har daghigheh shast saanie-se,       i think there are sixty seconds in a minute
in paaeez the trees looze their leevz,  (EN/Farsi) in autumn the trees loose their leaves
shab-e yaldaa dar zemestaan ast,        night of yaldaa in winter is
dar zemestaan barf mibaarad,            in winter snow falls
taabestoon khorshid mitaabe,            summer (the) sun shines
too bahaar barre-haa ba-ba mikonan,     in summer lambs baa-baa do
ye hafte haft rooz hast,                one week seven days is
aakhar-e hafte do rooz-e,               end-of week two days-is
ye saal faghat chahaar taa fasl-e,      one year only four of seasons-is
melborn too ye rooz chahaar taa fasl daare,     melbourne has four seasons in one day
ye mesaal begoo,                        one example say
too taabestoon saahil aaftaabii-e,      the beach is sunny in summer
lotfan javaab-e soaal ro bede,          please answer-of question give
ye zare kare behem bede,                one tiny-bit butter give
ye heyvoon too khoonamoon,              an animal in our house
khanoom too daamoone-moon-e,            lady in forrest-ours-is
koodoom khanoom too khoonamoon-e,       which lady in house-ours-is
setaare-ye shomaare-ye yek,             star number one
setaare-haa bi-shomaar-an,              stars are inumerable
doost *yaa* doshman,                    friend *or* enemy
aghab-oftaadeh-ye khaanevaade,          retard (back-fallen) of the family
in-jaa oon-jaa hame-jaa too donyaa,     here there everywhere in (the) world
hame-jaa-ye donyaa,                     everywhere in the world
javaab-e jaaleb,                        intersting answer
soaal-e saadeh,                         easy question
soaal saal saa^at saadeh saak,          question year time easy bag
sar sad sag sabz sard,                  head/end hundred dog green cold
shir pir zir dir gir,                   milk/tap/lion old under late blockade/get/stuck





Not learned
estebaah                                mistake

donyaa                                  world
khaanoom                                lady
heyvoon                                 animal
dalil                                   reason
soaal                                   question
keshvar                                 country
javaab                                  answer
shomaare                                number
khaanevaade                             family

saahel                                  beach
hafte                                   week
barnaame                                plan/schedule
jashn                                   party
gheymat                                 price
shoghl                                  job
aatish                                  fire
fasl                                    season
saal                                    year
mardom                                  people














var g_sSearchLast = "";
var g_ixTemplate = 0;

var aoTemplates = [
	"literal translation of \"\" in farsi",
	"what does \"\" mean in farsi",
	"how do you say \"\" in informal farsi",
	"etymology of the farsi word \"\"",
	"conjugate the verb \"\" in informal farsi",
	"give me a short, informal, rhyming sentence using the farsi word \"\"",
	"always give me farsi translations in informal farsi in lower case with the alef character written as aa"
]
function selectQuoteContent(myField) {
  myField.focus();
  myField.focus();
  if (myField.value.split("\"").length < 3) {
  	return;
  }
	let iQuotePosStart = myField.value.indexOf("\"") + 1;
	let iQuotePosEnd = myField.value.lastIndexOf("\"");
  setTimeout(
  	function(){
  		myField.setSelectionRange(iQuotePosStart, iQuotePosEnd);
  	}, 100
  )
}
window.addEventListener('keydown', function(event) {
    let ata = document.querySelectorAll("textarea");
    let myField = ata[ata.length - 1];
		if (myField === document.activeElement) {
				document.title = "boro berim!";
		    if (event.key === 'ArrowUp') {
				    myField.value = g_sSearchLast;
				    selectQuoteContent(myField);
		    } else if (event.key === 'ArrowDown') {
				    //console.log("---" + g_ixTemplate);
				    myField.value = aoTemplates[g_ixTemplate];
				    selectQuoteContent(myField);
				    g_ixTemplate++;
				    g_ixTemplate = g_ixTemplate % aoTemplates.length;

				    console.log("pos " + myField.selectionStart);

		    } else {
				    setTimeout(
			        function() {
			    	      g_sSearchLast = myField.value;
			    		},
			    		100
					  )
	  		}
		}
	  if (event.key === 'Enter') {
	  	// If a search is run, reset the index to first.
	    console.log("" + g_ixTemplate + "");
	    g_ixTemplate = 0;
  	}
});




