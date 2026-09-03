const EN = 0;
const FA = 1;
const ARROW = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
}
const asArrowKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
const vocab = {
    dict: null,
    list: null, // Sorted array. Gets resorted a lot.
    sLastSortField: "UNSET",
    ixVis: -1,
    iLangShown: EN,
    iLangGuess: FA,
    iColHiddenForGuess: 2,
    userSettings: {lastSort: "sSortSakhti"},
    init: function() {
        //sakhtBase.setDataFromCookie();
        sakhtBase.init();
        this.userSettings = localStorageManager.get("user_settings", this.userSettings);
        this.dict = this.parseRaw();
        this.initList();
        this.render();
        this.clickColSort(this.userSettings.lastSort);
    },
    parseRaw: function() {
        let oDictOut = {};
        let asLines = vocabFarsiRaw.split("\n");
        let ixCursor = 0;
        for (let ix = 0; ix < asLines.length; ix++) {
            let oWord = this.toWord(asLines[ix]);
            if (!oWord) {
                continue;
            }
            let sForeignKey = oWord.p.key.toLowerCase().split("?").join("").split("\"").join("&quot;");
            if (oDictOut.hasOwnProperty(oWord.p.key)) {
                let iIncrement = 1;
                while (oDictOut.hasOwnProperty(sForeignKey)) {
                    //c onsole.error("trying to set " + oWord.p.key + " again.");
                    sForeignKey = (oWord.p.key + "__" + iIncrement).toLowerCase();
                    iIncrement++;
                }
            }
            let oO_ = sakhtBase.getByKeyOo(sForeignKey);
//debugger;
            oWord.meta = {
                ixOrig: ixCursor++,
                sSortP: oWord.p.key.toLowerCase(),
                sSortE: oWord.e.key.toLowerCase(),
                sSortStar: (oWord.hasOwnProperty("star") && (oWord.star == 1) ?  1 : 0),
                sSortSakhti: ((oO_.sakhti === 0 ? 1 : (oO_.sakhti + 100)) * 10000) + ix
            };
            oWord.key = sForeignKey;
            oDictOut[sForeignKey] = oWord;
        }
        return oDictOut;
    },
    initList: function() {
        this.list = [];
        for (let sKey in this.dict) {
            this.dict[sKey].meta.ixInList = this.list.length;
            this.list.push(this.dict[sKey]);
        }
    },
    toWord: function(sLine) {
        sLine = sLine.trim().split("'").join("~").split("\"").join("^");
        if ((sLine == "") || (sLine.startsWith("#"))) {
            return null;
        }
        let asLine = sLine
            .replaceAll(/(,[ \t]{0,}|,? {4,})/gi, ",")
            .split(",")
            ;
        return {
            p: this.toMot(asLine[0]),
            e: this.toMot(asLine[1])
        }
    },
    toMot: function(sMotRaw="") {
        sMotRaw = sMotRaw.trim();
        let as = sMotRaw.split("*");
        let oOut = {};
        if (as.length < 3) {
            oOut.key = as[0];
            oOut.context = "<b class=\"context\">" + as[0] + "</b>";
        } else {
            oOut.key = as[1];
            oOut.context = as[0] + "<b class=\"context\">" + as[1] + "</b>" + as[2];
        }
        return oOut;
    },
    vocabToHtml: function() {
        let sOut = "<table id=\"vocab\">"
        sOut += "<tr>"
            + "<td id=\"sNum\" class=\"colSorter colNarrow\">#</td>"
            + "<td id=\"sSortE\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">engelisi</td>"
            + "<td id=\"sSortP\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">farsi</td>"
            + "<td id=\"sSortResearch\" class=\"colSorter colNarrow\">&nbsp;</td>"
            + "<td id=\"sSortStar\" class=\"colSorter colNarrow\">&star;</td>"
            + "<td id=\"sSortSakhti\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">sakhti</td>"
            + "</tr>";
        for (let ix = 0; ix < this.list.length; ix++) {
            let oWord = this.list[ix];
            let oO = sakhtBase.getByKeyOo(oWord.key);
            sOut += "<tr onclick='vocab.doRowClick(this);' id='tr" + ix + "' data-key='" + oWord.key + "'>" // " + ix + "
                //+ "<td class=\"word\">" + this.tameSpecialChars(oWord.p.key) + "</td>"
                //+ "<td class=\"word\">" + oWord.e.key  + "</td>"
                // Do not delete: use to see sakhti: oWord.meta.sSortSakhti
                + "<td class=\"context colNarrow\">" + (ix + 1) + "</td>"
                + "<td class=\"context\">" + this.showQuote(oWord.e.context) + "</td>"
                + "<td class=\"context\">" + this.showQuote(this.tameSpecialChars(oWord.p.context)) + "</td>"
                + "<td class=\"context colNarrow\">" + sakhtBase.getResearchLink(oWord.key, oO) + "</td>"
                + "<td class=\"context colNarrow\">" + sakhtBase.getStarOo(oWord.key, oO) + "</td>"
                + "<td class=\"context\">" + sakhtBase.getIconOo(oO) + "</td>"
                + "</tr>";
        }
        sOut += "</table>";
        return sOut;
    },
    tameSpecialChars: function (sRaw) {
        //        return sRaw.split("aa").join("&amacr;").split("~").join("&apos;");
        return sRaw.split("ā").join("aa").split("~").join("&apos;");
    },
    showQuote: function (sRaw) {
        return sRaw.split("^").join("&quot;");
    },
    clickColSort: function (uiSrcOrStringId) {
        let sSortField = uiSrcOrStringId;
        if (typeof uiSrcOrStringId !== "string") {
            sSortField = uiSrcOrStringId.id; // "sSortE";
        }
        if (sSortField === this.sLastSortField) {
            this.list.reverse();
        } else {
            this.list.sort((a, b) => (a.meta[sSortField] > b.meta[sSortField] ? 1 : -1));
        }
        this.sLastSortField = sSortField;
        this.render();
        this.userSettings.lastSort = sSortField;
        localStorageManager.set("user_settings", this.userSettings);
    },
    render: function () {
        this.uiVocab = document.querySelector("#vocab");
        this.uiVocab.innerHTML = this.vocabToHtml();
    },
    rowHighlited: null,
    doRowClick: function(oRow) {
        let tbl = document.querySelector("table#vocab");
        let atr = tbl.querySelectorAll("tr");
        let isFound = false;
        let sOpacity = "1.0";
        let ixRowClicked = parseInt(oRow.id.split("tr")[1]);
        this.ixVis = ixRowClicked;
        for (let ixTr = 0; ixTr < atr.length; ixTr++) {
            let atd = atr[ixTr].querySelectorAll("td");
            atd[this.iColHiddenForGuess].style.opacity = sOpacity;
            //atd[2].style.opacity = sOpacity;
            if (!isFound) {
                if (atr[ixTr] === oRow) {
                    if (this.rowHighlited != null) {
                        this.rowHighlited.style.backgroundColor = "inherit";
                    }
                    oRow.style.backgroundColor = "#FFF1";
                    if (false) {
                        setTimeout(
                            function() {
                                oRow.style.backgroundColor = "inherit";
                            }, 500
                        )
                    }
                    this.rowHighlited = oRow;
                    isFound = true;
                    sOpacity = "0.0";
                }
            }
        }
    },
    next: function(iDist) {
        this.ixVis += iDist;
        if ((this.ixVis < 0) || (this.ixVis === vocab.list.length)) {
            this.ixVis = 0;
            return;
        }
        //c onsole.log("ixVis :: " + this.ixVis);
        let trNext = document.querySelector("#tr" + this.ixVis);

        this.scrollToWindowY(trNext);

        this.doRowClick(trNext)
    },
    scrollToWindowY: function(trNext) {
        let iPosY = this.howFarIsElementScrolledOffScreen(trNext);
        if (iPosY === 0) {
            return;
        }
        window.scrollTo({
            top: iPosY + window.scrollY,
            left: 0,
            behavior: 'smooth'
        });
    },
    howFarIsElementScrolledOffScreen: function(element) {
        if (!element) {
            return 0;
        }
        const rect = element.getBoundingClientRect();

        // Check if the element is completely outside the viewport bounds
        const isOffTop = rect.top < 20;
        const isOffBottom = (rect.bottom + 20) > window.innerHeight;
        if (isOffTop) {
            return -40; //rect.bottom;
//            return window.scrollY - rect.top; //rect.bottom;
        } else if (isOffBottom) {
            return 40; //rect.top;
        }
        return 0;
    },
    incrementSakhti: function(iSakht) {
        if (iSakht === 0) {
            //c onsole.log("increment == 0");
            return;
        }
        let trCurrent = document.querySelector("#tr" + this.ixVis);
        if (trCurrent === null) {
            console.log("no current tr");
            return;
        }
        let sKey = trCurrent.getAttribute("data-key");
        if (!sakhtBase.dataOo.hasOwnProperty(sKey)) {
            sakhtBase.dataOo[sKey] = {sakhti: iSakht};
        } else {
            sakhtBase.dataOo[sKey].sakhti += iSakht;
            iSakht = sakhtBase.dataOo[sKey].sakhti;
        }
        //c onsole.log(sKey + " changed by " + iSakht);
        sakhtBase.save();
        trCurrent.querySelector("div.sakhti").style = sakhtBase.getCssForStrength(iSakht);
        trCurrent.querySelector("div.sakhti").innerHTML = sakhtBase.prettyStrength(iSakht);
    }
}
const sakhtBase = {
    debounceTimeoutId: null,
    dataOo: {},
    init: function() {
        this.dataOo = sakhtiData;
    },
    save: function() {
        // If the user makes a change, keep buffering until
        // user pauses for more than 800 milliseconds.
        clearTimeout(sakhtBase.debounceTimeoutId);
        sakhtBase.debounceTimeoutId = setTimeout(() => {
            sakhtBase.save_debounced()
        }, 800);
    },
    save_debounced: function() {
        ////////////
        let sFileName = "data/sakhtiData.js"
        let sBody = JSON.stringify(this.dataOo); //, null, 1);
        sBody = sBody
            .split("},\"").join("},\n\"")
            .split(" = {").join(" = {\n")
            ;
        sBody = "let sakhtiData = " + sBody;
        sBody += ";";
        sBody = sBody.split(" = {").join(" = {\n")
        sBody = sBody.split("}};").join("}\n};\n")
        pywriter.save("farsiVocab", sFileName, sBody, sakhtBase.callbackMethod());

        ////////////
    },
    callbackMethod: function() {
        // For future use.
    },
    getByKeyOo: function(sKey) {
        if (!this.dataOo.hasOwnProperty(sKey)) {
            return {sakhti: 0};
        }
        return this.dataOo[sKey];
    },
    getStar: function(sKey) {
//c onsole.error("ood ldaadfda ta");
        return "&star;";
    },
    getResearchLink: function(sKey, oO) {
        let sKeyPretty = sKey.split(" ").join("+");
        let sOut = "<a href=\"https://www.google.com/search?q=literal+translation+of+" + sKeyPretty + "+in+farsi\"";
        sOut += " target=\"farsiResearch\" class=\"tableCellLinkIcon\">";
        sOut += "<img src=\"img/icnLupe.svg\" style=\"width:17px;\">";
        sOut += "</a>"
        return sOut;
    },
    getStarOo: function(sKey, oO) {
        let sStar = "&star;";
        let sCss = "off";
        if ((oO.hasOwnProperty("star")) && (oO.star === 1)) {
            sStar = "&starf;";
            sCss = "on";
        }

        let sOut = "<div onclick=\"sakhtBase.doStarClick(\'" + sKey + "\', this);\" class=\"" + sCss + "\">";
        sOut += sStar + "</div>";
        return sOut;
    },
    doStarClick: function(sKey, uiStar) {
        let oO_ = this.getByKeyOo(sKey);
        if ((oO_.hasOwnProperty("star")) && (oO_.star === 1)) {
            // Currently turned on.
            delete oO_.star;
            uiStar.innerHTML = "&star;";
            uiStar.className = "off";
        } else {
            oO_.star = 1;
            uiStar.innerHTML = "&starf;";
            uiStar.className = "on";
        }
        this.save();
    },
    getIconOo: function(oO) {
        let iStrength = oO.sakhti;
        let sCss = this.getCssForStrength(iStrength);
        let sStrength = this.prettyStrength(iStrength);
        return "<div class=\"sakhti\" style=\"" + sCss + "\">" + sStrength + "</div>";
    },
    prettyStrength: function(iStrength) {
        return (iStrength < 0 ? "<i>&ndash;</i>" : "") + Math.abs(iStrength) + (iStrength < 0 ? "&nbsp; &nbsp;" : "");
    },
    getCssForStrength: function(iStrength) {
        iStrength *= 1; // Make colors change faster;
        let sColorBg = "#F50";
        let sColorTxt = "#fff";
        if (iStrength !== 0) {
            let sStrength = Math.min(Math.abs(iStrength), 15).toString(16);
            sColorBg = "#" + (iStrength >= 0 ? "0fa" : "F08") + sStrength;
            sColorTxt = "#" + (iStrength >= 5 ? "000" : "fff");
        }
        return "color:" + sColorTxt + ";background-color:" + sColorBg + ";";
    }
}
function keyToSakhti(sEventKey) {
    let ix = asArrowKeys.indexOf(sEventKey);
    if (ix === -1) {
        return 0;
    } else if (ix === ARROW.RIGHT) {
        return 1;
    } else if (ix === ARROW.LEFT) {
        return -1;
    }
    return 0;
}
function keyToDistance(sEventKey) {
    let ix = asArrowKeys.indexOf(sEventKey);
    if (ix === -1) {
        return 0;
    } else if (ix === ARROW.UP) {
        return -1;
    } else if (ix === ARROW.DOWN) {
        return 1;
    } else {
        return 0;
    }
}
window.addEventListener('keydown', (event) => {
    if (keyToDistance(event.key) != 0) {
        event.preventDefault();
    }
});
window.addEventListener('keyup', (event) => {
    let iDist = keyToDistance(event.key);
    let iSakhtiChange = keyToSakhti(event.key);
    iSakhtiChange *= event.altKey ? 10 : 1;
    vocab.incrementSakhti(iSakhtiChange); // Before increment.
    if (iDist !== 0) {
        event.preventDefault();
        vocab.next(iDist);
    } else if (event.key === "Escape") {
        vocab.ixVis = -1;
        vocab.doRowClick({id:"tr0000"});
    }
});

document.addEventListener('DOMContentLoaded', function () {
    vocab.init();
});