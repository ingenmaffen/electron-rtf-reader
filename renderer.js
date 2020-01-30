const rtfReader = require("./rtf-import");
const fs = require("fs");
const { ipcRenderer } = require("electron");
const { Book } = require("epubjs");

ipcRenderer.on("path", function(_event, message) {
  readFile(message);
});

ipcRenderer.on("search", function(_event, message) {
  findText(message);
});

ipcRenderer.on("load-theme", function(_event, _message) {
  const theme = window.localStorage.getItem("theme");
  setTheme(theme);
});

ipcRenderer.on("theme", function(_event, message) {
  window.localStorage.setItem("theme", message);
  setTheme(message);
});

function readFile(path) {
  const splittedPath = path.split(".");
  const extension = splittedPath[splittedPath.length - 1];
  switch (extension) {
    case "rtf":
      readRtf(path);
      break;
    case "epub":
      readEpub(path);
      break;
  }
}

function readEpub(path) {
  const book = new Book(path);
  const renderedBook = book.renderTo("content", {
    width: "100%",
    height: "100%",
    flow: "auto"
  });
  renderedBook.display();
}

function readRtf(path) {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    }

    rtfReader.runRtfjs(data, onFileParse, error => {
      alert(error);
    });
  });
}

function onFileParse(_metaData, html) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";
  contentDiv.insertAdjacentHTML("beforeend", html);
}

function findText(text) {
  window.find(text);
}

function setTheme(theme) {
  switch (theme) {
    case "light":
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      break;
    case "dark":
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
      break;
    default:
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      break;
  }
}
