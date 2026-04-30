const vocab = {
    dict: null,
    list: null, // Sorted array. Gets resorted a lot.
    sLastSortField: "UNSET",
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
            if (oDictOut.hasOwnProperty(oWord.p.key)) {
                console.error("trying to set " + oWord.p.key + " again.");
            }
            oWord.meta = {
                ixOrig: ixCursor++,
                sSortP: oWord.p.key.toLowerCase(),
                sSortE: oWord.e.key.toLowerCase()
            };
            oDictOut[oWord.p.key] = oWord;
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
            .replaceAll(/\s+/gi, " ")
            .replaceAll(/\s*,\s*/gi, ",")
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
        let sOut = "<table>"
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
            sOut += "<tr>"
                + "<td>" + oWord.p.key + "</td>"
                + "<td>" + oWord.e.key  + "</td>"
                + "<td>" + oWord.p.context  + "</td>"
                + "<td>" + oWord.e.context  + "</td>"
                + "</tr>";
        }
        sOut += "</table>";
        return sOut;
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
    }
}

document.addEventListener('DOMContentLoaded', function () {
    vocab.init();
});