
// Pre-defined variables.
var logMessage = '';
var logCss1 = '';
var logCss2 = '';
var previewText = '';
var isLonger = 0;


// Pre-defined functions.
// Stylish console.logs.
function message(code) {

  var rightNow = new Date();
  var tsList = [ ( (rightNow.getHours() < 10 ) ? ( '0' + rightNow.getHours() ) : rightNow.getHours() ) , ( (rightNow.getMinutes() < 10 ) ? ( '0' + rightNow.getMinutes() ) : rightNow.getMinutes() ) , ( (rightNow.getSeconds() < 10 ) ? ( '0' + rightNow.getSeconds() ) : rightNow.getSeconds() ), rightNow.getMilliseconds()];
  var timestamp = `${tsList[0] + ':' + tsList[1] + ':' + tsList[2] + '.' + tsList[3]}`;
  logMessage = `%c${timestamp}%c This is a test message.`;
  logCss1 = 'color: black; font-weight: regular; font-style: none; ';
  logCss2 = 'color: grey; font-style: italic;';

  switch (code) {

    case 'windowReady' :
      logMessage = `%c${timestamp}%c Window is ready.`;
      break;

    case 'startListening' :
      logMessage = `%c${timestamp}%c Start listening events.`;
      break;

    case 'startReading' :
      logMessage = `%c${timestamp}%c Start reading files.`;
      break;

    case 'finishReading' :
      logMessage = `%c${timestamp}%c > Finish reading files.`;
      break;

    case 'stopReading' :
      logMessage = `%c${timestamp}%c > Error: The file is not loaded.`;
      logCss2 = 'color: red; font-weight: bold;';
      break;

    case 'previewLoaded' :
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

// Take care of the status of the navigation bar.
function statusUpdate(code) {

  var firstBlock = document.getElementById('navbar-upload');
  var secondBlock = document.getElementById('navbar-preview');
  var thirdBlock = document.getElementById('navbar-convert');

  switch (code) {

    case 'initialize':

      firstBlock.className = '';
      secondBlock.className = '';
      thirdBlock.className = '';
      firstBlock.classList.add('navbar-item');
      secondBlock.classList.add('navbar-item');
      thirdBlock.classList.add('navbar-item');
      firstBlock.classList.add('navbar-focus');
      secondBlock.classList.add('navbar-none');
      thirdBlock.classList.add('navbar-none');
      break;

    case 'startReading':

      firstBlock.classList.replace('navbar-focus','navbar-process');
      break;

    case 'finishReading':

      firstBlock.innerHTML = 'Uploaded';
      firstBlock.classList.replace('navbar-process','navbar-finish');
      secondBlock.classList.replace('navbar-none','navbar-focus');
      break;

    case 'stopReading':

      firstBlock.classList.replace('navbar-process','navbar-error');
      break;

  }

}





// Main Codes
// Add a listener to upload button.
window.onload = function () {

  message('windowReady');
  statusUpdate('initialize');
  document.getElementById('upload-button').onchange = readfile;
  var info = document.getElementById('info-button');
  var upload = document.getElementById('upload-button');

  info.addEventListener("click", function (e) {
    if (upload) {
      upload.click();
    }
    e.preventDefault(); // prevent navigation to "#"
  }, false);

};




// Read files uploaded by users.
/*
  Reference source code & author:

    https://www.kangting.tw/2012/09/html5-filereader.html, by 康廷數位
    https://kknews.cc/zh-tw/code/e6p2ygq.html, by IT人一直在路上

*/
// I added some logs to confirm its status.
function readfile() {

  message('startListening');

  var file = this.files[0];
  var fReader = new FileReader();

  fReader.onloadstart = function (event) {
    message('startReading');
    statusUpdate('startReading');
    document.getElementById('preview-text').innerHTML = 'Processing files...';
  };

  fReader.onload = function (event) {
    message('finishReading');
    previewText = codeRestorer(codeSlicer(fReader.result,0,999));
    document.getElementById('preview-text').innerHTML = previewText;
    message('previewLoaded');
    statusUpdate('finishReading');
  };

  fReader.onerror = function (event) {
    message('stopReading');
    statusUpdate('stopReading');
    document.getElementById('preview-text').innerHTML = 'Failed to process the files. Please refresh the page.';
  };

  fReader.readAsText(file,"utf-8");

}
