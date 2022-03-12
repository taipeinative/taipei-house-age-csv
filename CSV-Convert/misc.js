// Pre-defined variables.
var logMessage = '';
var logCss1 = '';
var logCss2 = '';





// Stylish console outputs.
function message(code) {

  var rightNow = new Date();
  var tsList = [ ( (rightNow.getHours() < 10 ) ? ( '0' + rightNow.getHours() ) : rightNow.getHours() ) , ( (rightNow.getMinutes() < 10 ) ? ( '0' + rightNow.getMinutes() ) : rightNow.getMinutes() ) , ( (rightNow.getSeconds() < 10 ) ? ( '0' + rightNow.getSeconds() ) : rightNow.getSeconds() ), rightNow.getMilliseconds()];
  var timestamp = `${tsList[0] + ':' + tsList[1] + ':' + tsList[2] + '.' + tsList[3]}`;
  logMessage = `%c${timestamp}%c [Program] says hello world.`;
  logCss1 = 'color: black; font-weight: regular; font-style: none; ';
  logCss2 = 'color: grey; font-style: italic;';

  switch (currentState) {

    case 'upload' :
      logMessage = `%c${timestamp}%c [Window] is ready.`;
      break;

    case 'uploadProcess' :
      logMessage = `%c${timestamp}%c [Program] start processing files.`;
      break;

    case 'uploadFailed' :
      logMessage = `%c${timestamp}%c [Error] The file is not loaded.`;
      logCss2 = 'color: red; font-weight: bold;';
      break;

    case 'preview' :
      logMessage = `%c${timestamp}%c [Program] finish processing files.`;
      break;

  }

  console.log(logMessage,logCss1,logCss2);

}



// Take care of the status of the navigation bar.
/*
  Reference source code & author:

    https://www.w3schools.com/jsref/prop_element_classlist.asp, W3Schools

*/
function statusUpdate(code) {

  var firstBlock = document.getElementById('navbar-upload');
  var secondBlock = document.getElementById('navbar-preview');
  var thirdBlock = document.getElementById('navbar-convert');

  switch (code) {

    default:

      switch (currentState) {

        case 'upload':
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

        case 'uploadProcess':
          firstBlock.classList.replace('navbar-focus','navbar-process');
          break;

        case 'preview':
          firstBlock.innerHTML = 'Uploaded';
          firstBlock.classList.replace('navbar-process','navbar-finish');
          secondBlock.classList.replace('navbar-none','navbar-focus');
          break;

        case 'uploadFailed':
          firstBlock.classList.replace('navbar-process','navbar-error');
          break;

        }
      break;

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

  }

}
