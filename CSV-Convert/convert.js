// Pre-defined variables.
var previewText = '';
var isLonger = 0;
var language = 'en';
var currentState = 'upload';





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
  var upload = document.getElementById('upload-button');

  info.addEventListener("click", function (e) {

    if (upload) {

      upload.click();

    }

    e.preventDefault();

  }, false);

}



// Read files uploaded by users.
/*
  Reference source code & author:

    https://www.kangting.tw/2012/09/html5-filereader.html, by 康廷數位
    https://kknews.cc/zh-tw/code/e6p2ygq.html, by IT人一直在路上

*/
function readfile() {

  var file = this.files[0];
  var fileManager = new FileReader();

  fileManager.onloadstart = function (event) {

    currentState = 'uploadProcess';
    message();
    statusUpdate();
    localeUpdate();

  };

  fileManager.onload = function (event) {

    currentState = 'preview';
    previewText = codeRestorer(codeSlicer(fileManager.result,0,9999));
    document.getElementById('preview-text').innerHTML = previewText;
    message();
    statusUpdate();
    localeUpdate();

  };

  fileManager.onerror = function (event) {

    currentState = 'uploadFailed';
    message();
    statusUpdate();
    localeUpdate();

  };

  fileManager.readAsText(file,"utf-8");

}



// Slice .xml files in order to speed up preview time.
function codeSlicer (code,from,to) {

  var codeLength = code.length;
  var result = code.slice(from,to);
  if ( codeLength > ( to - from) ) {

    isLonger = 0;
    return `${result + '^' + ( codeLength - ( to - from ) ) + '%' }`;

  } else {

    isLonger = 1;
    return `${result} <br /><span class = "continue">(End of the preview)</span>`;

  }

}



// Restore features including line breaks and tabs from source code.
/*
  Following shows how these regular expressions work.

    RegEx:  /<(?!br|span|\/span)/g , /\n/g , /\t/g
    Input:  \t\t<tag>Hello World</tag>\n<br />
    Output: &ensp;&ensp;&ensp;&ensp;&lt;tag>Hello World&lt;/tag><br /><br />

    RegEx:  /\^\d+%/ , /(?<=\^)\d+(?=%)/
    Input:  I^m feelin' 100% good. ^1111%
    Output: I^m feelin' 100% good. <br /><span class = "continue">(End of the preview)<br />( 1111 characters behind)</span>

*/
function codeRestorer (code) {

  var result = code.replace(/<(?!br|span|\/span)/g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;');
  result = ( (isLonger) ? (result) : ( result.replace(/\^\d+%/,'<br /><span class = "continue">(End of the preview)<br />(') + result.match(/(?<=\^)\d+(?=%)/) + ' characters behind)</span>') );

  return result;

}
