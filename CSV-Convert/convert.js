
// Pre-defined variables.
var logMessage = '';
var logCss1 = '';
var logCss2 = '';
var previewText = '';


// Pre-defined functions.
function message(code) {

  var rightNow = new Date();
  var timestamp = `${rightNow.getHours() + ':' + rightNow.getMinutes() + ':' + rightNow.getSeconds() + '.' + rightNow.getMilliseconds()}`;
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

  }

  console.log(logMessage,logCss1,logCss2);

}


// Restore features including line breaks and tabs from source code.
function codeRestorer (code) {

  return code.replace(/</g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;');

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

  fReader.readAsText(file,"utf-8");

  fReader.onloadstart = function (event) {
    message('StartReading');
  };

  fReader.onload = function (event) {
    message('FinishReading');
    previewText = fReader.result.slice(0,99)
    document.getElementById('upload-preview').innerHTML = codeRestorer(previewText);
  };

  fReader.onerror = function (event) {
    message('StopReading');
  };

}
