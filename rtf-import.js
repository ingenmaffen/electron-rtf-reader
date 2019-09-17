const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

exports.runRtfjs = function(rtf, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    var dom = new JSDOM(`
    <script src="./node_modules/jquery/dist/jquery.min.js"></script>

    <script src="./node_modules/rtf.js/dist/jquery.svg.min.js"></script>
    <script src="./node_modules/rtf.js/dist/jquery.svgfilter.min.js"></script>

    <script src="./node_modules/rtf.js/dist/WMFJS.bundle.js"></script>
    <script src="./node_modules/rtf.js/dist/EMFJS.bundle.js"></script>
    <script src="./node_modules/rtf.js/dist/RTFJS.bundle.js"></script>

    <script>
        RTFJS.loggingEnabled(false);
        WMFJS.loggingEnabled(false);
        EMFJS.loggingEnabled(false);

        try {
            var doc = new RTFJS.Document(rtfFile);
    
            var meta = doc.metadata();
            doc.render().then(function(htmlElements) {
                var html = $("<div>").append(htmlElements).html();
    
                window.done(meta, html);
            }).catch(error => window.onerror(error))
        } catch (error){
            window.onerror(error)
        }
    </script>
    `, { resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        virtualConsole,
        beforeParse(window) {
            window.rtfFile = stringToArrayBuffer(rtf);
            window.done = function(meta, html){
                callback(meta, html);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
            // Catch exceptions from jquery.svg.min.js
            window.alert = function (error) {
                errorCallback(error)
            };
        }});
}
