// Pre-defined variables.
var currentState = 'upload';
var language = 'en';
var previewText = '';
var codeLength;
var previewLength;
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
    previewLength = codeLength - ( toCode - fromCode );
    xml = codeSlicer(fileManager.result,fromCode,toCode);
    previewText = codeRestorer(xml,'default');
    document.getElementById('preview-text').innerHTML = previewText;
    message();
    statusUpdate();
    localeUpdate();
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



// Slice .xml files in order to speed up preview time.
function codeSlicer (code,from,to) {

  var result = code.slice(from,to);

  if ( previewLength > 0 ) {

    isLonger = 0;
    return result;

  } else {

    isLonger = 1;

    switch (language) {

      case 'en' :
        return `${result} ${locale[14].en}`;
        break;

      case 'zh' :
        return `${result} ${locale[14].zh}`;
        break;

    }

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
function codeRestorer (code,tag) {

  var result = code.replace(/<(?!br|span|\/span)/g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;');

  switch (tag) {

    case 'default':

      switch (language) {

        case 'en':
          result = ( (isLonger) ? (result) : ( result + locale[15].en + previewLength + locale[16].en ) );
          break;

        case 'zh':
          result = ( (isLonger) ? (result) : ( result + locale[15].zh + previewLength + locale[16].zh ) );
          break;

      }
      break;

    case 'replace':

      switch (language) {

        case 'en':
          result = ( (isLonger) ? (`${fileManager.result.slice(fromCode,toCode).replace(/<(?!br|span|\/span)/g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;')} ${locale[14].en}`) : (xml + locale[15].en + previewLength + locale[16].en) );
          break;

        case 'zh':
          result = ( (isLonger) ? (`${fileManager.result.slice(fromCode,toCode).replace(/<(?!br|span|\/span)/g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;')} ${locale[14].zh}`) : (xml + locale[15].zh + previewLength + locale[16].zh) );
          break;

      }
      break;

  }

  return result;

}



// Listener implemented on 'Upload' button.
function uploadListener (e) {

  if (document.getElementById('upload-button')) {

    document.getElementById('upload-button').click();

  }

  e.preventDefault();

}
