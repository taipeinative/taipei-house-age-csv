/*

'locale.js' Contents
=======================
1 Pre-defied variables
2 Core functions
  2.1 (requesting locale files)
  2.2 clickLanguage();
  2.3 localeUpdate();

*/



// Pre-defined variables.
var locale;




// Core functions.
// Import locale (locale.json) files.
/*
  Reference source code & author:

    https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Objects/JSON , by Mozilla

*/
var requestURL = 'https://raw.githubusercontent.com/taipeinative/taipei-house-age-csv/beta/CSV-Convert/locale.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text';
request.send();
request.onload = function() {

  var temp = JSON.stringify(request.response);
  locale = JSON.parse(JSON.parse(temp));

}

// Intercept users' click event to trigger change language function.
function clickLanguage() {

  var lang = document.getElementById('navbar-button');

  lang.addEventListener("click", function (e) {

    if (lang) {

      ( (language == 'en') ? (language = 'zh') : (language = 'en'));
      localeUpdate();

    }

    e.preventDefault();

  }, false);

}



// Parse .json data to translate.
function localeUpdate() {

  for ( var i = 0; i < locale.length; i++ ) {

    var dom = document.getElementById(locale[i].id);
    var obj = locale[i];
    var objState = JSON.stringify(obj.state);
    var objRegEx = new RegExp( `${currentState}(?= |")` , 'g');

    if ( ( ( objState.search(objRegEx) != -1 ) ? 1 : 0) || ( objState.includes('all') ) ) {

      switch ( language ) {

        case 'en':
          dom.innerHTML = locale[i].en;
          break;

        case 'zh':
          dom.innerHTML = locale[i].zh;
          break;

      }

    } else if ( ( ( objState.search('special') != -1 ) ? 1 : 0) ) {

      switch ( currentState ) {

        case 'preview':

          dom.innerHTML = dom.innerHTML.xmlFileRebuilder('update');
          break;

      }

    }

  }

}
