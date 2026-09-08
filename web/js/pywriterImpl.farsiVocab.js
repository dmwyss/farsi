/*

*/
let pywriterImpl = {
    CLICK_DATA: 0
    ,VOTE_DATA: 1
    ,THEME_DATA: 2
    /*
    ,replacers: {
         nlAfterFirstSqBracket:     [/^\[\{/gi, "[\n  {"] // at the very start [{ gets nl inserted.
        ,nlAfterFirstCurlyBracket:  [/^\{/gi, "{\n"] // at the very start [{ gets nl inserted.
        ,nlBeforeListOfObjects:     [/:\[\{/gi, ":[\n  {"] // Near the start "obj":[{ gets nl inserted.
        ,nlBetweenObjs:             [/\},\{/gi, "}\n ,{"] // Between each element },{ gets nl inserted.
        ,nlAfterLastSqBracket:      [/}]/gi, "}\n]"] // At the very end }] gets nl inserted.
        ,nlBeforeLastCurlyBracket:  [/}$/gi, "\n}"] // At the very end }] gets nl inserted.
        ,nlBetweenNamedElements:    [/},\"/gi, "}\n,\""] // Insert nl between named items in object. Risky.
        ,nlBetweenKeyValueElements:    [/\",\"/gi, "\"\n,\""] // Insert nl between named items in object. Risky.
    }
    */
    ,save: function(iObjType, oData) {
        let sFileName = "data/";
        let sPre = "let ";
        let sPost = ";";
//        let aaReplace = [];
        let sBody = "";

        sBody = JSON.stringify(oData, null, 4); // Plain stringify, use replaces to format.
//        aaReplace.push(this.replacers.nlAfterFirstCurlyBracket);
//        aaReplace.push(this.replacers.nlBetweenNamedElements);
//        aaReplace.push(this.replacers.nlBetweenKeyValueElements);
//        aaReplace.push(this.replacers.nlBeforeLastCurlyBracket);
        if (iObjType == this.CLICK_DATA) {
            sFileName += "sakhtiData.js"
            sPre = sPre + "sakhtiData = ";
        } else if (iObjType == this.VOTE_DATA) {
            sFileName += "voteData.js"
            sPre = sPre + "voteData = ";
        } else if (iObjType == this.THEME_DATA) {
            sBody = JSON.stringify(oData, null, "\t"); // Nested; use stringify to do all formatting.
            aaReplace = [];
            sFileName += "themeData.js"
            sPre = sPre + "themeData = ";
        } else {
            sBody = JSON.stringify(oData, null, "\t"); // Nested; use stringify to do all formatting.
            aaReplace = [];
            sFileName += "unregisteredData.js";
            sPre = sPre + "g_unregisteredData = ";
        }
        /*
        for (let iR = 0; iR < aaReplace.length; iR++) {
            sBody = sBody.replace(aaReplace[iR][0], aaReplace[iR][1])
        }
        */
        sBody = sPre + sBody + sPost;
        pywriter.save("farsiVocab", sFileName, sBody, pywriterImpl.callbackMethod());
    }
    ,callbackMethod: function() {
        console.log("pywriterImpl.callback()");
    }
}
