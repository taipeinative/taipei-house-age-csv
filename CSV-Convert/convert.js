/*

'convert.js' Contents
=======================
1 Pre-defied variables
2 Core functions
  2.1 window.onload();
  2.2 uploadListener();
  2.3 clickUpload();
  2.4 readfile();

For codeSlicer(); and codeRestorer(); before beta 0.2.1, their functions were inherited by nonHTMLTagReplacer(); and xmlFileRebuilder(); in misc.js.

*/



// Pre-defined variables.
var currentState = 'upload';
var language = 'en';
var previewText = '';
var codeLength;
var hiddenCharactersLength;
var fromCode = 0;
var toCode = 9999;
var fileManager;
var xml;
var isLonger = 0;





// Core functions.
// Initialize and add listeners to 'buttons'.
window.onload = function () {

  currentState = 'upload';
  document.getElementById('upload-button').onchange = readfile;
  clickUpload();
  clickLanguage();
  message();
  statusUpdate();

};



// A click event listener is implemented on 'Upload' button.
function uploadListener (e) {

  if (document.getElementById('upload-button')) {

    document.getElementById('upload-button').click();

  }

  e.preventDefault();

}



// Intercept users' click event to trigger true <input> button.
/*
  Reference source code & author:

    https://developer.mozilla.org/zh-TW/docs/Web/API/File/Using_files_from_web_applications, by Mozilla

*/
function clickUpload() {

  var info = document.getElementById('info-button');
  var upload = document.getElementById('upload-button');
  info.addEventListener("click", uploadListener , false);

}



// Read files uploaded by users.
/*
  Reference source code & author:

    https://www.kangting.tw/2012/09/html5-filereader.html, by 康廷數位
    https://kknews.cc/zh-tw/code/e6p2ygq.html, by IT人一直在路上

*/
function readfile() {

  var file = this.files[0];
  fileManager = new FileReader();

  fileManager.onloadstart = function (event) {

    currentState = 'uploadProcess';
    message();
    statusUpdate();
    localeUpdate();

  };

  fileManager.onload = function (event) {

    currentState = 'preview';
    codeLength = fileManager.result.length;
    hiddenCharactersLength = codeLength - ( toCode - fromCode );
    isLonger = ( (hiddenCharactersLength > 0) ? (0) : (1) );
    xml = fileManager.result.slice(fromCode,toCode);
    previewText = xml.xmlFileRebuilder();
    document.getElementById('preview-text').innerHTML = previewText;
    message();
    statusUpdate();
    document.getElementById('info-button').removeEventListener("click", uploadListener , false);

  };

  fileManager.onerror = function (event) {

    currentState = 'uploadFailed';
    message();
    statusUpdate();
    localeUpdate();

  };

  fileManager.readAsText(file,"utf-8");

}
