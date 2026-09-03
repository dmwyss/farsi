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
    // Next line changed:
    // Was:
    // 	let iQuotePosEnd = myField.value.lastIndexOf("\"");
    let iQuotePosEnd = myField.value.indexOf("\"", iQuotePosStart);
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
            document.title = "berim!";
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
console.log("User_JS_CSS :: user script loaded. V0.0");