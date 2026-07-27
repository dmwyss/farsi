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
    userSettings: {lastSort: "sSortP"},
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
            let sForeignKey = oWord.p.key.toLowerCase().split("?").join("");
            if (oDictOut.hasOwnProperty(oWord.p.key)) {
                let iIncrement = 1;
                while (oDictOut.hasOwnProperty(sForeignKey)) {
                    //console.error("trying to set " + oWord.p.key + " again.");
                    sForeignKey = (oWord.p.key + "__" + iIncrement).toLowerCase();
                    iIncrement++;
                }
            }
            let iStrength = sakhtBase.getByKey(sForeignKey);
//debugger;
            oWord.meta = {
                ixOrig: ixCursor++,
                sSortP: oWord.p.key.toLowerCase(),
                sSortE: oWord.e.key.toLowerCase(),
                sSortSakhti: (iStrength + 20)
            };
            oWord.key = sForeignKey;
            oDictOut[sForeignKey] = oWord;
        }
        return oDictOut;
    },
    initList: function() {
        this.list = [];
        for (let sKey in this.dict) {
            this.list.push(this.dict[sKey]);
        }
    },
    toWord: function(sLine) {
        sLine = sLine.trim().split("'").join("~");
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
            + "<td id=\"sSortSakhti\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">sakhti</td>"
            + "</tr>";
        for (let ix = 0; ix < this.list.length; ix++) {
            let oWord = this.list[ix];
            sOut += "<tr onclick='vocab.doRowClick(this);' id='tr" + ix + "' data-key='" + oWord.key + "'>" // " + ix + "
                //+ "<td class=\"word\">" + this.longA(oWord.p.key) + "</td>"
                //+ "<td class=\"word\">" + oWord.e.key  + "</td>"
                + "<td class=\"context colNarrow\">" + (ix + 1) + "</td>"
                + "<td class=\"context\">" + oWord.e.context + "</td>"
                + "<td class=\"context\">" + this.longA(oWord.p.context) + "</td>"
                + "<td class=\"context\">" + sakhtBase.getIcon(oWord.key) + "</td>"
                + "</tr>";
        }
        sOut += "</table>";
        return sOut;
    },
    longA: function (sRaw) {
        return sRaw.split("aa").join("&amacr;").split("~").join("&apos;");
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
        console.log("ixVis :: " + this.ixVis);
        let trNext = document.querySelector("#tr" + this.ixVis);
        this.doRowClick(trNext)
    },
    incrementSakhti: function(iSakht) {
        if (iSakht === 0) {
            console.log("increment == 0");
            return;
        }
debugger;
        let trCurrent = document.querySelector("#tr" + this.ixVis);
        if (trCurrent === null) {
            console.log("no current tr");
            return;
        }
        let sKey = trCurrent.getAttribute("data-key");
        if (!sakhtBase.data.hasOwnProperty(sKey)) {
            sakhtBase.data[sKey] = iSakht;
        } else {
            sakhtBase.data[sKey] += iSakht;
            iSakht = sakhtBase.data[sKey];
        }
        console.log(sKey + " changed by " + iSakht);
        sakhtBase.save();
        trCurrent.querySelector("div.sakhti").style = sakhtBase.getCssForStrength(iSakht);
        trCurrent.querySelector("div.sakhti").innerHTML = sakhtBase.prettyStrength(iSakht);
    }
}
const sakhtBase = {
    data: {},
    init: function() {
        this.data = localStorageManager.get("farsi_cooki_ls", {});
    },
    save: function() {
        localStorageManager.set("farsi_cooki_ls", this.data);
    },
    getByKey: function(sKey) {
        if (!this.data.hasOwnProperty(sKey)) {
            return 0;
        }
        return this.data[sKey];
    },
    //    setDataFromCookie: function() {
    //        this.data = utilCookieJson.get("farsi_cooki");
    //    },
    getIcon: function(sKey) {
        let iStrength = sakhtBase.getByKey(sKey);
        let sCss = this.getCssForStrength(iStrength);
        let sStrength = this.prettyStrength(iStrength);
        return "<div class=\"sakhti\" style=\"" + sCss + "\">" + sStrength + "</div>";
    },
    prettyStrength: function(iStrength) {
        return (iStrength < 0 ? "<i>--</i>" : "") + Math.abs(iStrength) + (iStrength < 0 ? "&nbsp; &nbsp;" : "");
    },
    getCssForStrength: function(iStrength) {
        iStrength *= 3; // Make colors change faster;
        let sColorBg = "#F50";
        let sColorTxt = "#fff";
        if (iStrength !== 0) {
            let sStrength = Math.min(Math.abs(iStrength), 15).toString(16);
            sColorBg = "#" + (iStrength >= 0 ? "0fa" : "000") + sStrength;
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
    vocab.incrementSakhti(keyToSakhti(event.key)); // Before increment.
    if (iDist !== 0) {
        event.preventDefault();
        vocab.next(iDist);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    vocab.init();
});