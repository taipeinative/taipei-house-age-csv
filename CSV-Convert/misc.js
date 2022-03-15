/*

'misc.js' Contents
=======================
1 Pre-defied variables
2 Pre-defied functions
  2.1 (String).xmlFileRebuilder();
  2.2 (String).nonHTMLTagReplacer();
  2.3 message();
  2.4 statusUpdate();

*/



// Pre-defined variables.
var logMessage = '';
var logCss1 = '';
var logCss2 = '';





// Pre-defined functions.
// The function handling locale related process. Since it is still a part of core functions, its category is placed in misc.js.
// Note: This function is derived from a part of codeRestorer(); in convert.js before beta 0.2.1. Since the mess original one had created was annoying, I seperated it into two parts.
String.prototype.xmlFileRebuilder = function () {

  var content;
  var result;

  switch (arguments[0]) {

    case 'default':
    default:

      content = this.nonHTMLTagReplacer();

      switch (language) {

        case 'en':

          content = ( (isLonger) ? (`${content} ${locale[14].en}`) : (content + locale[15].en + hiddenCharactersLength + locale[16].en) );
          result = content;
          break;

        case 'zh':

          content = ( (isLonger) ? (`${content} ${locale[14].zh}`) : (content + locale[15].zh + hiddenCharactersLength + locale[16].zh) );
          result = content;
          break;

      }

      break;

    case 'update':

      switch (language) {

        case 'en':

          content = ( (isLonger) ? (`${xml.nonHTMLTagReplacer()} ${locale[14].en}`) : (xml.nonHTMLTagReplacer() + locale[15].en + hiddenCharactersLength + locale[16].en) );
          result = content;
          break;

        case 'zh':

          content = ( (isLonger) ? (`${xml.nonHTMLTagReplacer()} ${locale[14].zh}`) : (xml.nonHTMLTagReplacer() + locale[15].zh + hiddenCharactersLength + locale[16].zh) );
          result = content;
          break;

        }

      break;

  }

  return result;

};





// As the name suggests, it replaces non HTML tags into pure strings.
// Note: This function is derived from a part of codeRestorer(); in convert.js before beta 0.2.1. Since the mess original one had created was annoying, I seperated it into two parts.
/*
  Reference source code & author:

    https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Objects/Object_prototypes, by Mozilla

===================================================================================================
  Following shows how the RegEx (Regular Expressions) work.

    Input XML:    <?xml version="1.0" encoding="UTF-8"?>
                  <a>Link</a>
                  <data>
                    <foo>loo</foo>
                    <bar>par</bar>
                  </data>

    Output HTML:  &lt;?xml version="1.0" encoding="UTF-8"?><br>
                  <a>Link</a><br>
                  &lt;data><br>
                  &ensp;&ensp;&lt;foo>loo&lt;/foo><br>
                  &ensp;&ensp;&lt;bar>par&lt;/bar><br>
                  &lt;/data>

    Looks like:   <?xml version="1.0" encoding="UTF-8"?>
                  Link
                  <data>
                    <foo>loo</foo>
                    <bar>par</bar>
                  </data>

*/
String.prototype.nonHTMLTagReplacer = function () {

  var result;

  if (arguments.length != 0) {

    if (typeof arguments[0] != 'string') {

      var err = new SyntaxError(`${arguments[0]} is not a string.`);
      console.error(err);

    } else {

      result = arguments[0].replace(/<(?!\/*(?=(!--|!DOCTYPE|a|audio|area|b|base|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|dd|del|div|dl|dt|em|embed|fieldset|footer|form|h[1-6]|head|header|hr|html|i|img|input|kbd|label|legend|li|link|main|map|mark|meta|nav|noscript|object|ol|opt-group|option|output|p|param|picture|pre|q|rt|ruby|s|script|section|select|source|span|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video)\W))/g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;');

      return result;

    }

  } else {

    result = this.replace(/<(?!\/*(?=(!--|!DOCTYPE|a|audio|area|b|base|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|dd|del|div|dl|dt|em|embed|fieldset|footer|form|h[1-6]|head|header|hr|html|i|img|input|kbd|label|legend|li|link|main|map|mark|meta|nav|noscript|object|ol|opt-group|option|output|p|param|picture|pre|q|rt|ruby|s|script|section|select|source|span|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video)\W))/g,'&lt;').replace(/\n/g,'<br />').replace(/\t/g,'&ensp;&ensp;');

    return result;

  }


};



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

    case 'convert':
      logMessage = `%c${timestamp}%c [Program] start converting files.`;
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

        case 'convert':
          secondBlock.innerHTML = 'Previewed';
          secondBlock.classList.replace('navbar-focus','navbar-finish');
          thirdBlock.classList.replace('navbar-none','navbar-process');
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
