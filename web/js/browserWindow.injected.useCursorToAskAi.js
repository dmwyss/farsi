/*
 * Use up and down arrows to choose between
 * search templates and previous searches.
 */
var g_sSearchLast = "";
var g_asSearches = [];
var g_ixCursor = 0;

var aoTemplates = [
  "literal translation of \"\" in farsi",
  "what does \"\" mean in farsi",
  "how do you say \"\" in informal farsi",
  "etymology of the farsi word \"\"",
  "conjugate the verb \"\" in informal farsi",
  "give me a short, informal, rhyming sentence using the farsi word \"\"",
  "Always give me farsi translations in informal farsi in lower case with the alef character written as aa. Use - with a space before and after instead of commas."
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
  //   let iQuotePosEnd = myField.value.lastIndexOf("\"");
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
  	  isArrow = false;
  	  sQueryText = "";
      if (event.key === 'ArrowUp') {
      	g_ixCursor--;
  		isArrow = true;
      } else if (event.key === 'ArrowDown') {
        g_ixCursor++;
  		isArrow = true;
      }
      console.log("ix :: " + g_ixCursor);
      if (isArrow) {
      	// User is going up/down in history.
  		sQueryText = ""; // Assume ix is 0 - no text.
      	if (g_ixCursor < 0) {
      		// We are in the previous search list.
	        // if it is -1 it will be the last one.
	        if (g_asSearches.length == 0) {
	        	// There are no previous searches. Reset cursor.
	        	g_ixCursor = 0;
	        } else {
	        	if (Math.abs(g_ixCursor) > g_asSearches.length) {
		        	// We have gone outside the available list.
		        	// for example looking for item[-1].
		        	// Undo the curor action upwards, by adding 1 back in.
	        		console.log(Math.abs(g_ixCursor) + " > " + g_asSearches.length);
	        		g_ixCursor++;
	        	}
	        	// Set the index within the searhes list.
	        	// For example, if there are searches [aaa, bbb, ccc]
	        	// we add the (always negative) g_ixCursor to the length.
	        	// For example: length 3 + -1 will select element [2].
	        	// For example: length 3 + -2 will select element [1].
	        	let ixSearch = Math.max(0, g_asSearches.length + g_ixCursor);
	        	sQueryText = g_asSearches[ixSearch];
	        	// LEAVE:: console.log(g_asSearches[ixSearch] + " [" + g_asSearches.join(",") + "]";
	        }
      	} else if (g_ixCursor > 0) {
      		// We are in the template list.
	        g_ixCursor = Math.min(g_ixCursor, (aoTemplates.length)); // No overflow.
	        sQueryText = aoTemplates[g_ixCursor - 1];
      	}
      	/*
        */
        myField.value = sQueryText;
        selectQuoteContent(myField);
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
      console.log("" + g_ixCursor + "");
      g_asSearches.push(g_sSearchLast);
      g_ixCursor = 0;
    }
});
document.title = "berim!";
console.log("User_JS_CSS :: user script loaded. V0.1");