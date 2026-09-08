const EN = 0;
const FA = 1;
const ARROW = {
    LEFT:  0,
    UP:    1,
    RIGHT: 2,
    DOWN:  3
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
    userSettings: {
        lastSort: "sSortSakhti",
        testMode: "read"
    },
    testModeButton: null,
    init: function() {
        //sakhtBase.setDataFromCookie();
        sakhtBase.init();
        this.userSettings = localStorageManager.get("user_settings", this.userSettings);

        console.log(this.userSettings);

        this.dict = this.parseRaw();
        this.initList();
        this.render();
        this.clickColSort(this.userSettings.lastSort);
        this.testModeButton = document.querySelector("#toggleTestMode");
        this.testModeButton.innerHTML = "mode:" + this.userSettings.testMode;
        sakhtBase.collectGarbage();
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
        sLine = charTamer.toNice(sLine); // sLine.trim().split("'").join("~").split("\"").join("#");
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
            oOut.context = "<b class=\"context\">" + charTamer.toNaughty(as[0]) + "</b>";
        } else {
            oOut.key = as[1];
            oOut.context = as[0] + "<b class=\"context\">" + charTamer.toNaughty(as[1]) + "</b>" + charTamer.toNaughty(as[2]);
        }
        return oOut;
    },
    filter: null, // currently only works on star. Later filter like this: {object:"sakhtBase", fieldName: "title", find:"xxx"},
    vocabToHtml: function() {
        let sButtons = "<div id=\"buttonRibbon\">"
            + "<button id=\"toggleTestMode\" onclick=\"vocab.toggleTestMode();\">test</button>"
            + "</div>";
        let sOut = "<table id=\"vocab\">";
        let sStarIcon = this.filter === null ? "&star;" : "&starf;";
        sOut += "<tr>"
            + "<td id=\"sNum\" class=\"colSorter colNarrow\">#</td>"
            + "<td id=\"sSortE\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">engelisi</td>"
            + "<td id=\"sSortP\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">farsi</td>"
            + "<td id=\"sSortResearch\" class=\"colSorter colNarrow\">&nbsp;</td>"
            + "<td id=\"sSortStar\" class=\"colSorter colNarrow\" onclick=\"vocab.toggleStarFilter(this);\">" + sStarIcon + "</td>"
            + "<td id=\"sSortSakhti\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">sakhti</td>"
            + "</tr>";
        let iShownRows = 1;
        for (let ix = 0; ix < this.list.length; ix++) {
            let oWord = this.list[ix];
            let oSakht = sakhtBase.getByKeyOo(oWord.key);
            if (this.filter !== null) {
                if (!oSakht.hasOwnProperty("star")) {
                    continue;
                }
            }
            sOut += "<tr onclick='vocab.doRowClick(this);' id='tr" + ix + "' data-key='" + oWord.key + "'>" // " + ix + "
                + "<td class=\"context colNarrow\">" + iShownRows++ + "</td>"
                + "<td class=\"context\">" + charTamer.toNaughty(oWord.e.context) + "</td>"
                + "<td class=\"context\">" + charTamer.toNaughty(oWord.p.context) + "</td>"
                + "<td class=\"context colNarrow\">" + sakhtBase.getResearchLink(oWord.key, oSakht) + "</td>"
                + "<td class=\"context colNarrow\">" + sakhtBase.getStarOo(oWord.key, oSakht) + "</td>"
                + "<td class=\"context\">" + sakhtBase.getIconOo(oSakht) + "</td>"
                + "</tr>";
        }
        sOut += "</table>";
        return sButtons + sOut;
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
        this.uiVocab = document.querySelector("#vocabWrapper");
        this.uiVocab.innerHTML = this.vocabToHtml();
    },
    rowHighlited: null,
    doRowClick: function(oRow) {
        let tbl = document.querySelector("table#vocab");
        let atr = tbl.querySelectorAll("tr");
        let isFound = false;
        let sOpacity = "1.0";
        let sOpacityAfterCurrent = (this.userSettings.testMode === "test") ? "0.0" : "1.0";
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
                    oRow.style.backgroundColor = "#FFF2";
                    if (false) {
                        setTimeout(
                            function() {
                                oRow.style.backgroundColor = "inherit";
                            }, 500
                        )
                    }
                    this.rowHighlited = oRow;
                    isFound = true;
                    sOpacity = sOpacityAfterCurrent;
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
            return -40;
        } else if (isOffBottom) {
            return 40;
        }
        return 0;
    },
    incrementSakhti: function(iSakht) {
        if (iSakht === 0) {
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
        sakhtBase.save();
        trCurrent.querySelector("div.sakhti").style = sakhtBase.getCssForStrength(iSakht);
        trCurrent.querySelector("div.sakhti").innerHTML = sakhtBase.prettyStrength(iSakht);
    },
    toggleTestMode: function() {
        this.userSettings.testMode = (this.userSettings.testMode === "test") ? "read" : "test";
        this.testModeButton.innerHTML = "mode:" + this.userSettings.testMode;
        localStorageManager.set("user_settings", this.userSettings);
        this.next(0);
    },
    toggleStarFilter: function(uiSrc) {
        //let sIcon = "&star;";
        if (vocab.filter === null) {
            vocab.filter = {};
            //sIcon = "&starf;";
        } else {
            vocab.filter = null;
        }
        //uiSrc.innerHTML = sIcon;
        vocab.render();
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
        let sOut = "<div role=\"star\" onclick=\"sakhtBase.doStarClick(\'" + sKey + "\', this);\" class=\"" + sCss + "\">";
        sOut += sStar + "</div>";
        return sOut;
    },
    doStarClickFromKeyEvent: function() {
        if (vocab.rowHighlited === null) {
            return;
        }
        let trCurr = vocab.rowHighlited;
        let sDataKey = trCurr.getAttribute("data-key");
        let uiStar = trCurr.querySelector("[role=star]");
        this.doStarClick(sDataKey, uiStar);
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
            sColorTxt = "#FFF"; // + (iStrength >= 5 ? "000" : "fff");
        }
        return "color:" + sColorTxt + ";background-color:" + sColorBg + ";";
    },
    collectGarbage: function() {
        /*
        Keys are based on the farsi text.
        If the FA (farsi) text gets changed, a new key is created,
        and an EN orphan is left without a FA. This function looks for
        orphaned sakht items and removes them.
        */
        for (let sKey in this.dataOo) {
            if (!vocab.dict.hasOwnProperty(sKey)) {
                delete this.dataOo[sKey];
            }
        }
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
const charTamer = {
    data: [
    /* naughty, nice */
        ["\"",  "^"],
        ["\'",  "~"],
    ],
    toNice: function(sIn, isNice=true) {
        for (const [findText, replaceText] of this.data) {
            if (isNice) {
                sIn = sIn.replaceAll(findText, replaceText);
            } else {
                sIn = sIn.replaceAll(replaceText, findText);
            }
        }
        return sIn;
    },
    toNaughty: function(sIn) {
        return this.toNice(sIn, false);
    }
}
window.addEventListener('keydown', (event) => {
    if (keyToDistance(event.key) != 0) {
        event.preventDefault();
    } else if (event.key === " ") {
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
    } else if (event.key === " ") {
        event.preventDefault();
        sakhtBase.doStarClickFromKeyEvent();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    vocab.init();
});