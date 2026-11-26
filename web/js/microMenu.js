const oMicroMenuData = [
    { id: "researchLiteral", sLabel: "Literal Translation" },
    { id: "researchInformal", sLabel: "Check Formality" },
    { id: "flag", sLabel: "Toggle Flag" },
    { id: "info", sLabel: "Info..." }
];

const microMenuManager = {
    menuEl: null,
    sTrFocusDataKey: null,
    init(items) {
        // Create the floating menu container once
        this.menuEl = document.createElement('div');
        this.menuEl.id = 'microMenuDropdown';
        document.body.appendChild(this.menuEl);

        // Populate options from data
        items.forEach(item => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'microMenuItem';
            optionDiv.textContent = item.sLabel;

            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clickOption(item.id, item.sLabel);
                this.close();
            });

            this.menuEl.appendChild(optionDiv);
        });

        // Automatically close when the mouse moves away from the menu
        this.menuEl.addEventListener('mouseleave', () => {
            this.close();
        });

        /*
        // Attach click listeners to all microMenu cells
        document.querySelectorAll('td.microMenu').forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.open(e.currentTarget);
            });
        });
        */
    },

    open(targetCell) {
        //const trParent = targetCell.parentElement.parentElement;
        const trParent = targetCell.closest("tr");
        this.sTrFocusDataKey = trParent.getAttribute("data-key");
        const rect = targetCell.getBoundingClientRect();
        this.menuEl.style.display = 'block';
        // Position slightly overlapping the cell so the mouse starts inside the menu
        this.menuEl.style.left = `${window.scrollX + rect.left - 14}px`;
        this.menuEl.style.top = `${window.scrollY + rect.top + 20}px`;
    },

    close() {
        this.sTrFocusDataKey = null;
        if (this.menuEl) {
            this.menuEl.style.display = 'none';
        }
    },

    clickOption(id, sLabel) {
        console.log(`Clicked option -> ID: ${id}, Label: ${sLabel}, for object: ${microMenuManager.sTrFocusDataKey}`);
        let sContextText = vocab.dict[microMenuManager.sTrFocusDataKey].sP;
        let sContextTextQS = this.stripForQueryString(sContextText);
        // This makes error message appear: udm=50&
        if (id === "researchLiteral") {
            let sUrl = "https://www.google.com/search?q=farsi+(persian)+literal+translation+of+" + sContextTextQS + "";
            window.open(sUrl, '_berim', 'noopener,noreferrer');
        } else if (id === "researchInformal") {
            let sUrl = "https://www.google.com/search?q=is+this+grammatically+correct+natural+sounding+informal+farsi+%22" + sContextTextQS + "%22";
            window.open(sUrl, '_berim', 'noopener,noreferrer');
        } else if (id === "flag") {
            console.log("flag: " + microMenuManager.sTrFocusDataKey);
            let uiStar = document.querySelector("[data-key=\"" + microMenuManager.sTrFocusDataKey + "\"] div[role=\"star\"]");
            sakhtBase.toggleFlag(microMenuManager.sTrFocusDataKey, uiStar);
        } else if (id === "info") {
            alert("Vocab Entry\n\nID: " + microMenuManager.sTrFocusDataKey)
        }
    },
    stripForQueryString: function(sIn) {
        return encodeURIComponent(sIn.replaceAll(/[*~]/g, ""));
    }
};
