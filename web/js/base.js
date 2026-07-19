const vocab = {
    dict: null,
    list: null, // Sorted array. Gets resorted a lot.
    sLastSortField: "UNSET",
    ixVis: -1,
    init: function() {
        this.dict = this.parseRaw();
        this.initList();
        this.render();
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
            let sForeignKey = oWord.p.key;
            if (oDictOut.hasOwnProperty(oWord.p.key)) {
                let iIncrement = 1;
                while (oDictOut.hasOwnProperty(sForeignKey)) {
                    //console.error("trying to set " + oWord.p.key + " again.");
                    sForeignKey = oWord.p.key + "__" + iIncrement;
                    iIncrement++;
                }
            }
            oWord.meta = {
                ixOrig: ixCursor++,
                sSortP: oWord.p.key.toLowerCase(),
                sSortE: oWord.e.key.toLowerCase()
            };
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
        sLine = sLine.trim();
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
            oOut.context = "";
        } else {
            oOut.key = as[1];
            oOut.context = as[0] + "<b class=\"context\">" + as[1] + "</b>" + as[2];
        }
        return oOut;
    },
    vocabToHtml: function() {
        let sOut = "<table id=\"vocab\">"
        sOut += "<tr><td id=\"sSortP\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">"
            + "farsi</td>"
            + "<td id=\"sSortE\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">"
            + "english</td>"
            + "<td id=\"ixOrig\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">"
            + "context</td>"
            + "<td id=\"ixOrig\" class=\"colSorter\" onclick=\"vocab.clickColSort(this);\">"
            + "context</td>"
            + "</tr>";
        for (let ix = 0; ix < this.list.length; ix++) {
            let oWord = this.list[ix];
            sOut += "<tr onclick='vocab.doRowClick(this);' id='tr" + ix + "'>" // " + ix + "
                + "<td class=\"word\">" + this.longA(oWord.p.key) + "</td>"
                + "<td class=\"word\">" + oWord.e.key  + "</td>"
                + "<td class=\"context\">" + this.longA(oWord.p.context) + "</td>"
                + "<td class=\"context\">" + oWord.e.context  + "</td>"
                + "</tr>";
        }
        sOut += "</table>";
        return sOut;
    },
    longA: function (sRaw) {
        return sRaw.split("aa").join("&amacr;")
    },
    clickColSort: function (uiSrc) {
        //        this.list = this.sort(this.sortCompare)
        let sSortField = uiSrc.id; // "sSortE";
        if (sSortField === this.sLastSortField) {
            this.list.reverse();
        } else {
            this.list.sort((a, b) => (a.meta[sSortField] > b.meta[sSortField] ? 1 : -1));
        }
        this.sLastSortField = sSortField;
        this.render();
    },
    render: function () {
        this.uiVocab = document.querySelector("#vocab");
        this.uiVocab.innerHTML = this.vocabToHtml();
    },
    doRowClick: function(oRow) {
        let tbl = document.querySelector("table#vocab");
        let atr = tbl.querySelectorAll("tr");
        let isFound = false;
        let sOpacity = "1.0";
        let ixRowClicked = parseInt(oRow.id.split("tr")[1]);
        this.ixVis = ixRowClicked;
        for (let ixTr = 0; ixTr < atr.length; ixTr++) {
            let atd = atr[ixTr].querySelectorAll("td");
            atd[0].style.opacity = sOpacity;
            atd[2].style.opacity = sOpacity;
            if (!isFound) {
                if (atr[ixTr] === oRow) {
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
    }
}
function keyToDistance(sEventKey) {
    const fruits = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
    let ix = fruits.indexOf(sEventKey);
    if (ix === -1) {
        return 0;
    } else if (ix < 2) {
        return -1;
    } else {
        return 1;
    }
}
window.addEventListener('keydown', (event) => {
    if (keyToDistance(event.key) != 0) {
        event.preventDefault();
    }
});
window.addEventListener('keyup', (event) => {
    let iDist = keyToDistance(event.key);
    if (iDist !== 0) {
        event.preventDefault();
        vocab.next(iDist);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    vocab.init();
});