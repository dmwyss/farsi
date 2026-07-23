
let utilCookie = {
	"get": function(sName, vDefault="") {
		sName = sName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(sName) == 0){
				return c.substring(sName.length, c.length);
			}
		}
		return vDefault;
	}
	,"getInt": function(sName) {
		var sOut = this.get(sName);
		if (sOut == "") {
			return null;
		} else if (isNaN(sOut)) {
			return null;
		} else {
			return parseInt(sOut);
		}
	}
	,"set": function(sName, sValue, iExpDays) {
		var expires = "";
		if (typeof iExpDays != "undefined") {
			var dtExp = new Date();
			dtExp.setTime(dtExp.getTime() + (iExpDays*24*60*60*1000));
			expires = "; expires=" + dtExp.toUTCString();
		}
		document.cookie = sName + "=" + sValue + expires + "; path=/";
	}
	,"delete": function(sName) {
		this.set(sName, "", 0);
	}
}

let utilCookieJson = {
    init: function(){
        return this;
    }
    ,set: function(sName, o){
        let sToSet = JSON.stringify(o, null, "");
        utilCookie.set(sName, sToSet, 1000);
    }
    ,get: function(sName, vDefault=null){
        let sOut = utilCookie.get(sName, null);
        if (sOut == null) {
            return vDefault;
        }
        return JSON.parse(sOut);
    }
	,"delete": function(sName) {
		utilCookie.delete(sName);
	}
}
