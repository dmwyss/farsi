
const timeBar = {
    countdownIntervalId: null,
    initialDurationInSeconds: 0,
    currentSecondsRemaining: 0,
    targetRepeatLimit: 1,
    successfulIntervalsCount: 0,
    cumulativeElapsedSecondsCount: 0,
    audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
    init: function() {
        const cachedConfig = localStorage.getItem("timerSettings");
        if (cachedConfig) {
            try {
                const parsed = JSON.parse(cachedConfig);
                if (parsed && parsed.duration) {
                    document.getElementById("timeInput").value = parsed.duration;
                    document.getElementById("repeatsInput").value = parsed.repeats;
                }
            } catch (e) {
                console.error("Error parsing stored config data", e);
            }
        }
        timeBar.resetDisplayToInputs();
        return this;
    },
    getHtml: function() {
        return `
            <div id="timeBar">
                <div class="timer-card contracted" id="timerCard">
                    <div class="header-row">
                        <div class="time-left" id="clockDisplay" onclick="timeBar.handleActionClick()">00:00</div>
                        <button class="toggle-btn" id="toggleBtn" onclick="timeBar.toggleCardLayout()">+</button>
                    </div>
                    <div id="progressBarWrap">
                        <div id="progressBarBar"></div>
                    </div>
                    <div class="collapsible-content" id="collapsibleArea">
                        <div class="inputs-inline">
                            <div class="input-group">
                                <label for="timeInput">Duration</label>
                                <input type="text" id="timeInput" value="5:00">
                            </div>
                            <div class="input-group">
                                <label for="repeatsInput">Repeats</label>
                                <input type="number" id="repeatsInput" value="1" min="1">
                            </div>
                        </div>
                        <button id="actionBtn" class="action-btn btn-start" onclick="timeBar.handleActionClick()">Start</button>
                        <div class="stats">
                            <div><span id="counterDisplay">0</span> completed</div>
                            <div><span id="totalSecondsDisplay">0</span> sec elapsed</div>
                        </div>
                        <button id="floatBtn" class="" onclick="timeBar.floatInWindow()">Float</button>
                    </div>
                </div>
            </div>
        `
    },
    playBeepSound: function(iFreq=880) {
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(iFreq, this.audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.2);
    },
    resetDisplayToInputs: function() {
        const rawTimeValue = document.getElementById("timeInput").value.trim();
        let seconds = 0;
        if (rawTimeValue.includes(":")) {
            const segments = rawTimeValue.split(":");
            seconds = (parseInt(segments[0], 10) || 0) * 60 + (parseInt(segments[1], 10) || 0);
        } else {
            seconds = parseInt(rawTimeValue, 10) || 0;
        }
        this.updateClockDisplay(seconds);
        document.getElementById("counterDisplay").innerText = "0";
        document.getElementById("totalSecondsDisplay").innerText = "0";
    },
    handleActionClick: function() {
        if (this.countdownIntervalId) {
            this.stopTimerEngine();
        } else {
            this.startTimerEngine();
        }
    },
    startTimerEngine: function() {
        this.resetDisplayToInputs();
        const rawTimeValue = document.getElementById("timeInput").value.trim();
        const rawRepeatsValue = parseInt(document.getElementById("repeatsInput").value, 10);
        this.targetRepeatLimit = isNaN(rawRepeatsValue) || rawRepeatsValue < 1 ? 1 : rawRepeatsValue;
        this.successfulIntervalsCount = 0;
        this.cumulativeElapsedSecondsCount = 0;
        localStorage.setItem("timerSettings", JSON.stringify({ duration: rawTimeValue, repeats: rawRepeatsValue }));
        if (rawTimeValue.includes(":")) {
            const timeSegments = rawTimeValue.split(":");
            const minutesParsed = parseInt(timeSegments[0], 10) || 0;
            const secondsParsed = parseInt(timeSegments[1], 10) || 0;
            this.initialDurationInSeconds = (minutesParsed * 60) + secondsParsed;
        } else {
            this.initialDurationInSeconds = parseInt(rawTimeValue, 10) || 0;
        }

        if (this.initialDurationInSeconds <= 0) {
            alert("Please enter a valid timeframe duration greater than zero.");
            return;
        }

        this.currentSecondsRemaining = this.initialDurationInSeconds;

        const card = document.getElementById("timerCard");
        card.classList.add("running");

        const actionBtn = document.getElementById("actionBtn");
        actionBtn.innerText = "Stop";
        actionBtn.className = "action-btn btn-stop";

        this.updateGuiDisplays();
        this.countdownIntervalId = setInterval(timeBar.executeTimerTick, 1000);
    },
    stopTimerEngine: function() {
        if (this.countdownIntervalId) {
            clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = null;
        }
        const card = document.getElementById("timerCard");
        card.classList.remove("running");
        const actionBtn = document.getElementById("actionBtn");
        actionBtn.innerText = "Start";
        actionBtn.className = "action-btn btn-start";
        this.resetDisplayToInputs();
    },
    triggerFlashEffect: function() {
        const card = document.getElementById("timerCard");
        card.classList.remove("flash-active");
        void card.offsetWidth;
        card.classList.add("flash-active");
    },
    executeTimerTick: function() {
        timeBar.executeTimerTick__();
    },
    executeTimerTick__: function() {
        if (this.currentSecondsRemaining > 0) {
            this.currentSecondsRemaining--;
            this.cumulativeElapsedSecondsCount++;
            this.updateGuiDisplays();
        }
        if (this.currentSecondsRemaining === 0) {
            this.playBeepSound();
            this.triggerFlashEffect();
            this.successfulIntervalsCount++;
            document.getElementById("counterDisplay").innerText = this.successfulIntervalsCount;

            if (this.successfulIntervalsCount >= this.targetRepeatLimit) {
                clearInterval(this.countdownIntervalId);
                this.countdownIntervalId = null;

                const card = document.getElementById("timerCard");
                card.classList.remove("running");

                const actionBtn = document.getElementById("actionBtn");
                actionBtn.innerText = "Start";
                actionBtn.className = "action-btn btn-start";

                setTimeout(() => { this.playBeepSound(1000); }, 400);
                setTimeout(() => { this.playBeepSound(1400); }, 800);
            } else {
                this.currentSecondsRemaining = this.initialDurationInSeconds;
                this.updateGuiDisplays();
            }
        }
    },
    updateGuiDisplays: function() {
        this.updateClockDisplay(this.currentSecondsRemaining);
        document.getElementById("totalSecondsDisplay").innerText = this.cumulativeElapsedSecondsCount;
        let iTotSec = this.initialDurationInSeconds * this.targetRepeatLimit;
        let iProgPerc = Math.round((this.cumulativeElapsedSecondsCount / iTotSec) * 100);
        this.progressBarUpdate(iProgPerc);
    },
    updateClockDisplay: function(totalSeconds) {
        const displayMinutes = Math.floor(totalSeconds / 60);
        const displaySeconds = totalSeconds % 60;
        document.getElementById("clockDisplay").innerText =
            `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
    },
    toggleCardLayout: function() {
        const card = document.getElementById("timerCard");
        const toggleBtn = document.getElementById("toggleBtn");

        card.classList.toggle("contracted");

        if (card.classList.contains("contracted")) {
            toggleBtn.innerHTML = "+";
        } else {
            toggleBtn.innerText = "--";
        }
    },
    progressBarUpdate: function(iProgress) {
        // Ensure the input stays between 0 and 100
        const percentage = Math.min(Math.max(iProgress, 0), 100);
        // Update the width of the progress bar
        document.getElementById('progressBarBar').style.width = percentage + '%';
    },
    floatInWindow: function() {
        //const url = document.location.href;
        const url = "frames/timer/index.htm";
        const windowFeatures = 'width=195,height=265,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
        window.open(url, '_blank', windowFeatures);
    }
}

window.addEventListener("DOMContentLoaded", timeBar.init);
