/*
 *   To run PyWriter, run something like this:
 *      cd /Users/Shared/Data/Projects/PyWriter/src
 *      python3 pywriter.py
 *
 *   To test if the sever is running, create a JavaScript link:
 *      <script type="text/javascript" src="http://localhost:8000/ping"></script>
 *
 *   If it is running will return:
 *      let isPywriterAvailable = true;
 *
 *   So create code like this in the document.
 *      if (typeof isPywriterAvailable == "undefined") {
 *          ... logic to handle no server available.
 *      }
 */
let pywriter = {
    save: function(sProject, sFileName, sBody, fnCallback) {
        sProject = sProject.toLowerCase();
        var http = new XMLHttpRequest();
        let sUrlRoot = "http://localhost:5000"
        var sUrlWithParams = sUrlRoot + '/pywriter/' + sProject + '/' + sFileName;

        http.open('POST', sUrlWithParams);
        http.setRequestHeader('Content-type', 'text/plain');
        http.onreadystatechange = function() {  //Call a function when the state changes.
            if((http.status == 0) || (http.status == 200)) {
                //alert(http.responseText);
            } else {
                console.error("pywriter:" + http.status + ", readyState:" + http.readyState + "");
            }
            //fnCallback(http.status);
        }
        http.send(sBody);
    }
}
