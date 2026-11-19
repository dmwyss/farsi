const oMicroMenuData = [
    { id: "researchLiteral", sLabel: "Literal Translation" },
    { id: "flag", sLabel: "Toggle Flag" }
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
        //alert(`Selected: ${sLabel} (ID: ${id}) object: ${microMenuManager.sTrFocusDataKey}`);
        if (id === "researchLiteral") {
            let sUrl = "https://www.google.com/search?q=literal+translation+of+%22" + microMenuManager.sTrFocusDataKey + "%22+in+farsi";
            window.open(sUrl, '_berim', 'noopener,noreferrer');
        } else if (id === "flag") {
            console.log("flag: " + microMenuManager.sTrFocusDataKey);
debugger;

            let uiStar = document.querySelector("[data-key=\"" + microMenuManager.sTrFocusDataKey + "\"] div[role=\"star\"]");
            sakhtBase.toggleFlag(microMenuManager.sTrFocusDataKey, uiStar);
        }
    }
};

