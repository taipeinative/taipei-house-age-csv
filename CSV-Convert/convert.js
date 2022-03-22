/*

'convert.js' Contents
=======================
1 Pre-defied variables
2 Core functions
  2.1 window.onload();
  2.2 clickUpload();
  2.3 uploadListener();
  2.4 readfile();
  2.5 clickNext();
  2.6 nextListener();
  2.7 convertToCSV();

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
var itemList = [];
var completionList = [];
var addressList = [];
var addressArray = [];
var resultArray = [];




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



// Intercept users' click event to trigger true <input> button.
/*
  Reference source code & author:

    https://developer.mozilla.org/zh-TW/docs/Web/API/File/Using_files_from_web_applications, by Mozilla

*/
function clickUpload() {

  var info = document.getElementById('info-button');
  info.addEventListener("click", uploadListener , false);

}



// A click event listener is implemented on 'Upload' button.
function uploadListener (e) {

  var upload = document.getElementById('upload-button');
  if (upload) {

    upload.click();

  }

  e.preventDefault();

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
    message();
    statusUpdate();
    localeUpdate();
    clickNext();
    document.getElementById('preview-text').innerHTML = previewText;

  };

  fileManager.onerror = function (event) {

    currentState = 'uploadFailed';
    message();
    statusUpdate();
    localeUpdate();

  };

  fileManager.readAsText(file,"utf-8");

}



// Intercept users' click event to trigger true <input> button.
/*
  Reference source code & author:

    https://developer.mozilla.org/zh-TW/docs/Web/API/File/Using_files_from_web_applications, by Mozilla

*/
function clickNext() {

  var info = document.getElementById('info-button');
  info.removeEventListener('click', uploadListener , false);
  info.addEventListener('click', nextListener , false);

}



// A click event listener is implemented on 'Next' button.
function nextListener (e) {

  if (document.getElementById('info-button')) {

    currentState = 'convert';
    message();
    statusUpdate();
    localeUpdate();
    fileManager.result.convertToCSV();

  }

  e.preventDefault();

}



// A click event listener is implemented on 'Download' button.
function downloadListener (e) {

  if (document.getElementById('info-button')) {

    downloadBlobFile();

  }

  e.preventDefault();

}



// THIS FUNCTION CONVERTS XML TO CSV.
/*
  The element tree of Taipei02.xml:
  ===============================================
  [Elements]      [⚹]  [Definition]

  Datas
  └ Data
    ├ 執照年度          Certificate Given Year
    ├ 執照號碼          Certificate Number
    ┆
    ┆ (Omission)
    ┆
    ├ 工程造價          Cost of Construction
    ├ 竣工日期     ⚹    Date of Completion
    ├ 開工日期          Date of Groundbreaking
    ├ 建築地點     ⚹    Construction Site
    │ └ 地址       ⚹    Address
    ├ 地段地號          Land lot and Serial Number
    ┆
    ┆ (Omission)
    ┆

  ===============================================
  ⚹ : These are what we are interested in, so we'll grab these data.

  [Formats of the fields]                        [Example]
  <竣工日期>: yyymmdd                             0921031 (yyy are in Minguo (ROC) calender format)
  <地址>: 臺北市◯◯區◯◯路/街/大道◯◯號 ◯樓    臺北市北投區三合街一段118巷8號
                                                 臺北市中山區北安路669號 二樓之1
                                                 臺北市中山區民生東路三段2-1號
                                                 臺北市中山區民生東路三段2號之1
                                                 臺北市文山區萬興里指南路二段45巷10弄15號 之12樓之1
                                                 臺北市大同區赤峰街-752樓
                                                 臺北市中正區泉州149號
                                                 臺北市北投區公？路198號

*/
String.prototype.convertToCSV = function () {

  var i;
  var j;
  var result = 'Address,Date,Age<br>';
  var info = document.getElementById('info-button');
  document.getElementById('preview-text').innerHTML = '';
  info.removeAttribute('href');
  info.classList.add('info-disabled');
  info.removeEventListener('click', nextListener , false);
  var xmlDocument = (new DOMParser()).parseFromString(this, 'text/xml');
  itemList = xmlDocument.getElementsByTagName('Data');
  completionList = [];
  addressList = [];
  addressArray = [];
  resultArray = [];

  for (i = 0 ; i < itemList.length ; i++) {

    completionList = itemList[i].getElementsByTagName('竣工日期');
    addressList = itemList[i].getElementsByTagName('地址');

    if ( completionList[0].innerHTML != '') {

      for (j = 0; j < addressList.length; j++) {

        addressArray.push( addressList[j].innerHTML.replace(/ (b|B)*\d+樓/g,'') );

      }

      addressArray = addressArray.removeDuplicate();

      for (j = 0; j < addressArray.length; j++) {

        resultArray.push(`${addressArray[j]},${completionList[0].innerHTML},`);

      }

      completionList = [];
      addressList = [];
      addressArray = [];

    }

  }

  resultArray.sort();
  result = result + resultArray.join('<br>');
  result = result.dataFixer();

  document.getElementById('preview-text').innerHTML = result;
  info.addEventListener('click', downloadListener , false);
  info.setAttribute('href','#');
  info.classList.remove('info-disabled');
  currentState = 'convertEnded';
  message();
  statusUpdate();
  localeUpdate();


};
