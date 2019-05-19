var globalThis = this;
function __skpm_run (key, context) {
  globalThis.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/rivet-list.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/common/MochaJSDelegate.js":
/*!***************************************!*\
  !*** ./src/common/MochaJSDelegate.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//
//  MochaJSDelegate.js
//  MochaJSDelegate
//
//  Created by Matt Curtis
//  Copyright (c) 2015. All rights reserved.
//
/* harmony default export */ __webpack_exports__["default"] = (function (selectorHandlerDict) {
  var uniqueClassName = "MochaJSDelegate_DynamicClass_" + NSUUID.UUID().UUIDString();
  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, NSObject);
  delegateClassDesc.registerClass(); //	Handler storage

  var handlers = {}; //	Define interface

  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers;
    var selector = NSSelectorFromString(selectorString);
    handlers[selectorString] = func;

    if (!handlerHasBeenSet) {
      /*
      	For some reason, Mocha acts weird about arguments:
      	https://github.com/logancollins/Mocha/issues/28
      		We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
      */
      var dynamicHandler = function dynamicHandler() {
        var functionToCall = handlers[selectorString];
        if (!functionToCall) return;
        return functionToCall.apply(delegateClassDesc, arguments);
      };

      var args = [],
          regex = /:/g;

      while (regex.exec(selectorString)) {
        args.push("arg" + args.length);
      }

      var dynamicFunction = eval("(function(" + args.join(",") + "){ return dynamicHandler.apply(this, arguments); })");
      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction);
    }
  };

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString];
  };

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString];
  };

  this.getAllHandlers = function () {
    return handlers;
  };

  this.getClass = function () {
    return NSClassFromString(uniqueClassName);
  };

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName).new();
  }; //	Conveience


  if (_typeof(selectorHandlerDict) == "object") {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString]);
    }
  }
});
;

/***/ }),

/***/ "./src/common/coerce.js":
/*!******************************!*\
  !*** ./src/common/coerce.js ***!
  \******************************/
/*! exports provided: coerceJS, coerceString, coerceNumber, coerceBool, coerceArray, coerceObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceJS", function() { return coerceJS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceString", function() { return coerceString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceNumber", function() { return coerceNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceBool", function() { return coerceBool; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceArray", function() { return coerceArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceObject", function() { return coerceObject; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function coerceJS(value) {
  if (value) {
    if (value.class) {
      switch (coerceString(value.class())) {
        case '__NSCFString':
        case '__NSCFConstantString':
        case 'NSTaggedPointerString':
        case 'NSPathStore2':
          return coerceString(value);

        case '__NSCFDictionary':
        case '__NSDictionaryI':
          return coerceObject(value);

        case '__NSCFArrayI':
        case '__NSArrayM':
          return coerceArray(value);

        case '__NSCFNumber':
          return coerceNumber(value);

        default:
          return value;
      }
    } else if (Array.isArray(value)) {
      return value.map(coerceJS);
    } else if (_typeof(value) === 'object') {
      var newObj = {};

      for (var key in value) {
        newObj[key] = coerceJS(value[key]);
      }

      return newObj;
    }
  }

  return value;
}
function coerceString(str) {
  if (str) {
    return '' + str;
  } else {
    return null;
  }
}
function coerceNumber(number) {
  return number + 0;
}
function coerceBool(number) {
  return !!(number + 0);
}
function coerceArray(array) {
  var result = [];
  $.forEach(array, function (item) {
    result.push(coerceJS(item));
  });
  return result;
}
function coerceObject(dict) {
  var result = {};
  $.forEach(dict.allKeys(), function (key) {
    result[key] = coerceJS(dict[key]);
  });
  return result;
}

/***/ }),

/***/ "./src/common/context.js":
/*!*******************************!*\
  !*** ./src/common/context.js ***!
  \*******************************/
/*! exports provided: context */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/common/logger.js");

var context = function () {
  var currentContext;

  function init(context) {
    currentContext = context;
    _logger__WEBPACK_IMPORTED_MODULE_0__["logger"].info('Context initialized');
  }

  function run(context, func) {
    // try {
    init(context);
    func(context, context.document); // } catch (e) {
    //   logger.error(e);
    //   displayDialog("Error: " + e);
    // }

    complete();
  }

  function current() {
    if (currentContext == null) {
      throw 'Context not set. Call init(context) first.';
    }

    return currentContext;
  }

  function getCommandName() {
    if (currentContext != null) {
      return currentContext.command.name();
    }

    return null;
  }

  function getPluginRoot() {
    if (currentContext == null) {
      throw 'Context not set. Call init(context) first.';
    }

    var pluginRoot = currentContext.scriptPath.stringByDeletingLastPathComponent().stringByDeletingLastPathComponent().stringByDeletingLastPathComponent();
    return pluginRoot;
  }

  function displayDialog(body) {
    _logger__WEBPACK_IMPORTED_MODULE_0__["logger"].log('SHOW DIALOG: ' + body);
    var app = NSApplication.sharedApplication();
    app.displayDialog_withTitle(body, getCommandName());
  }

  function tryCurrent() {
    return currentContext;
  }

  function complete() {
    _logger__WEBPACK_IMPORTED_MODULE_0__["logger"].info('Plugin run complete');
  }

  return {
    init: init,
    run: run,
    current: current,
    getCommandName: getCommandName,
    getPluginRoot: getPluginRoot,
    displayDialog: displayDialog,
    tryCurrent: tryCurrent,
    complete: complete
  };
}();

/***/ }),

/***/ "./src/common/first-mouse-acceptor.js":
/*!********************************************!*\
  !*** ./src/common/first-mouse-acceptor.js ***!
  \********************************************/
/*! exports provided: addFirstMouseAcceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addFirstMouseAcceptor", function() { return addFirstMouseAcceptor; });
function createCocoaObject(methods, superclass) {
  var uniqueClassName = "MD.sketch_" + NSUUID.UUID().UUIDString();
  var classDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject);
  classDesc.registerClass();

  for (var selectorString in methods) {
    var selector = NSSelectorFromString(selectorString);
    classDesc.addInstanceMethodWithSelector_function(selector, methods[selectorString]);
  }

  return NSClassFromString(uniqueClassName).new();
}

function addFirstMouseAcceptor(webView, contentView) {
  var button = createCocoaObject({
    'mouseDown:': function mouseDown(evt) {
      // Remove this view. Subsequent events such the mouseUp event that will
      // probably immediately follow mouseDown or any other mouse events will
      // be handled as if this view is not here because it will not be here!
      this.removeFromSuperview(); // Now send the same mouseDown event again as if the user had just
      // clicked. With the button gone, this will be handled by the WebView.

      NSApplication.sharedApplication().sendEvent(evt);
    }
  }, NSButton);
  button.setIdentifier('firstMouseAcceptor');
  button.setTransparent(true);
  button.setTranslatesAutoresizingMaskIntoConstraints(false);
  contentView.addSubview(button);
  var views = {
    button: button,
    webView: webView
  }; // Match width of WebView.

  contentView.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat_options_metrics_views('H:[button(==webView)]', NSLayoutFormatDirectionLeadingToTrailing, null, views)); // Match height of WebView.

  contentView.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat_options_metrics_views('V:[button(==webView)]', NSLayoutFormatDirectionLeadingToTrailing, null, views)); // Match top of WebView.

  contentView.addConstraints(NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(button, NSLayoutAttributeTop, NSLayoutRelationEqual, webView, NSLayoutAttributeTop, 1, 0));
}

/***/ }),

/***/ "./src/common/logger.js":
/*!******************************!*\
  !*** ./src/common/logger.js ***!
  \******************************/
/*! exports provided: logger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logger", function() { return logger; });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context */ "./src/common/context.js");

var logger = function () {
  var _levels = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4
  };
  var _logLevel = _levels.INFO;

  function _log(level, message, data) {
    if (level >= _logLevel) {
      var now = new Date();
      var prefix = '';

      if (_context__WEBPACK_IMPORTED_MODULE_0__["context"] && _context__WEBPACK_IMPORTED_MODULE_0__["context"].getCommandName() != null) {
        prefix = _context__WEBPACK_IMPORTED_MODULE_0__["context"].getCommandName() + ' - ';
      }

      var levelString = '';

      switch (level) {
        case 1:
          levelString = 'DEBUG';
          break;

        case 2:
          levelString = 'INFO';
          break;

        case 3:
          levelString = 'WARN';
          break;

        case 4:
          levelString = 'ERROR';
          break;

        default:
          levelString = 'UNKNOWN';
      }

      var dataString = '';

      if (data != null) {
        dataString = ' - ' + JSON.stringify(data);
      }

      log(now.toISOString() + ' ' + prefix + levelString + ': ' + message + dataString);
    }
  }

  function _debug(message, data) {
    _log(_levels.DEBUG, message, data);
  }

  function _info(message, data) {
    _log(_levels.INFO, message, data);
  }

  function _warn(message, data) {
    _log(_levels.WARN, message, data);
  }

  function _error(message, data) {
    _log(_levels.ERROR, message, data);
  }

  function _setLevel(level) {
    _logLevel = level;
  }

  return {
    log: _info,
    debug: _debug,
    info: _info,
    warn: _warn,
    error: _error,
    levels: _levels,
    setLevel: _setLevel
  };
}();

/***/ }),

/***/ "./src/common/metadata.js":
/*!********************************!*\
  !*** ./src/common/metadata.js ***!
  \********************************/
/*! exports provided: metadata */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "metadata", function() { return metadata; });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context */ "./src/common/context.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger */ "./src/common/logger.js");
/* harmony import */ var _sketch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sketch */ "./src/common/sketch.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/common/util.js");




var metadata = function () {
  var KEY = 'RivetConfig';

  var _getUIMetadata = function _getUIMetadata() {
    return _context__WEBPACK_IMPORTED_MODULE_0__["context"].current().document.mutableUIMetadata();
  };

  var _getConfigs = function _getConfigs(container) {
    var configsData;

    if (container) {
      configsData = _context__WEBPACK_IMPORTED_MODULE_0__["context"].current().command.valueForKey_onLayer(KEY, container);
    } else {
      configsData = _getUIMetadata().objectForKey(KEY);
    }

    return JSON.parse(configsData);
  };

  var _setConfigs = function _setConfigs(newConfigs, container, replace) {
    var configsData = newConfigs || {};

    if (replace == undefined || replace != true) {
      configsData = Object(_util__WEBPACK_IMPORTED_MODULE_3__["extend"])(_getConfigs(container) || {}, newConfigs);
    }

    configsData.timestamp = new Date().getTime();

    if (container) {
      _context__WEBPACK_IMPORTED_MODULE_0__["context"].current().command.setValue_forKey_onLayer(JSON.stringify(configsData), KEY, container);
    } else {
      _getUIMetadata().setObject_forKey(JSON.stringify(configsData), KEY);
    }

    var saveDoc = _sketch__WEBPACK_IMPORTED_MODULE_2__["sketch"].addShape();
    _context__WEBPACK_IMPORTED_MODULE_0__["context"].current().document.currentPage().addLayers([saveDoc]);
    _sketch__WEBPACK_IMPORTED_MODULE_2__["sketch"].removeLayer(saveDoc);
    return configsData;
  };

  var _removeConfigs = function _removeConfigs(container) {
    if (container) {
      _context__WEBPACK_IMPORTED_MODULE_0__["context"].current().command.setValue_forKey_onLayer({}, KEY, container);
    } else {
      _getUIMetadata().setObject_forKey({}, KEY);
    }
  };

  return {
    getConfigs: _getConfigs,
    setConfigs: _setConfigs,
    removeConfigs: _removeConfigs
  };
}();

var testMetadata = function testMetadata(context) {
  context.run(context, function (context) {
    _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].setLevel(_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].levels.DEBUG);
    var selectedLayers = context.selection;
    var selectedCount = selectedLayers.count();

    if (selectedCount > 0) {
      var layer = selectedLayers[0];
      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('layer');
      metadata.removeConfigs(layer);
      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  get md', metadata.getConfigs(layer));
      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  set md', metadata.setConfigs({
        prop1: "abc",
        prop2: 5
      }, layer));
      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  get md', metadata.getConfigs(layer));
      var c = metadata.getConfigs(layer);
      delete c.prop1;
      c.prop3 = "def";
      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  set md', metadata.setConfigs(c, layer, false));
      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  get md', metadata.getConfigs(layer)); //logger.debug('  rem md', metadata.removeConfigs(layer));
    }

    _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('global');
    metadata.removeConfigs();
    _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  get md', metadata.getConfigs());
    _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  set md', metadata.setConfigs({
      prop1: "abc",
      prop2: 5
    }));
    _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  get md', metadata.getConfigs());
    _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  set md', metadata.setConfigs({
      prop3: "def",
      prop1: null
    }));
    _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  get md', metadata.getConfigs()); //logger.debug('  rem md', metadata.removeConfigs());
  });
};

/***/ }),

/***/ "./src/common/panel.js":
/*!*****************************!*\
  !*** ./src/common/panel.js ***!
  \*****************************/
/*! exports provided: panel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "panel", function() { return panel; });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/common/logger.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/common/util.js");
/* harmony import */ var _MochaJSDelegate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MochaJSDelegate */ "./src/common/MochaJSDelegate.js");
/* harmony import */ var _first_mouse_acceptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./first-mouse-acceptor */ "./src/common/first-mouse-acceptor.js");




var panel = function () {
  var TITLE_BG_COLOR = NSColor.colorWithRed_green_blue_alpha(21 / 255, 117 / 255, 213 / 255, 1);
  coscript.setShouldKeepAround(false);

  function _createPanel(options) {
    var self = this,
        threadDictionary,
        options = Object(_util__WEBPACK_IMPORTED_MODULE_1__["extend"])({
      url: undefined,
      width: 240,
      height: 316,
      floatWindow: false,
      hiddenClose: false,
      data: null,
      callback: function callback(data) {
        return data;
      }
    }, options),
        result = false;

    if (!options.remote) {
      options.url = encodeURI("file://" + options.url);
    }

    var frame = NSMakeRect(0, 0, options.width, options.height + 32),
        contentBgColor = NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1);

    if (options.identifier) {
      threadDictionary = NSThread.mainThread().threadDictionary();

      if (threadDictionary[options.identifier]) {
        COScript.currentCOScript().setShouldKeepAround_(true);
        return;
      }
    }

    var Panel = NSPanel.alloc().init(); // var Panel = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, 31, 2, 'YES');

    Panel.setTitleVisibility(NSWindowTitleHidden);
    Panel.setTitlebarAppearsTransparent(true);
    Panel.standardWindowButton(NSWindowCloseButton).setHidden(options.hiddenClose);
    Panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    Panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
    Panel.setFrame_display(frame, true);
    Panel.setBackgroundColor(contentBgColor);
    Panel.setWorksWhenModal(true);

    if (options.floatWindow) {
      Panel.becomeKeyWindow();
      Panel.setLevel(NSFloatingWindowLevel);
      threadDictionary[options.identifier] = Panel; // Long-running script

      COScript.currentCOScript().setShouldKeepAround_(true);
    }

    var contentView = Panel.contentView(),
        webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, options.width, options.height));
    var windowObject = webView.windowScriptObject();
    contentView.setWantsLayer(true);
    contentView.layer().setFrame(contentView.frame()); // contentView.layer().setCornerRadius(6);
    // contentView.layer().setMasksToBounds(true);

    webView.setBackgroundColor(contentBgColor);
    webView.setMainFrameURL_(options.url);
    contentView.addSubview(webView);
    var delegate = new _MochaJSDelegate__WEBPACK_IMPORTED_MODULE_2__["default"]({
      "webView:didFinishLoadForFrame:": function webViewDidFinishLoadForFrame(webView, webFrame) {
        var MDAction = ["function MDAction(hash, data) {", "if (data) { window.MDData = encodeURI(JSON.stringify(data)); }", "window.location.hash = hash;", "}"].join(""),
            DOMReady = ["$(", "function() {", "init(" + JSON.stringify(options.data) + ");", "}", ");"].join("");

        if (!options.remote) {
          windowObject.evaluateWebScript(MDAction);
          windowObject.evaluateWebScript(DOMReady);
        }
      },
      "webView:didChangeLocationWithinPageForFrame:": function webViewDidChangeLocationWithinPageForFrame(webView, webFrame) {
        var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

        if (request == "submit") {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));

          try {
            options.callback(data);
          } catch (e) {
            _logger__WEBPACK_IMPORTED_MODULE_0__["logger"].error(e);
          }

          result = true;

          if (!options.floatWindow) {
            windowObject.evaluateWebScript("window.location.hash = 'close';");
          }
        }

        if (request == 'drag-end') {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("draggedIcon")));
          MD.Importer().convertSvgToSymbol(data);
          result = true;
        }

        if (request == 'changeLink') {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("currentLink")));
          MD.openURL(data);
        }

        if (request == 'applyStyles') {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("appliedStyles")));
          MD.Typography().applyTypographyStyles(data);
        }

        if (request == 'onWindowDidBlur') {
          Object(_first_mouse_acceptor__WEBPACK_IMPORTED_MODULE_3__["addFirstMouseAcceptor"])(webView, contentView);
        }

        if (request == "close") {
          if (!options.floatWindow) {
            Panel.orderOut(nil);
            NSApp.stopModal();
          } else {
            Panel.close();
          }
        }

        if (request == "focus") {
          var point = Panel.currentEvent().locationInWindow(),
              y = NSHeight(Panel.frame()) - point.y - 32;
          windowObject.evaluateWebScript("lookupItemInput(" + point.x + ", " + y + ")");
        }

        windowObject.evaluateWebScript("window.location.hash = '';");
      }
    });
    webView.setFrameLoadDelegate_(delegate.getClassInstance()); // NSButton already returns YES for -acceptsFirstMouse: so all we need to do
    // is handle the mouseDown event.

    if (options.floatWindow) {
      Panel.center();
      Panel.makeKeyAndOrderFront(nil);
    }

    var closeButton = Panel.standardWindowButton(NSWindowCloseButton);
    closeButton.setCOSJSTargetFunction(function (sender) {
      var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

      if (options.floatWindow && request == "submit") {
        data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));
        options.callback(data);
      }

      if (options.identifier) {
        threadDictionary.removeObjectForKey(options.identifier);
      }

      self.wantsStop = true;

      if (options.floatWindow) {
        Panel.close();
      } else {
        Panel.orderOut(nil);
        NSApp.stopModal();
      }
    });
    closeButton.setAction("callAction:");
    var titlebarView = contentView.superview().titlebarViewController().view(),
        titlebarContainerView = titlebarView.superview();
    closeButton.setFrameOrigin(NSMakePoint(8, 8));
    titlebarContainerView.setFrame(NSMakeRect(0, options.height, options.width, 32));
    titlebarView.setFrameSize(NSMakeSize(options.width, 32));
    titlebarView.setTransparent(true);
    titlebarView.setBackgroundColor(TITLE_BG_COLOR);
    titlebarContainerView.superview().setBackgroundColor(TITLE_BG_COLOR);

    if (!options.floatWindow) {
      NSApp.runModalForWindow(Panel);
    }

    return result;
  }

  return {
    createPanel: _createPanel
  };
}();

/***/ }),

/***/ "./src/common/search.js":
/*!******************************!*\
  !*** ./src/common/search.js ***!
  \******************************/
/*! exports provided: search */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "search", function() { return search; });
/* harmony import */ var _coerce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coerce */ "./src/common/coerce.js");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context */ "./src/common/context.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger */ "./src/common/logger.js");



var search = function () {
  function findLayersMatchingPredicate_inContainer_filterByType(predicate, container, layerType) {
    var doc = _context__WEBPACK_IMPORTED_MODULE_1__["context"].current().document;
    var scope;

    switch (layerType) {
      case MSPage:
        scope = doc.pages();
        return scope.filteredArrayUsingPredicate(predicate);
        break;

      case MSArtboardGroup:
        if (typeof container !== 'undefined' && container != nil) {
          if (container.className == "MSPage") {
            scope = container.artboards();
            return scope.filteredArrayUsingPredicate(predicate);
          }
        } else {
          // search all pages
          var filteredArray = NSArray.array();
          var loopPages = doc.pages().objectEnumerator(),
              page;

          while (page = loopPages.nextObject()) {
            scope = page.artboards();
            filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate));
          }

          return filteredArray;
        }

        break;

      case MSSymbolMaster:
        scope = doc.documentData().allSymbols();
        return scope.filteredArrayUsingPredicate(predicate);
        break;

      default:
        if (typeof container !== 'undefined' && container != nil) {
          scope = container.children();
          return scope.filteredArrayUsingPredicate(predicate);
        } else {
          // search all pages
          var filteredArray = NSArray.array();
          var loopPages = doc.pages().objectEnumerator(),
              page;

          while (page = loopPages.nextObject()) {
            scope = page.children();
            filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate));
          }

          return filteredArray;
        }

    }

    return NSArray.array(); // Return an empty array if no matches were found
  }
  /*function findFirstLayerMatchingPredicate_inContainer_filterByType(predicate, container, layerType) {
    var filteredArray = findLayersMatchingPredicate_inContainer_filterByType(predicate, container, layerType);
    return filteredArray.firstObject();
  }
   function findLayersNamed_inContainer_filterByType(layerName, container, layerType) {
    var predicate = (typeof layerType === 'undefined' || layerType == nil) ? NSPredicate.predicateWithFormat("name == %@", layerName) : NSPredicate.predicateWithFormat("name == %@ && class == %@", layerName, layerType);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, container);
  }*/


  function findPagesByName(pageName) {
    var predicate = NSPredicate.predicateWithFormat("name == %@", pageName);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSPage);
  }

  function findSymbolsByID(id) {
    var predicate = NSPredicate.predicateWithFormat("symbolID == %@", id);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSSymbolMaster);
  }

  function findSymbolsByName(name) {
    var predicate = NSPredicate.predicateWithFormat("name == %@", name);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSSymbolMaster);
  }

  function findSymbolsByNameBegin(name) {
    var predicate = NSPredicate.predicateWithFormat("name BEGINSWITH[cd] %@", name);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSSymbolMaster);
  }

  function findLayerStyleByName(styleName) {
    var doc = _context__WEBPACK_IMPORTED_MODULE_1__["context"].current().document;
    var styles = doc.documentData().layerStyles().objects();

    if (styles) {
      for (var i = 0; i < styles.count(); i++) {
        if (styles.objectAtIndex(i).name() == styleName) {
          return styles.objectAtIndex(i);
        }
      }
    }

    return false;
  }

  function findTextStyleByName(styleName) {
    var doc = _context__WEBPACK_IMPORTED_MODULE_1__["context"].current().document;
    var textStyles = doc.documentData().layerTextStyles().objects();

    if (textStyles) {
      for (var i = 0; i < textStyles.count(); i++) {
        if (textStyles.objectAtIndex(i).name() == styleName) {
          return textStyles.objectAtIndex(i);
        }
      }
    }

    return false;
  }

  function findTextStyleByID(styleID) {
    styleID = Object(_coerce__WEBPACK_IMPORTED_MODULE_0__["coerceString"])(styleID); //logger.debug("Looking for text style " + styleID);

    var doc = _context__WEBPACK_IMPORTED_MODULE_1__["context"].current().document;
    var textStyles = doc.documentData().layerTextStyles().objects();

    if (textStyles) {
      for (var i = 0; i < textStyles.count(); i++) {
        var current = textStyles.objectAtIndex(i); //logger.debug("  Checking text style " + current.objectID());

        if (Object(_coerce__WEBPACK_IMPORTED_MODULE_0__["coerceString"])(current.objectID()) === styleID) {
          return current;
        }
      }
    }

    _logger__WEBPACK_IMPORTED_MODULE_2__["logger"].warn("Was looking for text style " + styleID + ", but didn't find it.");
    return false;
  }

  return {
    findLayersMatchingPredicate_inContainer_filterByType: findLayersMatchingPredicate_inContainer_filterByType,
    findPagesByName: findPagesByName,
    findSymbolsByID: findSymbolsByID,
    findSymbolsByName: findSymbolsByName,
    findSymbolsByNameBegin: findSymbolsByNameBegin,
    findLayerStyleByName: findLayerStyleByName,
    findTextStyleByName: findTextStyleByName,
    findTextStyleByID: findTextStyleByID
  };
}();

/***/ }),

/***/ "./src/common/sketch.js":
/*!******************************!*\
  !*** ./src/common/sketch.js ***!
  \******************************/
/*! exports provided: sketch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sketch", function() { return sketch; });
/* harmony import */ var _coerce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coerce */ "./src/common/coerce.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger */ "./src/common/logger.js");
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./search */ "./src/common/search.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/common/util.js");




var sketch = {};
Object(_util__WEBPACK_IMPORTED_MODULE_3__["extend"])(sketch, {
  is: function is(layer, theClass) {
    if (!layer) return false;
    var klass = layer.class();
    return klass === theClass;
  },
  addGroup: function addGroup() {
    return MSLayerGroup.new();
  },
  addShape: function addShape() {
    return MSShapeGroup.shapeWithRect(NSMakeRect(0, 0, 100, 100));
  },
  addText: function addText(string) {
    var text = MSTextLayer.new();
    text.setStringValue(string || 'Text');
    return text;
  },
  removeLayer: function removeLayer(layer) {
    var container = layer.parentGroup();
    if (container) container.removeLayer(layer);
  },
  moveLayerAbove: function moveLayerAbove(parent, lower, upper) {
    if (!this.is(lower, MSArtboardGroup)) {
      upper.moveToLayer_beforeLayer(parent, lower);
      lower.moveToLayer_beforeLayer(parent, upper);
    }
  },
  setAsMask: function setAsMask(layer) {
    layer.hasClippingMask = true;
    layer.clippingMaskMode = 0; // 0 - outline mask, 1 - alpha mask
  },
  setRadius: function setRadius(layer, radius) {
    radius = '' + radius;
    layer.layers().firstObject().setCornerRadiusFromComponents(radius);
  },
  getGroupRect: function getGroupRect(group) {
    var rect = group.groupBoundsForLayers();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
      maxX: Math.round(rect.x() + rect.width()),
      maxY: Math.round(rect.y() + rect.height()),
      setX: function setX(x) {
        rect.setX(x);
        this.x = x;
        this.maxX = this.x + this.width;
      },
      setY: function setY(y) {
        rect.setY(y);
        this.y = y;
        this.maxY = this.y + this.height;
      },
      setWidth: function setWidth(width) {
        rect.setWidth(width);
        this.width = width;
        this.maxX = this.x + this.width;
      },
      setHeight: function setHeight(height) {
        rect.setHeight(height);
        this.height = height;
        this.maxY = this.y + this.height;
      }
    };
  },
  getRect: function getRect(layer) {
    var rect = layer.frame();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
      maxX: Math.round(rect.x() + rect.width()),
      maxY: Math.round(rect.y() + rect.height()),
      setX: function setX(x) {
        rect.setX(x);
        this.x = x;
        this.maxX = this.x + this.width;
      },
      setY: function setY(y) {
        rect.setY(y);
        this.y = y;
        this.maxY = this.y + this.height;
      },
      setWidth: function setWidth(width) {
        rect.setWidth(width);
        this.width = width;
        this.maxX = this.x + this.width;
      },
      setHeight: function setHeight(height) {
        rect.setHeight(height);
        this.height = height;
        this.maxY = this.y + this.height;
      },
      setConstrainProportions: function setConstrainProportions(val) {
        rect.setConstrainProportions(val);
      }
    };
  },
  OVERRIDE_NULL_SYMBOL: 'NULL_SYMBOL',
  updateOverrides: function updateOverrides(instance, values) {
    var existingOverrides = instance.overrides();

    if (!existingOverrides) {
      existingOverrides = NSMutableDictionary.dictionary();
    }

    var mutableOverrides = NSMutableDictionary.dictionaryWithDictionary(existingOverrides);

    var idValuePairs = this._setupOverrides(instance, values);

    for (var id in idValuePairs) {
      mutableOverrides.setObject_forKey(idValuePairs[id], id);
    }

    instance.overrides = mutableOverrides;
  },
  _setupOverrides: function _setupOverrides(instanceOrMaster, values) {
    var idValuePairs = {};
    var symbolMaster = instanceOrMaster.className() == 'MSSymbolInstance' ? instanceOrMaster.symbolMaster() : instanceOrMaster;

    if (symbolMaster == null) {
      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].error('Symbol master not found.  Make sure instance has been added to the page first.');
    }

    var children = symbolMaster.children();

    for (var i = 0; i < children.count(); i++) {
      var layer = children[i];

      if (layer.isVisible() == 1 && layer.isLocked() == 0) {
        var fieldNames = Object.keys(values);

        if (layer.className() == 'MSSymbolInstance') {
          //logger.debug('Checking overrides for symbol ' + layer.name());
          var layerValues = values[layer.name()];
          var layerInstanceOrMaster = layer;
          var layerOverrides = {};

          if (layerValues != null) {
            var symbol = layerValues['symbolID']; //logger.debug('  Symbol ' + symbol);

            if (symbol == sketch.OVERRIDE_NULL_SYMBOL) {
              layerOverrides['symbolID'] = "";
            } else if (symbol != null) {
              layerOverrides['symbolID'] = symbol.symbolID();
              layerInstanceOrMaster = symbol;
            }
          }

          var otherOverrides = this._setupOverrides(layerInstanceOrMaster, layerValues || values);

          layerOverrides = Object(_util__WEBPACK_IMPORTED_MODULE_3__["extend"])(layerOverrides, otherOverrides);
          /*for (var j = 0; j < fieldNames.length; j++) {
            var fieldName = fieldNames[j];
            if (layer.name() == fieldNames[j]) {
              logger.debug('  Setting ' + layer.className() + ' symbolID override.');
              layerOverrides['symbolID'] = values[fieldName].symbolID();
              break;
            }
          }*/

          var propertyCount = Object.keys(layerOverrides).length;

          if (propertyCount > 0) {
            //logger.debug('  Symbol instance overrides, adding ' + propertyCount);
            idValuePairs[layer.objectID()] = layerOverrides;
          }
        } else {
          //logger.debug('Checking overrides for layer ' + layer.name());
          for (var j = 0; j < fieldNames.length; j++) {
            var fieldName = fieldNames[j];

            if (layer.name() == fieldNames[j]) {
              //logger.debug('  Setting ' + layer.className() + ' overrides.');
              idValuePairs[layer.objectID()] = values[fieldName];
              break;
            }
          }
        }
      }
    }

    return idValuePairs;
  },
  describeOverrides: function describeOverrides(instance) {
    var existingOverrides = instance.overrides();
    return this._describeLayerOverrides('', instance, existingOverrides);
  },
  _describeLayerOverrides: function _describeLayerOverrides(indent, instance, overrides) {
    var ret = null;

    if (overrides != null) {
      ret = {};
      var symbolMaster = instance.symbolMaster();
      var symbolId = overrides['symbolID'];

      if (symbolId != undefined) {
        if (symbolId == "") {
          _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + 'Symbol removed');
          ret['symbol'] = null;
        } else {
          symbolMaster = _search__WEBPACK_IMPORTED_MODULE_2__["search"].findSymbolsByID(symbolId)[0];
          _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + 'Looked up symbol ' + symbolMaster.name());
          ret['symbol'] = Object(_coerce__WEBPACK_IMPORTED_MODULE_0__["coerceString"])(symbolMaster.name());
        }
      }

      _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + 'Found overrides ' + overrides.count());
      var keys = overrides.allKeys(); //logger.debug('  Keys ' + keys);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var layer = null;
        var children = symbolMaster.children();

        for (var j = 0; j < children.count(); j++) {
          var child = children[j];
          _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + '  Checking ' + child.objectID() + ' (' + child.name() + ')');

          if (Object(_coerce__WEBPACK_IMPORTED_MODULE_0__["coerceString"])(child.objectID()) == Object(_coerce__WEBPACK_IMPORTED_MODULE_0__["coerceString"])(key)) {
            _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + '  Found layer: ' + child.name());
            layer = child;
            break;
          }
        }

        if (layer != null) {
          var layerOverrides = overrides.objectForKey(key);
          _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + '  Layer ' + layer.className() + ' overrides ' + layerOverrides);

          if (this.is(layer, MSSymbolInstance)) {
            var layerDesc = this._describeLayerOverrides(indent + '  ', layer, layerOverrides);

            if (layerDesc != null) {
              _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + '    Adding map');
              ret[layer.name()] = layerDesc;
            }
          } else {
            _logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(indent + '    Adding ' + layerOverrides.className());
            ret[layer.name()] = Object(_coerce__WEBPACK_IMPORTED_MODULE_0__["coerceString"])(layerOverrides);
          }
        }
      }
    }

    return ret;
  },
  toNopPath: function toNopPath(str) {
    return this.toJSString(str).replace(/[\/\\\?]/g, " ");
  },
  toHTMLEncode: function toHTMLEncode(str) {
    return this.toJSString(str).replace(/\</g, "&lt;").replace(/\>/g, '&gt;').replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\ud83c|\ud83d/g, ""); // return str.replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, '&gt;');
  },
  emojiToEntities: function emojiToEntities(str) {
    var emojiRanges = ["\uD83C[\uDF00-\uDFFF]", // U+1F300 to U+1F3FF
    "\uD83D[\uDC00-\uDE4F]", // U+1F400 to U+1F64F
    "\uD83D[\uDE80-\uDEFF]" // U+1F680 to U+1F6FF
    ];
    return str.replace(new RegExp(emojiRanges.join("|"), "g"), function (match) {
      var c = encodeURIComponent(match).split("%"),
          h = (parseInt(c[1], 16) & 0x0F) + ((parseInt(c[2], 16) & 0x1F) << 12) + ((parseInt(c[3], 16) & 0x3F) << 6) + (parseInt(c[4], 16) & 0x3F);
      return "&#" + h.toString() + ";";
    });
  },
  toSlug: function toSlug(str) {
    return this.toJSString(str).toLowerCase().replace(/(<([^>]+)>)/ig, "").replace(/[\/\+\|]/g, " ").replace(new RegExp("[\\!@#$%^&\\*\\(\\)\\?=\\{\\}\\[\\]\\\\\\\,\\.\\:\\;\\']", "gi"), '').replace(/\s+/g, '-');
  },
  toJSString: function toJSString(str) {
    return new String(str).toString();
  },
  toJSNumber: function toJSNumber(str) {
    return Number(this.toJSString(str));
  },
  pointToJSON: function pointToJSON(point) {
    return {
      x: parseFloat(point.x),
      y: parseFloat(point.y)
    };
  },
  rectToJSON: function rectToJSON(rect, referenceRect) {
    if (referenceRect) {
      return {
        x: Math.round(rect.x() - referenceRect.x()),
        y: Math.round(rect.y() - referenceRect.y()),
        width: Math.round(rect.width()),
        height: Math.round(rect.height())
      };
    }

    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height())
    };
  },
  colorToJSON: function colorToJSON(color) {
    return {
      r: Math.round(color.red() * 255),
      g: Math.round(color.green() * 255),
      b: Math.round(color.blue() * 255),
      a: color.alpha(),
      "color-hex": color.immutableModelObject().stringValueWithAlpha(false) + " " + Math.round(color.alpha() * 100) + "%",
      "argb-hex": "#" + this.toHex(color.alpha() * 255) + color.immutableModelObject().stringValueWithAlpha(false).replace("#", ""),
      "css-rgba": "rgba(" + [Math.round(color.red() * 255), Math.round(color.green() * 255), Math.round(color.blue() * 255), Math.round(color.alpha() * 100) / 100].join(",") + ")",
      "ui-color": "(" + ["r:" + (Math.round(color.red() * 100) / 100).toFixed(2), "g:" + (Math.round(color.green() * 100) / 100).toFixed(2), "b:" + (Math.round(color.blue() * 100) / 100).toFixed(2), "a:" + (Math.round(color.alpha() * 100) / 100).toFixed(2)].join(" ") + ")"
    };
  },
  colorStopToJSON: function colorStopToJSON(colorStop) {
    return {
      color: this.colorToJSON(colorStop.color()),
      position: colorStop.position()
    };
  },
  gradientToJSON: function gradientToJSON(gradient) {
    var stopsData = [],
        stop,
        stopIter = gradient.stops().objectEnumerator();

    while (stop = stopIter.nextObject()) {
      stopsData.push(this.colorStopToJSON(stop));
    }

    return {
      type: GradientTypes[gradient.gradientType()],
      from: this.pointToJSON(gradient.from()),
      to: this.pointToJSON(gradient.to()),
      colorStops: stopsData
    };
  },
  shadowToJSON: function shadowToJSON(shadow) {
    return {
      type: shadow instanceof MSStyleShadow ? "outer" : "inner",
      offsetX: shadow.offsetX(),
      offsetY: shadow.offsetY(),
      blurRadius: shadow.blurRadius(),
      spread: shadow.spread(),
      color: this.colorToJSON(shadow.color())
    };
  },
  hexToColor: function hexToColor(hex) {
    var hexRgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (hexRgb) {
      return MSColor.colorWithRed_green_blue_alpha(parseInt(hexRgb[1], 16) / 255, parseInt(hexRgb[2], 16) / 255, parseInt(hexRgb[3], 16) / 255, 1.0);
    } else {
      return null;
    }
  },
  getRadius: function getRadius(layer) {
    return layer.layers && this.is(layer.layers().firstObject(), MSRectangleShape) ? layer.layers().firstObject().fixedRadius() : 0;
  },
  getBorders: function getBorders(style) {
    var bordersData = [],
        border,
        borderIter = style.borders().objectEnumerator();

    while (border = borderIter.nextObject()) {
      if (border.isEnabled()) {
        var fillType = FillTypes[border.fillType()],
            borderData = {
          fillType: fillType,
          position: BorderPositions[border.position()],
          thickness: border.thickness()
        };

        switch (fillType) {
          case "color":
            borderData.color = this.colorToJSON(border.color());
            break;

          case "gradient":
            borderData.gradient = this.gradientToJSON(border.gradient());
            break;

          default:
            continue;
        }

        bordersData.push(borderData);
      }
    }

    return bordersData;
  },
  getFills: function getFills(style) {
    var fillsData = [],
        fill,
        fillIter = style.fills().objectEnumerator();

    while (fill = fillIter.nextObject()) {
      if (fill.isEnabled()) {
        var fillType = FillTypes[fill.fillType()],
            fillData = {
          fillType: fillType
        };

        switch (fillType) {
          case "color":
            fillData.color = this.colorToJSON(fill.color());
            break;

          case "gradient":
            fillData.gradient = this.gradientToJSON(fill.gradient());
            break;

          default:
            continue;
        }

        fillsData.push(fillData);
      }
    }

    return fillsData;
  },
  getShadows: function getShadows(style) {
    var shadowsData = [],
        shadow,
        shadowIter = style.shadows().objectEnumerator();

    while (shadow = shadowIter.nextObject()) {
      if (shadow.isEnabled()) {
        shadowsData.push(this.shadowToJSON(shadow));
      }
    }

    shadowIter = style.innerShadows().objectEnumerator();

    while (shadow = shadowIter.nextObject()) {
      if (shadow.isEnabled()) {
        shadowsData.push(this.shadowToJSON(shaxdow));
      }
    }

    return shadowsData;
  },
  getOpacity: function getOpacity(style) {
    return style.contextSettings().opacity();
  },
  getStyleName: function getStyleName(layer) {
    if (layer.sharedStyle()) {
      return this.toJSString(layer.sharedStyle().name());
    } else {
      return "";
    }
  },
  setColor: function setColor(layer, color, replacementProperty) {
    if (color) {
      if (layer.class() == MSShapeGroup) {
        // Shape
        if (replacementProperty == 'Fill') {
          var fill = layer.style().fills().firstObject();

          if (fill != undefined) {
            fill.color = color;
          }
        }

        if (replacementProperty == 'Border') {
          var border = layer.style().borders().firstObject();

          if (border != undefined) {
            border.color = color;
          }
        }
      } else {
        layer.textColor = color;
      }
    }
  },
  updateContext: function updateContext() {
    this.context.document = NSDocumentController.sharedDocumentController().currentDocument();
    this.context.selection = this.context.document.selectedLayers();
    return this.context;
  },
  openURL: function openURL(url) {
    var nsurl = NSURL.URLWithString(url);
    NSWorkspace.sharedWorkspace().openURL(nsurl);
  }
});

/***/ }),

/***/ "./src/common/util.js":
/*!****************************!*\
  !*** ./src/common/util.js ***!
  \****************************/
/*! exports provided: extend, debugObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debugObject", function() { return debugObject; });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/common/logger.js");

function extend(target, options) {
  var target = target || {};

  for (var key in options) {
    target[key] = options[key];
  }

  return target;
}
function debugObject(obj) {
  _logger__WEBPACK_IMPORTED_MODULE_0__["logger"].debug(JSON.stringify(obj));
}

/***/ }),

/***/ "./src/rivet-list.js":
/*!***************************!*\
  !*** ./src/rivet-list.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/context */ "./src/common/context.js");
/* harmony import */ var _common_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/logger */ "./src/common/logger.js");
/* harmony import */ var _common_metadata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/metadata */ "./src/common/metadata.js");
/* harmony import */ var _common_panel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/panel */ "./src/common/panel.js");
/* harmony import */ var _common_search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/search */ "./src/common/search.js");
/* harmony import */ var _common_sketch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/sketch */ "./src/common/sketch.js");






/* harmony default export */ __webpack_exports__["default"] = (function (ctx) {
  _common_context__WEBPACK_IMPORTED_MODULE_0__["context"].run(ctx, function () {
    _common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].setLevel(_common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].levels.DEBUG);
    List().generateList();
  });
});
;

var List = function List() {
  // Parts
  var items, // Only the actual list items, not decorators
  props; // Symbols & Groups

  var list;
  var listToReplace = null;
  var layerForPositioning = null; // This includes any decorator "items" (search, etc.)

  var totalCount;
  var doc = _common_context__WEBPACK_IMPORTED_MODULE_0__["context"].current().document;
  var pageOrArtboard = doc.currentPage().currentArtboard() || doc.currentPage();
  _common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(pageOrArtboard);

  var _generateList = function _generateList() {
    var initialData = null;
    var sel = _common_context__WEBPACK_IMPORTED_MODULE_0__["context"].current().selection;
    var selCount = sel.count();

    if (selCount == 1) {
      if (_common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].is(sel[0], MSSymbolInstance)) {
        var symbolName = sel[0].symbolMaster().name();

        if (symbolName.startsWith('Rivet/Dropdown')) {
          listToReplace = sel[0];
          var selectionType = symbolName.replace('Rivet\/Dropdown\/', '').split('-')[0];
          var params = _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].describeOverrides(sel[0]);
          var hasSearch = false;
          var items = '';

          for (var i = 0; i < 10; i++) {
            _common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('Looking for item ' + i);
            var item = params['Item ' + (i + 1)];

            if (item == undefined) {
              _common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('  Breaking');
              break;
            }

            var symbolOverride = item['symbol'];

            if (i == 0 && symbolOverride == 'Rivet/Dropdown/_Pieces/Search') {
              hasSearch = true;
            } else {
              var label = item['Label'];

              if (symbolOverride == 'Rivet/Dropdown/_Pieces/SingleItem-Group') {
                label = '-' + label;
              }

              items += label + '\n';
            }
          } //{"Item 5":{"symbol":"Rivet/Dropdown/SingleItem-Group","Label":"Group"},"Item 6":{"Label":"Four"},"Item 3":{"Label":"Two"},"Item 1":{"symbol":"Rivet/Dropdown/Search"},"Item 8":{"Label":"Six"},"Item 4":{"Label":"Three"},"Item 2":{"Label":"One"},"Item 9":{"Label":"Seven"},"Item 7":{"Label":"Five"}}
          //debugObject(temp);
          //initialData = metadata.getConfigs(sel[0]);


          initialData = {
            selectionType: selectionType,
            hasSearch: hasSearch,
            items: items
          };
          _common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('loading config', initialData);
        }
      }

      if (listToReplace == null) {
        // Use for positioning
        layerForPositioning = sel[0];
      }
    }

    _listPanel(function (data) {
      _parseDataFromPanel(data);

      _getListSize(); //_storeConfig();


      _addList();

      _makeItems();

      _positionOrReplaceList();
    }, initialData);
  };

  var _listPanel = function _listPanel(callback, data) {
    return _common_panel__WEBPACK_IMPORTED_MODULE_3__["panel"].createPanel({
      url: _common_context__WEBPACK_IMPORTED_MODULE_0__["context"].getPluginRoot() + "/Contents/Resources/panel/list.html",
      width: 1180,
      height: 700,
      data: data,
      identifier: 'com.sketch.material.list',
      floatWindow: false,
      callback: callback
    });
  };

  var _parseDataFromPanel = function _parseDataFromPanel(data) {
    items = data.items;
    _common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('Props: ' + data.props);
    props = JSON.parse(data.props);
  };

  var _getListSize = function _getListSize() {
    totalCount = items.length;

    if (props.hasSearch) {
      totalCount++;
    }

    _common_logger__WEBPACK_IMPORTED_MODULE_1__["logger"].debug('totalCount - ' + totalCount);
  };

  var _storeConfig = function _storeConfig() {
    _common_metadata__WEBPACK_IMPORTED_MODULE_2__["metadata"].setConfigs(props, list);
  };

  var _addList = function _addList() {
    var symbol = _common_search__WEBPACK_IMPORTED_MODULE_4__["search"].findSymbolsByName('Rivet/Dropdown/' + props.selectionType + '-' + totalCount)[0];
    list = symbol.newSymbolInstance();
    list.setName('List');
    pageOrArtboard.addLayer(list);
  };

  var _makeItems = function _makeItems() {
    var item = 0;
    var values = {};

    if (props.hasSearch) {
      var searchSymbol = _common_search__WEBPACK_IMPORTED_MODULE_4__["search"].findSymbolsByName('Rivet/Dropdown/_Pieces/Search')[0];
      values['Item 1'] = {
        'symbolID': searchSymbol
      };
      item++;
    }

    for (var i = 0; i < items.length; i++) {
      var itemKey = 'Item ' + (item + i + 1);
      var itemValues = {
        'Label': items[i]
      };

      if (items[i].startsWith('-')) {
        var groupSymbol = _common_search__WEBPACK_IMPORTED_MODULE_4__["search"].findSymbolsByName('Rivet/Dropdown/_Pieces/SingleItem-Group')[0];
        itemValues['symbolID'] = groupSymbol;
        itemValues['Label'] = items[i].substr(1);
      }

      values[itemKey] = itemValues;
    }

    _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].updateOverrides(list, values);
  };

  var _positionOrReplaceList = function _positionOrReplaceList() {
    if (listToReplace != null) {
      _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].moveLayerAbove(pageOrArtboard, listToReplace, list);
      var replaceRect = _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].getRect(listToReplace);
      var listRect = _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].getRect(list);
      listRect.setX(replaceRect.x);
      listRect.setY(replaceRect.y);
      listRect.setWidth(replaceRect.width);
      list.setName(listToReplace.name());
      _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].removeLayer(listToReplace);
    } else if (layerForPositioning != null) {
      _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].moveLayerAbove(pageOrArtboard, layerForPositioning, list);
      var layerRect = _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].getRect(layerForPositioning);
      var listRect = _common_sketch__WEBPACK_IMPORTED_MODULE_5__["sketch"].getRect(list);
      listRect.setX(layerRect.x);
      listRect.setY(layerRect.y + layerRect.height + 5);
      list.setName(layerForPositioning.name() + ' List');
    } else {
      list.select_byExpandingSelection(true, true);
    }
  };

  return {
    generateList: function generateList() {
      _generateList();
    }
  };
};

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=rivet-list.js.map