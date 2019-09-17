const rtfReader = require('./rtf-import');
const fs = require('fs');
const {ipcRenderer} = require('electron');

ipcRenderer.on('path', function(_event, message) {
    readFile(message)
});


function readFile(path) {
    fs.readFile(path, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        rtfReader.runRtfjs(data, onFileParse, (error) => {
        alert(error);
        });
    });
}


function onFileParse(_metaData, html) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = "";
    contentDiv.insertAdjacentHTML( 'beforeend', html );
}