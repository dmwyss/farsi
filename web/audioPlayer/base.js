let audio = null;
let playPauseBtn = null;
let playIcon = null;
let backBtn = null;
let forwardBtn = null;
let timeline = null;
let currentTimeDisplay = null;
let durationTimeDisplay = null;
let trackTitle = null;
const iTimeJumpSec = 8;

let trackListData = [
    {id: "vocab_01.mp3", secs: 150},
    {id: "vocab_04_top60_0727.mp3", secs: 821},
    {id: "vocab_05_top100_0808.m4a", secs: 821}
];

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

    playPauseBtn.addEventListener('click', togglePlay);

    customAudio.addEventListener('loadedmetadata', () => {
        timeline.max = customAudio.duration;
        durationTimeDisplay.textContent = formatTime(customAudio.duration);
    });

    if (customAudio.readyState >= 1) {
        timeline.max = customAudio.duration;
        durationTimeDisplay.textContent = formatTime(customAudio.duration);
    }

    customAudio.addEventListener('timeupdate', () => {
        timeline.value = customAudio.currentTime;
        currentTimeDisplay.textContent = formatTime(customAudio.currentTime);
    });

    timeline.addEventListener('input', () => {
        customAudio.currentTime = timeline.value;
        currentTimeDisplay.textContent = formatTime(timeline.value);
    });

    backBtn.addEventListener('click', () => {
        customAudio.currentTime = Math.max(0, customAudio.currentTime - 10);
    });

    forwardBtn.addEventListener('click', () => {
        customAudio.currentTime = Math.min(customAudio.duration, customAudio.currentTime + 10);
    });

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
        }
    });
    trackList.init().drawTable();
    audioPlayer.init();
}


function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function togglePlay() {
    if (customAudio.paused) {
        customAudio.loop = audioPlayer.isLoop;
        customAudio.play();
        playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else {
        customAudio.pause();
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
    timeline.style.backgroundColor = "#FFF";
    setTimeout(function(){timeline.style.backgroundColor = "#404040";}, 100);
}
const audioPlayer = {
    sFileUrlBase: "../audio/",
    init: function() {
        /*
        const sIdZero = trackList.data[0].id;
        this.setTrack(sIdZero);
        */
        let trPrevious = null;
        if (trackList.sPreviousId === null) {
            trPrevious = document.querySelectorAll("#trackList table tr")[0];
            trackList.setPreviousId(trPrevious.id);
        } else {
            trPrevious = document.querySelectorAll("#" + trackList.sPreviousId);
        }
        trPrevious.click();
        return this;
    },
    setTrack: function(sId) {
        if (!customAudio.paused) {
            togglePlay();
        }
        trackCurr = trackList.dict[sId];
        trackTitle.innerHTML = trackCurr.id;
        customAudio.src = this.sFileUrlBase + trackCurr.id;
    }
}
const trackList = {
    uiWrapper: null,
    sPreviousId: null,
    setPreviousId: function(sId) {
        this.sPreviousId = sId;
        //TODO: Store in localstorage.
    },
    init: function() {
        this.data = trackListData;
        this.uiWrapper = document.querySelector("#trackList");
        for (let ixAF = 0; ixAF < this.data.length; ixAF++) {
            let oAF = this.data[ixAF];
            this.dict[oAF.id] = oAF;
        }
        return this;
    },
    drawTable: function() {
        let sOut = "<table>";
        for (let ixAF = 0; ixAF < this.data.length; ixAF++) {
            let oAF = this.data[ixAF];
            sOut += "<tr onclick=\"trackList.doRowClick(this);\" ondblclick=\"trackList.doRowClick(this);togglePlay();\" id=\"" + oAF.id + "\"><td>" + oAF.id + "</td><td>" + formatTime(oAF.secs) + "</td></tr>"
        }
        sOut += "</table>";
        this.uiWrapper.innerHTML = sOut;
    },
    state: {
        uiTrCurr: null
    },
    dict: { /* built during init() from data */},
    data: [],
    doRowClick: function(uiTrClicked) {
        if (this.state.uiTrCurr === uiTrClicked) {
            // customAudio.play(); // Does not work. Probably timing issue.
            return;
        }
        if (this.state.uiTrCurr != null) {
            this.state.uiTrCurr.className = "";
        }
        uiTrClicked.className = "on";
        this.state.uiTrCurr = uiTrClicked;
        audioPlayer.setTrack(uiTrClicked.id);
    }
}
