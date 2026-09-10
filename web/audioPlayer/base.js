let audio = null;
let playPauseBtn = null;
let playIcon = null;
let backBtn = null;
let forwardBtn = null;
let timeline = null;
let currentTimeDisplay = null;
let durationTimeDisplay = null;
let trackTitle = null;
let loopButton = null;
const iTimeJumpSec = 8;
const LOOP_NONE = 0;
const LOOP_ONCE = 1;
const LOOP_ALL = 2;

function doOnLoad() {
    customAudio = document.getElementById('custom-audio');
    playPauseBtn = document.getElementById('btn-play-pause');
    playIcon = document.getElementById('play-icon');
    backBtn = document.getElementById('btn-back');
    forwardBtn = document.getElementById('btn-forward');
    timeline = document.getElementById('timeline');
    currentTimeDisplay = document.getElementById('current-time');
    durationTimeDisplay = document.getElementById('duration-time');
    trackTitle = document.getElementById('track-title');
    loopButton = document.getElementById('loopButton');

    playPauseBtn.addEventListener('click', togglePlay);

    customAudio.addEventListener('loadedmetadata', () => {
        timeline.max = customAudio.duration;
        durationTimeDisplay.textContent = formatTime(customAudio.duration);
    });

    if (customAudio.readyState >= 1) {
        timeline.max = customAudio.duration;
        durationTimeDisplay.textContent = formatTime(customAudio.duration);
    }
    // Update timeline as the audio plays. If it has ended, play the ting.
    customAudio.addEventListener('timeupdate', () => {
        timeline.value = customAudio.currentTime;
        currentTimeDisplay.textContent = formatTime(customAudio.currentTime);
        if (Math.floor(customAudio.duration) === Math.floor(customAudio.currentTime)) {
            // Not 100% sure about this. The test above runs hundreds of times.
            ting();
        }
    });
    // Do next thing after playing. Depends on loop mode setting.
    customAudio.addEventListener('ended', () => {
        // Create and configure the new audio instance
        ting();
        console.log(audioPlayer.sFileUrlBase + "oof.mov ");
        if (userPrefs.data.iLoopMode === LOOP_ALL) {
            trackList.doGoNextRow();
            playPauseBtn.click();
        }
    }),
    // Show current time.
    timeline.addEventListener('input', () => {
        customAudio.currentTime = timeline.value;
        currentTimeDisplay.textContent = formatTime(timeline.value);
    });
    // React to back button click.
    backBtn.addEventListener('click', () => {
        customAudio.currentTime = Math.max(0, customAudio.currentTime - 10);
    });
    // React to forward button click.
    forwardBtn.addEventListener('click', () => {
        customAudio.currentTime = Math.min(customAudio.duration, customAudio.currentTime + 10);
    });
    // Set up keyboard controls.
    window.addEventListener('keydown', (event) => {
        if ([' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
        switch (event.key) {
        case ' ':
            togglePlay();
            break;
        case 'ArrowLeft':
            customAudio.currentTime = Math.max(0, customAudio.currentTime - iTimeJumpSec);
            break;
        case 'ArrowRight':
            customAudio.currentTime = Math.min(customAudio.duration, customAudio.currentTime + iTimeJumpSec);
            break;
        case 'ArrowDown':
            trackList.doGoNextRow(1);
            break;
        case 'ArrowUp':
            trackList.doGoNextRow(-1);
            break;
        }
    });
    userPrefs.init();
    trackList.init().drawTable();
    audioPlayer.init();
}
function ting() {
    if (window.isBeepPlayed) {
        return;
    }
    const completionSound = new Audio(audioPlayer.sFileUrlBase + "ting.mp3");
    completionSound.play();
    window.isBeepPlayed = true;
    setTimeout(function() {window.isBeepPlayed = false}, 2000);
}
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
function togglePlay() {
    if (customAudio.paused) {
        customAudio.loop = userPrefs.data.iLoopMode === LOOP_ONCE;
        customAudio.play();
        playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
        playPauseBtn.classList.add('stop-main');
        console.log("seconds: " + Math.round(customAudio.duration));
        timeline.style.backgroundColor = "var(--color-accent)";
    } else {
        customAudio.pause();
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        playPauseBtn.classList.remove('stop-main');
        timeline.style.backgroundColor = "var(--color-bad)";
    }
    setTimeout(function(){timeline.style.backgroundColor = "var(--color-grey-muted-full)";}, 100);
}
const audioPlayer = {
    sFileUrlBase: "../audio/",
    init: function() {
        let trCurrent = null;
        if ((typeof userPrefs.data.iLoopMode === "undefined") || (userPrefs.data.iLoopMode === null)) {
            userPrefs.set("iLoopMode", 0);
        }
        // Assume you can find the target tr. It may not exist...
        trCurrent = document.querySelector("#" + userPrefs.data.sCurrentId);
        if (
        (typeof userPrefs.data.sCurrentId === "undefined")
        || (userPrefs.data.sCurrentId === null)
        || (trCurrent === null)
        ) {
            trCurrent = document.querySelectorAll("#trackList table tr")[0];
            trackList.setCurrentId(trCurrent.id);
        //} else {
        }
        trCurrent.click(); // Change to go direct from trackList.doRowClick();
        return this;
    },
    setTrack: function(sId) {
        if (!customAudio.paused) {
            togglePlay();
        }
        trackCurr = trackList.dict[sId];
        trackTitle.innerHTML = trackCurr.name;
        customAudio.src = this.sFileUrlBase + trackCurr.file;
    },
    doClickLoopButton: function(uiSrc) {
debugger;
        userPrefs.set("iLoopMode", (++userPrefs.data.iLoopMode % 3));
        customAudio.loop = (userPrefs.data.iLoopMode === LOOP_ONCE);
        this.updateLoopButtonUi();
    },
    updateLoopButtonUi: function() {
        loopButton.className = "loopMode" + userPrefs.data.iLoopMode;
    }
}
const trackList = {
    uiWrapper: null,
    dict: { /* built during init() from data */ },
    data: [],
    init: function() {
        this.data = trackListData;
        this.uiWrapper = document.querySelector("#trackList");
        for (let ixAF = 0; ixAF < this.data.length; ixAF++) {
            let oAF = this.data[ixAF];
            oAF.id = oAF.file.split(".").join("_")
            oAF.name = oAF.file.substring(0, oAF.file.lastIndexOf(".")).replace(/[_\-\.]/g, ' ');
            oAF.ix = ixAF;
            this.dict[oAF.id] = oAF;
        }
        return this;
    },
    drawTable: function() {
        let sOut = "<table>";
        for (let ixAF = 0; ixAF < this.data.length; ixAF++) {
            let oAF = this.data[ixAF];
            let sFlat = oAF.id;
            let sTimePretty = "&nbsp;";
            if (oAF.secs !== null) {
                sTimePretty = formatTime(oAF.secs);
            }
            sOut += "<tr onclick=\"trackList.doRowClick(this);\" ondblclick=\"trackList.doRowClick(this);togglePlay();\" id=\"" + sFlat + "\"><td>" + oAF.name + "</td><td>" + sTimePretty + "</td></tr>"
        }
        sOut += "</table>";
        this.uiWrapper.innerHTML = sOut;
    },
    state: {
        uiTrCurr: null
    },
    setCurrentId: function(sId) {
        userPrefs.set("sCurrentId", sId);
    },
    getCurrentId: function() {
        if (!userPrefs.data.hasOwnProperty("sCurrentId")) {
            return null;
        }
        return userPrefs.data.sCurrentId;
    },
    doRowClick: function(uiTrClicked) {
        if (this.state.uiTrCurr === uiTrClicked) {
            return;
        }
        if (this.state.uiTrCurr != null) {
            this.state.uiTrCurr.className = "";
        }
        uiTrClicked.className = "on";
        this.state.uiTrCurr = uiTrClicked;
        audioPlayer.setTrack(uiTrClicked.id);
        this.setCurrentId(uiTrClicked.id);
    },
    doGoNextRow: function(iDirection=1) {
        let oTrackNext = null;
        if (userPrefs.data.sCurrentId === null) {
            oTrackNext = trackListData[0];
        } else {
            try {
                let ixTrackNext = ((this.dict[userPrefs.data.sCurrentId].ix + iDirection) % trackListData.length);
                oTrackNext = trackListData[ixTrackNext];
            } catch (e) {
                oTrackNext = trackListData[0];
            }
        }
        // Get the new one.
        let isWasPlaying = !customAudio.paused;
        uiNext = document.querySelector("#" + oTrackNext.id)
        this.doRowClick(uiNext);
        if (isWasPlaying) {
            togglePlay(); // Will only start play. Newly set track is always stopped when selected.
        }
    }
}
const userPrefs = {
    data: {
        iLoopMode: 0,
        sCurrentId: null
    },
    init: function() {
        //TODO load data from localstore.
        this.data = localStorageManager.get("localStoreAudioImpl", this.data);
        audioPlayer.updateLoopButtonUi();
    },
    set: function(sAttr, vSetting) {
        this.data[sAttr] = vSetting;
        localStorageManager.set("localStoreAudioImpl", this.data);
    }
}