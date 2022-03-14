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
    var prvRegEx = /<br><span class=\"continue\">\(End of the preview\)<br>\(\d+characters behind\)<\/span>|<br><span class=\"continue\">（預覽結束）<br>（尚有\d+個字元未顯示）<\/span>/;

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

          dom.innerHTML = codeRestorer(dom.innerHTML,'replace');
          break;

      }

    }

  }

}
