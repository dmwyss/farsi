const utilAudio = {
    trackCurrent: null,
    tracks: [],
    trackDict: {},
    prefs: {
        loop: true
    },
    init: function() {
        // Sucht alle Elemente, die ein "data-sound"-Attribut besitzen
        const uiAudioGlyphs = document.querySelectorAll('audio');
        let _ix = 0;
        uiAudioGlyphs.forEach(audioObject => {
            // Holt den Pfad zur Sounddatei aus dem Attribut.
            const sSoundUrl = audioObject.getAttribute('src');

            // Überspringt das Element, falls das Attribut leer ist.
            if (!sSoundUrl) return;

            // Erstellt ein unsichtbares Audio-Element für dieses spezifische Steuerelement
            //const audioObject = new Audio(sSoundUrl);
            audioObject.preload = "auto";

            // Ändert den Mauszeiger, damit der Nutzer sieht, dass es anklickbar ist
            //uiWrapper.style.cursor = 'pointer';

            // Fügt das Klick-Event hinzu
            /*
            uiWrapper.addEventListener('click', () => {
                // Setzt den Ton zurück an den Anfang (für schnelles mehrfaches Klicken)
                let isPlaying = utilAudio.isPlaying(audioObject);
                utilAudio.trackCurrent = audioObject;
//d ebugger;
                if (isPlaying) {
                    audioObject.pause();
                    uiWrapper.querySelector("svg #speaker").style.fill = "transparent";
                } else {
                    audioObject.loop = utilAudio.prefs.loop;
                    // Spielt den Sound ab.
                    audioObject.play().catch(error => {
                        console.error("Audio-Wiedergabe fehlgeschlagen:", error);
                    });
                    uiWrapper.querySelector("svg #speaker").style.fill = "black";
                }
            });
            */
            // Add to list of tracks.
            let uiWrapper = utilAudio.wrapElementGetParent(audioObject);
            let sId = sSoundUrl.substring(sSoundUrl.lastIndexOf('/') + 1);
            sId = sId.replace(/[\. \-]/gi, '_');
            let oTemp = {
                id: sId,
                ix: _ix++,
                audio: audioObject,
                ui: uiWrapper
            };
            utilAudio.tracks.push(oTemp);
            utilAudio.trackDict[sId] = oTemp;
        });
    },
    isPlaying: function(audio) {
        return !audio.paused && !audio.ended && audio.currentTime > 0;
    },
    wrapElementGetParent: function(element) {
        // 1. Neues Elternelement erstellen
        const newParent = document.createElement("div");
        // 2. Das neue Elternelement direkt vor dem bestehenden Element einfügen
        element.parentNode.insertBefore(newParent, element);
        // 3. Das bestehende Element in das neue Elternelement verschieben
        newParent.appendChild(element);
        return newParent;
    }
}

// Startet die Funktion automatisch, sobald das HTML-Dokument vollständig geladen ist
document.addEventListener('DOMContentLoaded', utilAudio.init);