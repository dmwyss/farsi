/*
 * Use up and down arrows to choose between
 * search templates and previous searches.
 */
var g_sSearchLast = "";
var g_asSearches = [];
var g_ixCursor = 0;
var g_isMuted = false;

var aoTemplates = [
    "literal word for word translation of \"\" in farsi",
    "how do you say \"\" in informal farsi like friends talking in tehran",
    "etymology of the farsi word \"\"",
    "is \"\" good grammar and natural informal farsi I would say to my girlfriend?",
    "difference between \"\" and \"\"",
    "is it \"\" or \"\"",
    /* "what does \"\" mean in farsi", */
    /* "conjugate the verb \"\" in informal farsi", */
    /* "give me a short, informal, rhyming sentence using the farsi word \"\"", */
    "translate some farsi words, if i spelled it wrong correct my farsi word or"
        + " phrase. Translate to finglish with the \'ā\' or \'â\' or alef character"
        + " written as \'aa\' then the english literal word"
        + " for word translation. Each time I give you a new word give me all the"
        + " previous words listed above in alphabetical order.",
    "Always give me farsi translations in informal tehran farsi as if "
        + " friends were talking. Write \'ā\' \'â\' or alef character as aa."
        + " Write the ayn character as \'-a\'."
        + " Write everything in lowercase except for proper nouns."
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
    console.log(event.key);
    // recently removed because messes up normal google search: let ata = document.querySelectorAll("textarea");
    let ata = document.querySelectorAll("textarea[autocomplete=off]");
    let myField = ata[ata.length - 1];
    if (myField === document.activeElement) {
        isArrow = false;
        sQueryText = "";
        if (event.key === 'ArrowUp') {
            if (!g_isMuted) {
                g_ixCursor--;
            }
            if ((g_ixCursor < 0) && (g_asSearches.length === 0)) {
            	g_ixCursor = 0;
            }
            isArrow = true;
        } else if (event.key === 'ArrowDown') {
            if (!g_isMuted) {
                g_ixCursor++;
            }
            isArrow = true;
        }
        console.log("ix :: " + g_ixCursor);
        if (isArrow) {
            if (g_isMuted) {
                return;
            }
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
            myField.value = sQueryText;
            selectQuoteContent(myField);
        } else if (/^[a-zA-Z0-9]$/.test(event.key)) {
        	console.log("alpha " + event.key);
        	flashField();
        	/*
        	document.querySelector("[data-active]").querySelector("[role='presentation']").style.backgroundColor = "#4565";
        	//document.activeElement.style.backgroundColor = "#345"; // Redundant, in case fancy one above fails.
			setTimeout(
				() => {
					document.querySelector("[data-active]").querySelector("[role='presentation']").style.backgroundColor = "transparent";
					//document.activeElement.style.backgroundColor = "transparent"; // Redundant, in case fancy one above fails.
					mute();
				},
				400
			);
			*/
        } else {
            setTimeout(
                function() { g_sSearchLast = myField.value; },
                100
            )
        }
    } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
		toggleMute();
        myField.focus();
        myField.select();
    } else {
        // Check if the pressed key is the slash key
        if (event.key === '/') {
            // Prevent the default behavior (like opening browser search or typing "/")
            event.preventDefault();
            myField.focus();
            myField.select();
        }
    }
    if (event.key === 'Enter') {
        // If a search is run, reset the index to first.
        console.log("" + g_ixCursor + "");
        g_asSearches.push(g_sSearchLast);
        g_ixCursor = 0;
        mute(false);
    }
});
function toggleMute() {
    mute(!g_isMuted);
}
function mute(isMute=true) {
    g_isMuted = isMute;
    document.title = g_isMuted ? "#MUTED#" : "berim!";
    console.log("mute swwitched");
}
let __uiFlashField__ = null;
function flashField() {
	if (__uiFlashField__ === null) {
		__uiFlashField__ = document.querySelector("[data-active]").querySelector("[role='presentation']")
	}
	__uiFlashField__.style.backgroundColor = "#4565";
	setTimeout(
		() => {
			__uiFlashField__.style.backgroundColor = "transparent";
			mute();
		},
		400
	);
}
document.title = "berim!";
console.log("User_JS_CSS :: user script loaded. V0.1");
