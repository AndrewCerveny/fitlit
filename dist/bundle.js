/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _images_runner_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _images_logo_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8);
// Imports





var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_runner_jpg__WEBPACK_IMPORTED_MODULE_3__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_logo_png__WEBPACK_IMPORTED_MODULE_4__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body,\nhtml {\n  background-color: white;\n  background-repeat: no-repeat;\n  font-family: Arial, Helvetica, sans-serif;\n  font-weight: bold;\n}\n\n.background-container {\n  display: flex;\n  flex-direction: row;\n  height: max-content;\n  margin: 0px;\n  width: 100%;\n}\n\n.main-container {\n  background: rgb(61, 19, 156);\n  background: linear-gradient(90deg, rgb(61, 19, 156) 0%, rgb(9, 149, 224) 35%, rgb(227, 125, 245) 100%);\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n  max-height: max-content;\n  width: 100%;\n}\n\n.welcome-section {\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  width: 100%;\n}\n\n.welcome-container {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n}\n\n.user-name {\n  font-size: xx-large;\n}\n\n.user-info {\n  font-size: small;\n}\n\n.header-and-calendar {\n  background-color: #50bfe6;\n  border: 2px solid gray;\n  border-radius: 10px;\n  display: flex;\n  flex-direction: column;\n  width: 65%;\n}\n\n.widgets {\n  align-items: stretch;\n  display: flex;\n  height: 52vh;\n  justify-content: center;\n  width: 100%;\n  margin: 25px;\n}\n\nfooter {\n  background-color: aliceblue;\n  border: 2px solid gray;\n  border-radius: 10px;\n  display: flex;\n  justify-content: center;\n  height: 30vh;\n  opacity: 90%;\n  width: 55vw;\n}\n\nfooter > form {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n}\n\n.header-form {\n  align-items: center;\n  display: flex;\n  justify-content: space-evenly;\n  width: 100%;\n}\n\n.input-form {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  height: 20vh;\n  justify-content: flex-start;\n  margin: 10px;\n  width: 100%;\n}\n\n.turing-logo {\n  border: 2px solid darkslateblue;\n  border-radius: 50%;\n  height: 17vh;\n  width: 20%;\n}\n\naside {\n  background: linear-gradient(90deg, rgb(227, 125, 245) 0%, rgb(61, 19, 156) 100%);\n  border-left: 2px solid plum;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: flex-start;\n  max-height: max-content;\n  width: 15%;\n}\n\n.friends-info {\n  width: 23vw;\n}\n\n.return-to-widget {\n  background-color: #db91ef;\n  border: 1px solid gray;\n  border-radius: 5px;\n  display: block;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 13px;\n  height: 33px;\n  padding-bottom: 3px;\n  text-align: center;\n}\n\nul {\n  align-items: center;\n  background-color: white;\n  display: flex;\n  flex-direction: column;\n  height: 45vh;\n  justify-content: space-evenly;\n  list-style-type: none;\n  margin: 10px;\n  transition-duration: 0.4s;\n  padding: 10px;\n}\n\naside > img {\n  border-radius: 50%;\n  height: 10vh;\n  margin-bottom: 10px;\n  margin-left: 20px;\n}\n\n.user-friends > h2 {\n  font-size: medium;\n  margin: 0px;\n  width: 100%;\n}\n\n.user-friends > h3 {\n  font-size: medium;\n  margin: 0px;\n  width: 35%;\n}\n\n.friends-info {\n  width: 23vw;\n}\n\n.user-friends {\n  align-items: center;\n  background-color: #f7bde6;\n  border: 2px solid gray;\n  border-radius: 10px;\n  display: flex;\n  flex-direction: row;\n  margin-block: 5px;\n  width: 53%;\n}\n\n.sleep-widget,\n.hydration-widget,\n.step-goal-widget {\n  background-color: #818cf8;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);\n  margin-inline: 10px;\n  width: 25vw;\n}\n\n.week-activity {\n  border: 2px solid black;\n  display: flex;\n  justify-content: flex-start;\n  margin: 0px;\n  overflow-y: scroll;\n  padding: 0px;\n}\n\n.sleep-week {\n  border: 2px solid black;\n  overflow-y: scroll;\n}\n\n.sleep-week > ul {\n  height: 10vh;\n}\n\nli {\n  font-size: small;\n  font-weight: normal;\n  list-style-type: none;\n  width: 22vw;\n}\n\np {\n  margin: 5px;\n}\n\n.step-container,\n.sleep-container,\n.hydration-container {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  height: 52vh;\n}\n\n.sleep,\n.hydration,\n.step-goal,\n.activity {\n  background-color: #50bfe6;\n  border: 1px solid gray;\n  border-radius: 10px;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 30px;\n  margin-inline: 10px;\n  width: 25%;\n}\n\n.sleep:focus,\n.hydration:focus,\n.step-goal:focus,\n.activity:focus,\n.return-to-widget:focus,\n.input-btn:focus {\n  outline-style: solid;\n  outline-width: 10px;\n}\n\n.step-goal {\n  margin-inline: 10px;\n}\n\n.sleep:hover,\n.hydration:hover,\n.step-goal:hover,\n.activity:hover {\n  background-color: white;\n}\n\n.log-in-title,\nbutton {\n  font-weight: 700;\n}\n\n.log-in-form label {\n  margin-bottom: 7px;\n}\n\n.log-in-input {\n  border-radius: 5px;\n  padding: 10px;\n}\n\n.log-in-input {\n  margin-bottom: 10px;\n}\n\n.sign-out-button,\n.log-in-btn {\n  align-self: center;\n  border-radius: 21px;\n  background-color: #818cf8;\n  font-size: 17px;\n  font-weight: 400;\n  margin: 4px 0;\n  padding: 8px;\n  width: 30%;\n}\n\n.sign-out-button {\n  width: 10%;\n}\n\n.log-in-section {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-position: center;\n  background-size: 100%;\n  align-items: center;\n  display: flex;\n  height: 100vh;\n  justify-content: center;\n  overflow-y: scroll;\n  overflow-x: unset;\n  width: 100%;\n}\n\n.log-in-form {\n  align-items: center;\n  background-color: aliceblue;\n  border-radius: 6px;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);\n  display: flex;\n  flex-direction: column;\n  height: 50vh;\n  margin-top: 0%;\n  opacity: 80%;\n  padding: 12px;\n  text-transform: uppercase;\n  width: 50%;\n}\n\n.log-in-title {\n  text-align: center;\n  text-transform: uppercase;\n}\n\n.log-in-btn {\n  text-transform: uppercase;\n  width: 48%;\n}\n\n.turing-logo {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n}\n\n.sleep-form,\n.hydration-form,\n.activity-form {\n  display: flex;\n  justify-content: center;\n  width: 85%;\n}\n\n.sleep-form > input,\n.activity-form > input {\n  margin: 10px;\n  width: 30%;\n}\n\n.hydration-form > input {\n  margin: 10px;\n  width: 50%;\n}\n\n.compare-activity > ul {\n  padding: 0px;\n}\n\n.compare-activity {\n  margin: 0px;\n  padding: 0px;\n}\n\nspan {\n  color: #50bfe6;\n  font-weight: normal;\n}\n\n.category-options {\n  background-color: #bcc2f9;\n}\n\n.hidden {\n  display: none;\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"AAAA;;EAEE,uBAAA;EACA,4BAAA;EACA,yCAAA;EACA,iBAAA;AACF;;AAEA;EACE,aAAA;EACA,mBAAA;EACA,mBAAA;EACA,WAAA;EACA,WAAA;AACF;;AAEA;EACE,4BAAA;EACA,sGAAA;EAMA,aAAA;EACA,sBAAA;EACA,6BAAA;EACA,mBAAA;EACA,uBAAA;EACA,WAAA;AAJF;;AAOA;EACE,mBAAA;EACA,aAAA;EACA,mBAAA;EACA,6BAAA;EACA,WAAA;AAJF;;AAOA;EACE,mBAAA;EACA,aAAA;EACA,sBAAA;AAJF;;AAOA;EACE,mBAAA;AAJF;;AAOA;EACE,gBAAA;AAJF;;AAOA;EACE,yBAAA;EACA,sBAAA;EACA,mBAAA;EACA,aAAA;EACA,sBAAA;EACA,UAAA;AAJF;;AAOA;EACE,oBAAA;EACA,aAAA;EACA,YAAA;EACA,uBAAA;EACA,WAAA;EACA,YAAA;AAJF;;AAOA;EACE,2BAAA;EACA,sBAAA;EACA,mBAAA;EACA,aAAA;EACA,uBAAA;EACA,YAAA;EACA,YAAA;EACA,WAAA;AAJF;;AAOA;EACE,mBAAA;EACA,aAAA;EACA,sBAAA;AAJF;;AAOA;EACE,mBAAA;EACA,aAAA;EACA,6BAAA;EACA,WAAA;AAJF;;AAOA;EACE,mBAAA;EACA,aAAA;EACA,sBAAA;EACA,YAAA;EACA,2BAAA;EACA,YAAA;EACA,WAAA;AAJF;;AAOA;EACE,+BAAA;EACA,kBAAA;EACA,YAAA;EACA,UAAA;AAJF;;AAOA;EACE,gFAAA;EAKA,2BAAA;EACA,aAAA;EACA,sBAAA;EACA,2BAAA;EACA,uBAAA;EACA,uBAAA;EACA,UAAA;AARF;;AAWA;EACE,WAAA;AARF;;AAWA;EACE,yBAAA;EACA,sBAAA;EACA,kBAAA;EACA,cAAA;EACA,yCAAA;EACA,eAAA;EACA,YAAA;EACA,mBAAA;EACA,kBAAA;AARF;;AAWA;EACE,mBAAA;EACA,uBAAA;EACA,aAAA;EACA,sBAAA;EACA,YAAA;EACA,6BAAA;EACA,qBAAA;EACA,YAAA;EACA,yBAAA;EACA,aAAA;AARF;;AAWA;EACE,kBAAA;EACA,YAAA;EACA,mBAAA;EACA,iBAAA;AARF;;AAWA;EACE,iBAAA;EACA,WAAA;EACA,WAAA;AARF;;AAWA;EACE,iBAAA;EACA,WAAA;EACA,UAAA;AARF;;AAWA;EACE,WAAA;AARF;;AAWA;EACE,mBAAA;EACA,yBAAA;EACA,sBAAA;EACA,mBAAA;EACA,aAAA;EACA,mBAAA;EACA,iBAAA;EACA,UAAA;AARF;;AAWA;;;EAGE,yBAAA;EACA,kFAAA;EACA,mBAAA;EACA,WAAA;AARF;;AAWA;EACE,uBAAA;EACA,aAAA;EACA,2BAAA;EACA,WAAA;EACA,kBAAA;EACA,YAAA;AARF;;AAWA;EACE,uBAAA;EACA,kBAAA;AARF;;AAWA;EACE,YAAA;AARF;;AAWA;EACE,gBAAA;EACA,mBAAA;EACA,qBAAA;EACA,WAAA;AARF;;AAWA;EACE,WAAA;AARF;;AAWA;;;EAGE,mBAAA;EACA,aAAA;EACA,sBAAA;EACA,YAAA;AARF;;AAWA;;;;EAIE,yBAAA;EACA,sBAAA;EACA,mBAAA;EACA,yCAAA;EACA,eAAA;EACA,mBAAA;EACA,UAAA;AARF;;AAWA;;;;;;EAME,oBAAA;EACA,mBAAA;AARF;;AAWA;EACE,mBAAA;AARF;;AAWA;;;;EAIE,uBAAA;AARF;;AAWA;;EAEE,gBAAA;AARF;;AAWA;EACE,kBAAA;AARF;;AAWA;EACE,kBAAA;EACA,aAAA;AARF;;AAWA;EACE,mBAAA;AARF;;AAWA;;EAEE,kBAAA;EACA,mBAAA;EACA,yBAAA;EACA,eAAA;EACA,gBAAA;EACA,aAAA;EACA,YAAA;EACA,UAAA;AARF;;AAWA;EACE,UAAA;AARF;;AAWA;EACE,yDAAA;EACA,2BAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;EACA,aAAA;EACA,uBAAA;EACA,kBAAA;EACA,iBAAA;EACA,WAAA;AARF;;AAWA;EACE,mBAAA;EACA,2BAAA;EACA,kBAAA;EACA,kFAAA;EACA,aAAA;EACA,sBAAA;EACA,YAAA;EACA,cAAA;EACA,YAAA;EACA,aAAA;EACA,yBAAA;EACA,UAAA;AARF;;AAWA;EACE,kBAAA;EACA,yBAAA;AARF;;AAWA;EACE,yBAAA;EACA,UAAA;AARF;;AAWA;EACE,yDAAA;AARF;;AAWA;;;EAGE,aAAA;EACA,uBAAA;EACA,UAAA;AARF;;AAWA;;EAEE,YAAA;EACA,UAAA;AARF;;AAWA;EACE,YAAA;EACA,UAAA;AARF;;AAWA;EACE,YAAA;AARF;;AAWA;EACE,WAAA;EACA,YAAA;AARF;;AAWA;EACE,cAAA;EACA,mBAAA;AARF;;AAWA;EACE,yBAAA;AARF;;AAWA;EACE,aAAA;AARF","sourcesContent":["body,\nhtml {\n  background-color: white;\n  background-repeat: no-repeat;\n  font-family: Arial, Helvetica, sans-serif;\n  font-weight: bold;\n}\n\n.background-container {\n  display: flex;\n  flex-direction: row;\n  height: max-content;\n  margin: 0px;\n  width: 100%;\n}\n\n.main-container {\n  background: rgb(61, 19, 156);\n  background: linear-gradient(\n    90deg,\n    rgba(61, 19, 156, 1) 0%,\n    rgba(9, 149, 224, 1) 35%,\n    rgba(227, 125, 245, 1) 100%\n  );\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n  max-height: max-content;\n  width: 100%;\n}\n\n.welcome-section {\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  width: 100%;\n}\n\n.welcome-container {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n}\n\n.user-name {\n  font-size: xx-large;\n}\n\n.user-info {\n  font-size: small;\n}\n\n.header-and-calendar {\n  background-color: #50bfe6;\n  border: 2px solid gray;\n  border-radius: 10px;\n  display: flex;\n  flex-direction: column;\n  width: 65%;\n}\n\n.widgets {\n  align-items: stretch;\n  display: flex;\n  height: 52vh;\n  justify-content: center;\n  width: 100%;\n  margin: 25px;\n}\n\nfooter {\n  background-color: aliceblue;\n  border: 2px solid gray;\n  border-radius: 10px;\n  display: flex;\n  justify-content: center;\n  height: 30vh;\n  opacity: 90%;\n  width: 55vw;\n}\n\nfooter > form {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n}\n\n.header-form {\n  align-items: center;\n  display: flex;\n  justify-content: space-evenly;\n  width: 100%;\n}\n\n.input-form {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  height: 20vh;\n  justify-content: flex-start;\n  margin: 10px;\n  width: 100%;\n}\n\n.turing-logo {\n  border: 2px solid darkslateblue;\n  border-radius: 50%;\n  height: 17vh;\n  width: 20%;\n}\n\naside {\n  background: linear-gradient(\n    90deg,\n    rgba(227, 125, 245, 1) 0%,\n    rgba(61, 19, 156, 1) 100%\n    );\n  border-left: 2px solid plum;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: flex-start;\n  max-height: max-content;\n  width: 15%;\n}\n\n.friends-info {\n  width: 23vw;\n}\n\n.return-to-widget {\n  background-color: #db91ef;\n  border: 1px solid gray;\n  border-radius: 5px;\n  display: block;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 13px;\n  height: 33px;\n  padding-bottom: 3px;\n  text-align: center;\n}\n\nul {\n  align-items: center;\n  background-color: white;\n  display: flex;\n  flex-direction: column;\n  height: 45vh;\n  justify-content: space-evenly;\n  list-style-type: none;\n  margin: 10px;\n  transition-duration: 0.4s;\n  padding: 10px;\n}\n\naside > img {\n  border-radius: 50%;\n  height: 10vh;\n  margin-bottom: 10px;\n  margin-left: 20px;\n}\n\n.user-friends > h2 {\n  font-size: medium;\n  margin: 0px;\n  width: 100%;\n}\n\n.user-friends > h3 {\n  font-size: medium;\n  margin: 0px;\n  width: 35%;\n}\n\n.friends-info {\n  width: 23vw;\n}\n\n.user-friends {\n  align-items: center;\n  background-color: #f7bde6;\n  border: 2px solid gray;\n  border-radius: 10px;\n  display: flex;\n  flex-direction: row;\n  margin-block: 5px;\n  width: 53%;\n}\n\n.sleep-widget,\n.hydration-widget,\n.step-goal-widget {\n  background-color: #818cf8;\n  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  margin-inline: 10px;\n  width: 25vw;\n}\n\n.week-activity {\n  border: 2px solid black;\n  display: flex;\n  justify-content: flex-start;\n  margin: 0px;\n  overflow-y: scroll;\n  padding: 0px;\n}\n\n.sleep-week {\n  border: 2px solid black;\n  overflow-y: scroll;\n}\n\n.sleep-week > ul {\n  height: 10vh;\n}\n\nli {\n  font-size: small;\n  font-weight: normal;\n  list-style-type: none;\n  width: 22vw;\n}\n\np {\n  margin: 5px;\n}\n\n.step-container,\n.sleep-container,\n.hydration-container {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  height: 52vh;\n}\n\n.sleep,\n.hydration,\n.step-goal,\n.activity {\n  background-color: #50bfe6;\n  border: 1px solid gray;\n  border-radius: 10px;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 30px;\n  margin-inline: 10px;\n  width: 25%;\n}\n\n.sleep:focus,\n.hydration:focus,\n.step-goal:focus,\n.activity:focus,\n.return-to-widget:focus,\n.input-btn:focus {\n  outline-style: solid;\n  outline-width: 10px;\n}\n\n.step-goal {\n  margin-inline: 10px;\n}\n\n.sleep:hover,\n.hydration:hover,\n.step-goal:hover,\n.activity:hover {\n  background-color: white;\n}\n\n.log-in-title,\nbutton {\n  font-weight: 700;\n}\n\n.log-in-form label {\n  margin-bottom: 7px;\n}\n\n.log-in-input {\n  border-radius: 5px;\n  padding: 10px;\n}\n\n.log-in-input {\n  margin-bottom: 10px;\n}\n\n.sign-out-button,\n.log-in-btn {\n  align-self: center;\n  border-radius: 21px;\n  background-color: #818cf8;\n  font-size: 17px;\n  font-weight: 400;\n  margin: 4px 0;\n  padding: 8px;\n  width: 30%;\n}\n\n.sign-out-button {\n  width: 10%;\n}\n\n.log-in-section {\n  background-image: url(\"/src/images/runner.jpg\");\n  background-position: center;\n  background-size: 100%;\n  align-items: center;\n  display: flex;\n  height: 100vh;\n  justify-content: center;\n  overflow-y: scroll;\n  overflow-x: unset;\n  width: 100%;\n}\n\n.log-in-form {\n  align-items: center;\n  background-color: aliceblue;\n  border-radius: 6px;\n  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  display: flex;\n  flex-direction: column;\n  height: 50vh;\n  margin-top: 0%;\n  opacity: 80%;\n  padding: 12px;\n  text-transform: uppercase;\n  width: 50%;\n}\n\n.log-in-title {\n  text-align: center;\n  text-transform: uppercase;\n}\n\n.log-in-btn {\n  text-transform: uppercase;\n  width: 48%;\n}\n\n.turing-logo {\n  background-image: url(\"/src/images/logo.png\");\n}\n\n.sleep-form,\n.hydration-form,\n.activity-form {\n  display: flex;\n  justify-content: center;\n  width: 85%;\n}\n\n.sleep-form > input,\n.activity-form > input {\n  margin: 10px;\n  width: 30%;\n}\n\n.hydration-form > input {\n  margin: 10px;\n  width: 50%;\n}\n\n.compare-activity > ul {\n  padding: 0px;\n}\n\n.compare-activity {\n  margin: 0px;\n  padding: 0px;\n}\n\nspan {\n  color: #50bfe6;\n  font-weight: normal;\n}\n\n.category-options {\n  background-color: #bcc2f9;\n}\n\n.hidden {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/runner.jpg");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/logo.png");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/exercise.png");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/sleeping.png");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/water.png");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/friends2.jpg");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _User__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


class UserRepository {
	constructor(allUserData) {
		this.allUsers = allUserData;
		this.currentUser;
	}
	findUser(id) {
		const user = this.allUsers.find(user => user.id === id);
		this.currentUser = new _User__WEBPACK_IMPORTED_MODULE_0__["default"](user);
		return user;
	}
	calculateAverageStepGoal() {
		const averageStepGoal = this.allUsers.reduce((total, user) => {
			total += user.dailyStepGoal;
		return total;
		}, 0) / this.allUsers.length;
		return averageStepGoal;
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UserRepository);

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.address = userData.address;
    this.email = userData.email;
    this.strideLength = userData.strideLength;
    this.dailyStepGoal = userData.dailyStepGoal;
    this.friends = userData.friends;
  }
  firstName() {
    let names = this.name.split(" ");
    return names[0];
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (User);

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Your fetch requests will live here!

const getAPIData = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .catch((err) => console.log("error", err));
};



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getAPIData);





/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Hydration {
  constructor(hydrationData) {
    this.userID = hydrationData.userID;
    this.date = hydrationData.date;
    this.numOunces = hydrationData.numOunces;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hydration);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class HydrationRepository {
  constructor(allHydrationData) {
    this.allHydrationData = allHydrationData;
  }
  filterHydrationByUser(id) {
    const userHydroData = this.allHydrationData.filter((user) => user.userID === id);
    return userHydroData;
  }
  findTodaysHydration(id) {
    const usersHydroData = this.filterHydrationByUser(id);
    const todaysData = usersHydroData.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    return todaysData[0];
  }
  findWeeklyHydration(date, id) {
    const usersWeeklyData = this.filterHydrationByUser(id);
    const getIndexDate = usersWeeklyData.findIndex((user) => {
      return user.date === date;
    });
    const weeklyData = usersWeeklyData.slice(getIndexDate - 6 , getIndexDate + 1);
    return weeklyData;
  }
  getAverageHydration(id) {
    const allUserData = this.filterHydrationByUser(id);
    const usersAverage = allUserData.reduce((num, day) => {
      num += day.numOunces;
      return num;
    }, 0);
    return usersAverage / allUserData.length;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HydrationRepository);

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Sleep {
  constructor(sleepData) {
    this.userID = sleepData.userID;
    this.date = sleepData.date;
    this.hoursSlept = sleepData.hoursSlept;
    this.sleepQuality = sleepData.sleepQuality;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sleep);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class SleepRepository {
  constructor(userSleepData) {
    this.sleepData = userSleepData;
  }
  filterSleepByUser(id) {
    let totalUserData = this.sleepData.filter(user => user.userID === id);
    return totalUserData;
  }
  findTodaysData(id) {
    const usersSleepData = this.filterSleepByUser(id).sort((a,b) => new Date(b.date)- new Date(a.date))
    return usersSleepData[0];
  }
  calculateAverageSleepPerDay(type, filterData, id) {
    let value = this.filterSleepByUser(id);
    let total = value.reduce((total, num) => {
      return total += num[type];
    }, 0);
    return Math.round(total/filterData.length);
  }
  calculateSleepByDate(date, type, id) {
    if(date) {
      let value = this.filterSleepByUser(id);
      let dataByDate = value
        .filter(user => user.date === date)
        .map(user => user[type]);
      return dataByDate;
    } else {
      return 'Pick a date';
    };
  }
  findWeeklyData(date, id) {
    const userSleepInfo = this.filterSleepByUser(id)
    const lastIndex = userSleepInfo.findIndex((user) => user.date === date);
    const todayIndex = lastIndex + 1
    const firstIndex = lastIndex - 6
    const weeklySleep = userSleepInfo.slice(firstIndex,todayIndex);
    return weeklySleep;
  }
  calculateAvgSleepPerWeek(date, id, type) {
    let value = this.filterSleepByUser(id);
    let findentryDate = value.find(entry => entry.date === date);
    let startingIndex = value.indexOf(findentryDate);
    let selectedWeek = value.slice(startingIndex - 6, startingIndex + 1);
    const result = selectedWeek.reduce((num, day) => {
      num += day[type]
      return num
    }, 0)/selectedWeek.length
    return Math.round(result)
  }
  calcAvgSleepStats(type) {
    let total = this.sleepData.reduce((total, num) => {
      return total += num[type];
    }, 0);
    return Math.round(total / this.sleepData.length);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SleepRepository);

/***/ }),
/* 20 */
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t)}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return O},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Activity {
    constructor(activityData) {
        this.userID = activityData.userID;
        this.date = activityData.date;
        this.numSteps = activityData.numSteps;
        this.minutesActive = activityData.minutesActive;
        this.flightsOfStairs = activityData.flightsOfStairs;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Activity);

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ActivityRepository {
  constructor(allActivityData) {
    this.activityData = allActivityData;
    this.currentUsersActivities = null;
  }
  filterById(currentUserId) {
    const usersActivities = this.activityData.filter((activity) => activity.userID === currentUserId);
    this.currentUsersActivities = usersActivities;
    return usersActivities;
  }
  findDate(date) {
    const getDay = this.currentUsersActivities.find((activity) => activity.date === date);
    return getDay;
  }
  findMilesWalked(date, currentUser) {
    if (!date) {
      return "Please pick a date!";
    } else {
      const specifiedDate = this.findDate(date);
      const milesValue = specifiedDate.numSteps * currentUser.strideLength;
      const totalValue = milesValue / 5280;
      return Number(totalValue.toFixed(2));
    };
  }
  findActiveMinOnDay(date) {
    if (!date) {
      return "Please pick a date!";
    } else {
      const specifiedDate = this.findDate(date);
      return specifiedDate.minutesActive;
    };
  }
  findWeeklyData(date) {
    const findIndex = this.currentUsersActivities.findIndex((activity) => activity.date === date);
    const weeklyActivity = this.currentUsersActivities.slice(findIndex, findIndex + 7);
      return weeklyActivity;
  }
  findAvgMinGivenWeek(date) {
    if (!date) {
      return "Please pick a date!";
    } else {
      const weeklyActivity = this.findWeeklyData(date);
      const weeklyAvg =
        weeklyActivity.reduce((num, day) => {
          num += day.minutesActive;
          return num;
        }, 0) / weeklyActivity.length;
      return Math.trunc(weeklyAvg);
    };
  }
  determineGoalMet(date, currentUser) {
    const specifiedDate = this.findDate(date);
    if (specifiedDate.numSteps >= currentUser.dailyStepGoal) {
      return true;
    } else {
      return false;
    }
  }
  determineTodayData() {
    const latestDate = this.currentUsersActivities.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return latestDate;
  }
  findDaysExceededGoal(userID, currentUser) {
    const activityData = this.filterById(userID);
    return activityData.filter(
      (activity) => activity.numSteps > currentUser.dailyStepGoal
    );
  }
  findClimbingRecord(userID) {
    const userActivity = this.filterById(userID);
    const climbData = userActivity.map((activity) => activity.flightsOfStairs);
    return Math.max(...climbData);
  }
  getUsersAvgForDay(date, key) {
    const dataForDay = this.activityData.filter((activity) => activity.date === date);
    const totalForDay =
      dataForDay.reduce((total, activity) => {
        return (total += activity[key]);
      }, 0) / dataForDay.length;
    return Math.round(totalForDay);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ActivityRepository);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _src_images_exercise_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _src_images_sleeping_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var _src_images_water_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _src_images_friends2_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);
/* harmony import */ var _UserRepository__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _apiCalls__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(15);
/* harmony import */ var _User__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(14);
/* harmony import */ var _Hydration__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);
/* harmony import */ var _HydrationRepository__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(17);
/* harmony import */ var _Sleep_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(18);
/* harmony import */ var _SleepRepository__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(19);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(20);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _Activity__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(21);
/* harmony import */ var _ActivityRepository__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(22);
















let allUserData;
let allSleepData;
let allHydroData;
let allActivityData;
let userRepository;
let currentUser;
let currentUserID;
let sleepRepository;
let hydrationRepository;
let dateForWeek;
let activityRepository;

const userAPI = "http://localhost:3001/api/v1/users";
const sleepAPI = "http://localhost:3001/api/v1/sleep";
const hydrationAPI = "http://localhost:3001/api/v1/hydration";
const activityAPI = "http://localhost:3001/api/v1/activity";

function getPageData() {
  Promise.all([
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(userAPI),
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(sleepAPI),
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(hydrationAPI),
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(activityAPI),
  ])
    .then((response) => {
      allUserData = response[0].userData;
      allSleepData = response[1].sleepData;
      allHydroData = response[2].hydrationData;
      allActivityData = response[3].activityData;
      createClassInstances(allUserData, allSleepData, allHydroData, allActivityData);
    })
    .catch((error) => {
      fetchFailureDisplay.classList.remove("hidden");
    });
};

const hydrationBtn = document.querySelector("#hydration");
const hydrationDisplay = document.querySelector(".hydration-widget");
const toggleHomeBtn = document.querySelector(".back-home");
const ouncesDrankToday = document.getElementById("todaysOz");
const calendarSub = document.getElementById("dateInput");
const calendarDate = document.getElementById("calendar");
const hydrationWeeklyAvg = document.getElementById("weeklyAvg");
const hydroAllTimeAvgArea = document.getElementById("allTimeAvg");
const welcomeContainer = document.getElementById("user-info");
const stepsWidget = document.getElementById("steps-widget");
const stepsButton = document.getElementById("steps");
const strideLengthDisplay = document.getElementById("strideLength");
const todaysStepsDisplay = document.getElementById("todaysSteps");
const todaysActivity = document.getElementById("todaysActivity");
const weekActivityDisplay = document.querySelector(".week-activity");
const todaysMilesDisplay = document.getElementById("todaysMiles");
const stepGoalDisplay = document.getElementById("stepGoal");
const avgStepGoalDisplay = document.getElementById("avgStepGoal");
const compareSteps = document.getElementById("vsSteps");
const compareMinActive = document.getElementById("vsMinActive");
const compareStairs = document.getElementById("vsStairs");
const userFriendsSection = document.getElementById("friends-info");
const returnStepsWidgetButton = document.getElementById("return-to-widget");
const sleepWidgetButton = document.getElementById("sleep");
const sleepWidget = document.getElementById("sleep-widget");
const returnSleepWidgetButton = document.getElementById("return-to-sleep-widget");
const hoursSleptDisplay = document.getElementById("hoursSlept");
const sleepQualityDisplay = document.getElementById("sleepQuality");
const avgHoursSleptDisplay = document.getElementById("avgHoursSlept");
const avgSleepQualityDisplay = document.getElementById("avgSleepQuality");
const fetchFailureDisplay = document.getElementById("fetch-failure");
const showFormBtn = document.getElementById("input-btn");
const radioSleep = document.getElementById("sleep-input");
const radioHydration = document.getElementById("hydration-input");
const radioActivity = document.getElementById("activity-input");
const sleepForm = document.querySelector(".sleep-form");
const hydrationForm = document.querySelector(".hydration-form");
const activityForm = document.querySelector(".activity-form");
const inputSub = document.querySelector(".form-submit");
const inputDate = document.querySelector(".input-date");
const inputHoursSlept = document.querySelector(".hours-Slept");
const inputSleepQuality = document.querySelector(".sleep-Quality");
const inputOzDrank = document.querySelector(".number-of-oz");
const inputStairs = document.querySelector(".flights-of-stairs");
const inputMinActive = document.querySelector(".minutes-active");
const inputSteps = document.querySelector(".number-of-steps");
const postForm = document.getElementById("post-form");
const postSuccessDisplay = document.querySelector(".post-success-section");
const sleepWeek = document.getElementById("sleep-week");
const doublePostSection = document.getElementById("double-post-section");
const body = document.querySelector(".main-container");
const friendsSection = document.getElementById("friends-container");
const logInSection = document.getElementById("logInSection");
const logInForm = document.getElementById("logInForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const signOutBtn = document.getElementById("signOutBtn");
const logInBtn = document.getElementById("logInBtn");


const domUpdates = {
  displayInvalidLogIn: function() {
    console.log("this is firing")
    window.alert("Sorry, please enter a valid username and password")
  },

  resetInnerHTML: function(element) {
    element.innerText = ``
  },

  showSection: function(element) {
    element.classList.remove("hidden");
  },

  hideSection: function(element) {
    element.classList.add("hidden");
  }
};


hydrationBtn.addEventListener("click",function() {
  showHydrationArea();
  displayHydrationDom();
});
toggleHomeBtn.addEventListener("click", (event) => {
  returnToWidget(event, hydrationBtn, toggleHomeBtn, hydrationDisplay);
});
window.addEventListener("load", function () {
  calendarSub.disabled = true;
  getPageData();
  showLogInSection();
  checkLogInCredentials();
});
stepsButton.addEventListener("click", updateStepWidget);
returnStepsWidgetButton.addEventListener("click", (event) => {
  returnToWidget(event, stepsButton, stepsWidget, returnStepsWidgetButton);
});
sleepWidgetButton.addEventListener("click", () => {
  sleepWeek.classList.remove("hidden")
  showArea(sleepWidgetButton, sleepWidget, returnSleepWidgetButton);
  updateSleepData()
});
returnSleepWidgetButton.addEventListener("click", (event) => {
  sleepWeek.classList.add("hidden")
  returnToWidget(event, sleepWidgetButton, sleepWidget, returnSleepWidgetButton)
});
calendarSub.addEventListener("click", (e) => {
  e.preventDefault();
  displayWeeklyAverage();
});
calendarDate.addEventListener("mousedown", enableSubmit);
showFormBtn.addEventListener("click", (event) => {
  showInputForm(event);
});
inputSub.addEventListener("click", (event) => {
  createPostObject(event);
});
postForm.addEventListener("click", toggleAriaChecked);
logInBtn.addEventListener("click", checkLogInCredentials);
signOutBtn.addEventListener("click", showLogInSection);


function createClassInstances(dataSet1, dataSet2, dataSet3, dataSet4) {
  allUserData = dataSet1.map((user) => new _User__WEBPACK_IMPORTED_MODULE_7__["default"](user));
  userRepository = new _UserRepository__WEBPACK_IMPORTED_MODULE_5__["default"](allUserData);
  allSleepData = dataSet2.map((data) => new _Sleep_js__WEBPACK_IMPORTED_MODULE_10__["default"](data));
  sleepRepository = new _SleepRepository__WEBPACK_IMPORTED_MODULE_11__["default"](allSleepData);
  allHydroData = dataSet3.map((data) => new _Hydration__WEBPACK_IMPORTED_MODULE_8__["default"](data));
  hydrationRepository = new _HydrationRepository__WEBPACK_IMPORTED_MODULE_9__["default"](allHydroData);
  allActivityData = dataSet4.map((data) => new _Activity__WEBPACK_IMPORTED_MODULE_13__["default"](data));
  activityRepository = new _ActivityRepository__WEBPACK_IMPORTED_MODULE_14__["default"](allActivityData);
};

function checkLogInCredentials() {
  const test = username.value.substring(0,4);
  if (test === 'user' && username.value.length >= 5 && username.value.length < 7 && password.value === 'fitlit') {
    const allChar = username.value.split('');
    const getNumber = allChar.filter(char => {
      return Number(char);
    })
    if(allChar[5] === '0') {
      getNumber.push('0');
    }
    const getString = getNumber.join('');
    const convertToNum = Number(getString);
    const userObj = userRepository.findUser(convertToNum);
    currentUser = userObj;
    currentUserID = userObj.id;
    updateUserInfo();
    updateFriendsInfo();
    hideLogInSection();
    logInForm.reset();
    return currentUserID;
  } else if (username.value || password.value) {
    domUpdates.displayInvalidLogIn();
    logInForm.reset();
  }
};

function updateUserInfo() {
  welcomeContainer.innerHTML = `
  <h1 class="user-name">Welcome, ${currentUser.firstName()}!</h1>
  <h2 class="user-info">${currentUser.address}, ${currentUser.email}</h2>`;
};

function updateFriendsInfo() {
  userFriendsSection.innerHTML = '';
  allUserData[currentUserID].friends.forEach((friend) => {
    userFriendsSection.innerHTML += `<div class="user-friends" id="friend">
      <h2>${userRepository.findUser(friend).name}</h2><br>
      <h3>Step Goal: ${userRepository.findUser(friend).dailyStepGoal}</h3>
    </div>`;
  });
};

function showHydrationArea() {
  showArea(hydrationBtn, toggleHomeBtn, hydrationDisplay);
};

function displayHydrationDom() {
 displayTodaysHydration(hydrationRepository,currentUserID);
 displayAverageConsumed();
 restrictCalendarRange();
};

function restrictCalendarRange() {
  const usersRecordedDates = hydrationRepository.filterHydrationByUser(currentUserID);
  const min = usersRecordedDates.sort((a,b)=> new Date(a.date) - new Date(b.date));
  const minDateEdit = min[0].date;
  const minValue = minDateEdit.replaceAll("/", "-");
  const max = min.reverse()[0].date;
  const maxValue = max.replaceAll("/", "-");
  calendarDate.setAttribute("max", maxValue);
  calendarDate.setAttribute("min", minValue);
};

function displayTodaysHydration(hydrationRepository, currentUserID) {
  const hydroToday = hydrationRepository.findTodaysHydration(currentUserID);
  ouncesDrankToday.innerHTML = `<li> Today:${hydroToday.date} you drank <span>${hydroToday.numOunces} oz</span>!</li>`;
};

function displayWeeklyAverage() {
  if(calendarDate.value) {
  calendarSub.disabled = false  
  hydrationWeeklyAvg.innerHTML = '';
	const chosenDate = calendarDate.value; 
	const alteredDate = chosenDate.replaceAll('-',"/");
	const userWeeklyData = hydrationRepository.findWeeklyHydration(alteredDate,currentUserID);
	userWeeklyData.forEach((recordedDay) => {
    console.log("TEST DATES", recordedDay)
		hydrationWeeklyAvg.innerHTML += 
    `<p class="hydration-weekly">${dayjs__WEBPACK_IMPORTED_MODULE_12___default()(recordedDay.date).format('dd/MMM/D/YYYY')} you consumed <span>${recordedDay.numOunces} ounces</span>
		</p>`;
	});
  } else {
    calendarSub.disabled = true;
  }
}

function displayAverageConsumed() {
  const averageWaterAllTime = hydrationRepository.getAverageHydration(currentUserID);
  const roundedAverage = Math.trunc(averageWaterAllTime);
  hydroAllTimeAvgArea.innerHTML = `<li>All time average oz consumed is <span>${roundedAverage} oz</span>!</li>`;
};

function findWeeklyData() {
  weekActivityDisplay.innerHTML = `<li>Your Activity for the Week</li>`;
  const userActivity = activityRepository.filterById(currentUserID);
  const todayActivity = activityRepository.determineTodayData();
  const weeklyData = activityRepository.findWeeklyData(todayActivity.date).reverse();
  const weeklyKey = weeklyData.forEach((dayActivity) => {
    weekActivityDisplay.innerHTML += `
      <li>${dayActivity.date}: </li>
      <li>Steps: <span>${dayActivity.numSteps}</span></li>
      <li>Stairs Climbed: <span>${dayActivity.flightsOfStairs}</span></li>
      <li>Minutes Active: <span>${dayActivity.minutesActive}</span></li>
    `;
  });
};

function updateStepWidget() {
  showArea(stepsButton, stepsWidget, returnStepsWidgetButton);
  findWeeklyData()
  const userActivity = activityRepository.filterById(currentUserID);
  const todayActivity = activityRepository.determineTodayData();
  const userStepsToday = todayActivity.numSteps;
  const userMinActiveToday = todayActivity.minutesActive;
  const userStairsClimbed = todayActivity.flightsOfStairs;
  const numOfMiles = activityRepository.findMilesWalked(todayActivity.date,currentUser);
  const avgSteps = activityRepository.getUsersAvgForDay(todayActivity.date,"numSteps");
  const avgMinActive = activityRepository.getUsersAvgForDay(todayActivity.date, "minutesActive");
  const avgStairsClimbed = activityRepository.getUsersAvgForDay(todayActivity.date,"flightsOfStairs");
  strideLengthDisplay.innerHTML = `<li>Stride Length: <span>${currentUser.strideLength}</span></li>`;
  todaysStepsDisplay.innerHTML = `<li> Today's Steps: <span>${userStepsToday}</span></li>`;
  todaysActivity.innerHTML = `<li> Your Activity For Today ${todayActivity.date}: <span>${userMinActiveToday} minutes</span></li>`;
  compareSteps.innerHTML = `<li> Steps Activity: <span>${userStepsToday}</span> vs <span>${avgSteps}</span></li>`;
  compareMinActive.innerHTML = `<li> Minutes Activity: <span>${userMinActiveToday}</span> vs <span>${avgMinActive}</span></li>`;
  compareStairs.innerHTML = `<li> Stairs Climbed: <span>${userStairsClimbed}</span> vs <span>${avgStairsClimbed}</span></li>`;
  todaysMilesDisplay.innerHTML = `<li> Miles Walked Today: <span>${numOfMiles} miles </span></li>`;
  stepGoalDisplay.innerHTML = `<li>Your Daily Step Goal: <span>${currentUser.dailyStepGoal} Steps </span></li>`;
  avgStepGoalDisplay.innerHTML= `<li>Average Step Goal for All Users: <span>${userRepository.calculateAverageStepGoal()} Steps</span></li>`;
};

function returnToWidget(event, area1, area2, area3) {
  event.preventDefault();
  hideArea(area1, area2, area3);
};

function showArea(area1, area2, area3) {
  area1.classList.add("hidden");
  area2.classList.remove("hidden");
  area3.classList.remove("hidden");
};

function hideArea(area1, area2, area3) {
  area1.classList.remove("hidden");
  area2.classList.add("hidden");
  area3.classList.add("hidden");
};

function updateSleepData() {
  const userSleep = sleepRepository.filterSleepByUser(currentUserID);
  const todaySleep = sleepRepository.findTodaysData(currentUserID);
  const weeklySleep = sleepRepository.findWeeklyData(todaySleep.date, currentUserID);
  const avgHoursSlept = sleepRepository.calculateAvgSleepPerWeek(todaySleep.date, currentUserID, "hoursSlept");
  const avgSleepQuality = sleepRepository.calculateAvgSleepPerWeek(todaySleep.date, currentUserID, "sleepQuality");
  sleepWeek.innerHTML ='Your Sleep Data for the Week:';
  const weeklyKey = weeklySleep.forEach(dayActivity => {
    sleepWeek.innerHTML += `
      <li>${dayActivity.date}: </li>
      <li>Hours Slept: <span>${dayActivity.hoursSlept}</span></li>
      <li>Sleep Quality: <span>${dayActivity.sleepQuality}</span></li>
      `;
    });
  hoursSleptDisplay.innerHTML = `<li>Hours Slept Today ${todaySleep.date} : <span>${todaySleep.hoursSlept}</span></li>`;
  sleepQualityDisplay.innerHTML = `<li>Sleep Quality for Today: <span>${todaySleep.sleepQuality}</span></li>`;
  avgHoursSleptDisplay.innerHTML = `<li>Your All Time Hours Slept Average: <span>${avgHoursSlept} hours</span></li>`;
  avgSleepQualityDisplay.innerHTML = `<li>Your All Time Sleep Quality Average: <span>${avgSleepQuality}</span></li>`;
};


function showInputForm(event) {
  event.preventDefault();
  inputDate.classList.remove("hidden");
  inputSub.classList.remove("hidden");
  inputDate.setAttribute("required", true);
 if(radioSleep.checked) {
  hideArea(sleepForm, hydrationForm, activityForm);
  inputSleepQuality.setAttribute("required", true);
  inputHoursSlept.setAttribute("required", true);
 } else if(radioHydration.checked) {
  hideArea(hydrationForm, sleepForm, activityForm);
  inputOzDrank.setAttribute("required", true);
 } else if(radioActivity.checked) {
  hideArea(activityForm, hydrationForm, sleepForm);
  inputStairs.setAttribute("required", true);
  inputMinActive.setAttribute("required", true);
  inputSteps.setAttribute("required", true);
 };
}

function enableSubmit() { 
  calendarSub.disabled = false;
}

function createPostObject(event) {
  event.preventDefault()
  if(findExistingData(allSleepData, currentUserID, inputDate.value)) {
    doublePostSection.classList.remove("hidden");
    return
  }
  else {
    if(inputSleepQuality.value && inputHoursSlept.value) {
      const sleepObject = {userID: currentUserID, date: inputDate.value.replaceAll('-',"/"), hoursSlept: Number(inputHoursSlept.value), sleepQuality: Number(inputSleepQuality.value)};
      const sleepEndPoint = "sleep";
      postInformation(sleepEndPoint, sleepObject);
      clearValues(inputSleepQuality,inputHoursSlept);
      inputDate.value = '';
    }
  }
    if(findExistingData(allHydroData, currentUserID, inputDate.value)) {
      doublePostSection.classList.remove("hidden");
      return
    }
    else {
      if (inputOzDrank.value) {
        const hydrationObject = {userID: currentUserID, date: inputDate.value.replaceAll('-',"/"), numOunces: Number(inputOzDrank.value)}
        const hydrationEndPoint = "hydration";
        postInformation(hydrationEndPoint, hydrationObject);
        clearValues(inputOzDrank,inputDate);
      }
    }
    if (findExistingData(allActivityData, currentUserID, inputDate.value)) {
      doublePostSection.classList.remove("hidden");
      return
    } else {
      if(inputStairs.value && inputMinActive.value && inputSteps.value) {
        const activityObject = {userID: currentUserID, date: inputDate.value.replaceAll('-',"/"), flightsOfStairs: Number(inputStairs.value), minutesActive: Number(inputMinActive.value), numSteps: Number(inputSteps.value)};
        const activityEndPoint = "activity";
        postInformation(activityEndPoint, activityObject);
        clearValues(inputStairs, inputMinActive);
        clearValues(inputSteps, inputDate);
      }
    };
};

function clearValues(input1, input2) {
 input1.value = '';
 input2.value = '';
};

function postInformation(endPoint, data ) {
  fetch(`http://localhost:3001/api/v1/${endPoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((obj) => {
      postSuccessDisplay.classList.remove("hidden");
      return reFetch();
    })
    .catch((error) => {
      fetchFailureDisplay.classList.remove("hidden");
    });
};

function reFetch() {
  Promise.all([
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(userAPI),
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(sleepAPI),
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(hydrationAPI),
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_6__["default"])(activityAPI),
  ])
  .then((response) => {
    allUserData = response[0].userData;
    allSleepData = response[1].sleepData;
    allHydroData = response[2].hydrationData;
    allActivityData = response[3].activityData;
    createClassInstances(allUserData, allSleepData, allHydroData, allActivityData);
    updateSleepData();
    displayHydrationDom();
    displayWeeklyAverage();
    findWeeklyData();
  });
};

function toggleAriaChecked() {
  radioSleep.setAttribute("aria-checked", radioSleep.checked ? true : false);
  radioHydration.setAttribute("aria-checked", radioHydration.checked ? true : false);
  radioActivity.setAttribute("aria-checked", radioActivity.checked ? true : false);
};

function findExistingData(data, userId, date) {
  data.find(obj => {
    return obj.userID === userId && obj.date === date
  })
};

function showLogInSection() {
  domUpdates.hideSection(body);
  domUpdates.hideSection(friendsSection);
  domUpdates.showSection(logInSection);
};

function hideLogInSection() {
  domUpdates.showSection(body);
  domUpdates.showSection(friendsSection);
  domUpdates.showSection(signOutBtn);
  domUpdates.hideSection(logInSection);
};
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map