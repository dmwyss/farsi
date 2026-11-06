/*
    const groopData = [
        {iId: 1, sLabel: "Focus"},
        {iId: 3, sLabel: "Barfi"},
        {iId: 2, sLabel: "Dars 01"},
        {iId: 5, sLabel: "Dars 03"},
        {iId: 4, sLabel: "Fun"}
    ];
*/
const menuMaker = {
    dict: {},
    groopCurr: null,
    renderMenu: function(targetDivId, menuData) {
        const targetDiv = document.getElementById(targetDivId);
        if (!targetDiv) {
            console.error(`Element mit ID "${targetDivId}" wurde nicht gefunden.`);
            return;
        }

        // 1. Erstelle ein umschließendes Wrapper-Div
        const wrapper = document.createElement('div');
        wrapper.className = 'menuMakerWrapper';

        // **NEU:** Wenn die Maus den gesamten Menübereich verlässt, schließe das Menü
        wrapper.addEventListener('mouseleave', () => {
            wrapper.classList.remove('open');
        });

        // 2. Erstelle das Label-Div ("Groups")
        const labelDiv = document.createElement('div');
        labelDiv.className = 'menuMakerLabel';
        labelDiv.textContent = 'Groups';

        // Klick-Event für das Label
        labelDiv.addEventListener('click', () => {
            wrapper.classList.toggle('open');
        });

        // 3. Erstelle das Menü (ul)
        const ul = document.createElement('ul');
        ul.className = 'customMenuMaker';

        // Schleife durch die Daten
        //let ixItem = 0;
        menuData.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.sLabel;

            li.addEventListener('click', () => {
                this.doMenuItemClick(item.iId);
                wrapper.classList.remove('open');
            });
            this.dict[item.iId] = item;
            ul.appendChild(li);
        });

        // Alles im Wrapper zusammenbauen
        wrapper.appendChild(labelDiv);
        wrapper.appendChild(ul);

        // In das Ziel-Div einhängen
        targetDiv.appendChild(wrapper);
        return this;
    },
    setValue: function(iItemId) {
        this.groopCurr = this.dict[Object.keys(this.dict)[0]];
        if (this.dict.hasOwnProperty(iItemId)) {
            this.groopCurr = this.dict[iItemId];
        }
        let uiLabel = document.querySelector("#menuContainer .menuMakerWrapper .menuMakerLabel");
        uiLabel.innerHTML = this.groopCurr.sLabel;

//        vocab.updateUserSetting("iIdStarCurr", parseInt(uiSrc.getAttribute("data-id")));
        vocab.updateUserSetting("iIdStarCurr", iItemId);
        vocab.renderVocabTable();
    },
    doMenuItemClick: function(iItemId) {
        console.log("Menü-ID geklickt:", iItemId);
        // const outputDiv = document.getElementById('output');
        // outputDiv.style.display = 'block';
        // outputDiv.innerHTML = `Du hast das Menü-Item mit der <strong>ID: ${iItemId}</strong> angeklickt.`;
        console.log(this.dict[iItemId].iId + " == " + this.dict[iItemId].sLabel);
        this.setValue(iItemId);
    }
};