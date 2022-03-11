
// Pre-defined variables.
var logMessage = '';
var logCss1 = '';
var logCss2 = '';
var previewText = '';
var isLonger = 0;


// Pre-defined functions.
// Allow stylish console.logs.
function message(code) {

  var rightNow = new Date();
  var tsList = [ ( (rightNow.getHours() < 10 ) ? ( '0' + rightNow.getHours() ) : rightNow.getHours() ) , ( (rightNow.getMinutes() < 10 ) ? ( '0' + rightNow.getMinutes() ) : rightNow.getMinutes() ) , ( (rightNow.getSeconds() < 10 ) ? ( '0' + rightNow.getSeconds() ) : rightNow.getSeconds() ), rightNow.getMilliseconds()];
  var timestamp = `${tsList[0] + ':' + tsList[1] + ':' + tsList[2] + '.' + tsList[3]}`;
  logMessage = `%c${timestamp}%c This is a test message.`;
  logCss1 = 'color: black; font-weight: regular; font-style: none; ';
  logCss2 = 'color: grey; font-style: italic;';

  switch (code) {

    case 'WindowReady' :
      logMessage = `%c${timestamp}%c Window is ready.`;
      break;

    case 'StartListening' :
      logMessage = `%c${timestamp}%c Start listening events.`;
      break;

    case 'StartReading' :
      logMessage = `%c${timestamp}%c Start reading files.`;
      break;

    case 'FinishReading' :
      logMessage = `%c${timestamp}%c > Finish reading files.`;
      break;

    case 'StopReading' :
      logMessage = `%c${timestamp}%c > Error: The file is not loaded.`;
      logCss2 = 'color: red; font-weight: bold;';
      break;

    case 'PreviewLoaded' :
      logMessage = `%c${timestamp}%c > Preview texts are loaded.`;
      break;

  }

  console.log(logMessage,logCss1,logCss2);

}


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
function codeRestorer (code) {

  var result = code.replace(/<(?!br|span|\/span)/g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;');
  result = ( (isLonger) ? (result) : ( result.replace(/\^\d+%/,'<br /><span class = "continue">(End of the preview)<br />(') + result.match(/(?<=\^)\d+(?=%)/) + ' characters behind)</span>') );

  return result;

}


// Add a listener to upload button.
window.onload = function () {

  message('WindowReady');
  document.getElementById('upload-button').onchange = readfile;

};



// Read files uploaded by users.
/*
  Reference source code & author:

    https://www.kangting.tw/2012/09/html5-filereader.html, by 康廷數位
    https://kknews.cc/zh-tw/code/e6p2ygq.html, by IT人一直在路上

*/
// I added some logs to confirm its status.
function readfile() {

  message('StartListening');

  var file = this.files[0];
  var fReader = new FileReader();

  fReader.onloadstart = function (event) {
    message('StartReading');
    document.getElementById('preview-text').innerHTML = 'Processing files...';
  };

  fReader.onload = function (event) {
    message('FinishReading');
    previewText = codeRestorer(codeSlicer(fReader.result,0,999));
    document.getElementById('preview-text').innerHTML = previewText;
    message('PreviewLoaded');
  };

  fReader.onerror = function (event) {
    message('StopReading');
  };

  fReader.readAsText(file,"utf-8");

}
