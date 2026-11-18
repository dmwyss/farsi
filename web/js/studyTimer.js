
const studyTimer = {
    studySec: 0,
    startTime: 0,
    idleTimeoutId: null,
    saveDebounceTimer: null,
    iTodayAbs: 0,
    sTodayYMD: "",
    iIdleLimitMilli: (60 * 1000),
    iOneDayMilli: 86400000,
    dtZero: new Date("2026-01-01T00:00:00Z"),

    init() {
        this.iTodayAbs = this.getAbsDay();
        this.sTodayYMD = this.formatDate();
        this.startTime = Date.now() - 100;
        this.studySec = 0;

        if (!studyTimerData.hasOwnProperty(this.iTodayAbs)) {
            // No entry for today yet. Add it.
//            studyTimerData[this.iTodayAbs] = {
//                sDate: this.sTodayYMD,
//                iDuration: 0
//            }
            this.createNewStudyTimerDataForToday(this.iTodayAbs, this.sTodayYMD);
        }
        this.resetColdTimer();
        this.bump();
        this.updateUI();
    },

    createNewStudyTimerDataForToday(iTodayAbs, sTodayYMD) {
        studyTimerData[iTodayAbs] = {
            sDate: sTodayYMD,
            iDuration: 0
        }
    },

    bump() {
        // Update studySec to integer seconds elapsed since page opened
        this.heatOrFreezeUI(true);
        if (this.startTime === null) {
            console.log("timer was blank, set up and returned");
            this.startTime = Date.now();
            return;
        }
        let iStudyMilli = Date.now() - this.startTime;
        if (iStudyMilli < 1000) {
            // User making quick changes. Wait for slower interval.
            return;
        } else if (iStudyMilli > this.iIdleLimitMilli) {
            this.reset();
            return;
        }
        this.studySec = Math.floor(iStudyMilli / 1000);
        this.resetColdTimer();
        this.save();
        this.updateUI();
        return this.studySec;
    },

    updateUI() {
        document.getElementById('studyTimerElapsedDisplay').textContent = this.formatTime(studyTimerData[this.iTodayAbs].iDuration);
    },

    heatOrFreezeUI(isHeat = true) {
        if (isHeat) {
            document.getElementById('studyTimerElapsedDisplay').classList.add("active");
        } else {
            document.getElementById('studyTimerElapsedDisplay').classList.remove("active");
        }
    },

    pad(iIn) {
        return String(iIn).padStart(2, '0');
    },

    formatDate: function(date = new Date(), includeTime = false) {
        const year = date.getFullYear();
        const month = this.pad(date.getMonth() + 1); // Monate sind 0-basiert
        const day = this.pad(date.getDate());
        const datePart = `${year}-${month}-${day}`;
        if (!includeTime) {
            return datePart;
        }
        const hours = this.pad(date.getHours());
        const minutes = this.pad(date.getMinutes());
        const seconds = this.pad(date.getSeconds());
        return `${datePart} ${hours}-${minutes}-${seconds}`;
    },

    formatTime: function(iSecsAll) {
        let iMins = Math.floor(iSecsAll / 60);
        let iSecs = iSecsAll - (iMins * 60)
        return iMins + ":" + this.pad(iSecs);
    },

    getAbsDay() {
        // Get today's date normalized to UTC midnight
        const dtNow = new Date();
        const dtToday = new Date(Date.UTC(dtNow.getFullYear(), dtNow.getMonth(), dtNow.getDate()));
        // Calculate difference in milliseconds and convert to days
        const daysElapsed = Math.floor((dtToday - this.dtZero) / this.iOneDayMilli);
        return daysElapsed;
    },

    save: function() {

        /*
        // This reacts when the accrued time goes over the 1hr mark.
        const iHourOneSeconds = 3600;
        let oTimerDataToday = studyTimerData[this.iTodayAbs]; // Add to total.
        let iDurationOld = oTimerDataToday.iDuration;
        oTimerDataToday.iDuration += this.studySec; // Add to total.
        if ((iDurationOld < iHourOneSeconds) && (oTimerDataToday.iDuration > iHourOneSeconds)) {
            // Just crossed the hour threshold.
            // Play ping sound;
        }
        */
        if (studyTimerData[this.iTodayAbs]) {
            studyTimerData[this.iTodayAbs].iDuration += this.studySec; // Add to total.
        } else {
            this.createNewStudyTimerDataForToday(this.iTodayAbs, this.sTodayYMD);
        }
        this.reset();
        console.log("save (bounced prepare disk action)");
        clearTimeout(this.saveDebounceTimer);
        this.saveDebounceTimer = setTimeout(() => {
            this._save_debounced_();
        }, 4000);
    },

    _save_debounced_: function() {
        console.log("save to disk");
        console.log(JSON.stringify(studyTimerData, null, 2));
        let sFileName = "data/studyTimerData.js"
        let sBody = JSON.stringify(studyTimerData, null, 1);
        sBody = "const studyTimerData = " + sBody;
        sBody += ";";
        pywriter.save("farsiVocab", sFileName, sBody, sakhtBase.callbackMethod());
    },

    reset: function() {
        this.studySec = 0; // Reset
        this.startTime = Date.now(); // Reset
        this.iTodayAbs = this.getAbsDay();
    },

    resetColdTimer() {
        clearTimeout(this.idleTimeoutId);
        this.idleTimeoutId = setTimeout(() => {
            console.log("make the GUI cold");
            this.heatOrFreezeUI(false);
        }, this.iIdleLimitMilli + 1000);
    }
};