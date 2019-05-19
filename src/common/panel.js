import { logger } from './logger';
import { extend } from './util';
import MochaJSDelegate from './MochaJSDelegate';
import { addFirstMouseAcceptor } from './first-mouse-acceptor';

export const panel = (function () {
  const TITLE_BG_COLOR = NSColor.colorWithRed_green_blue_alpha(21 / 255, 117 / 255, 213 / 255, 1);

  coscript.setShouldKeepAround(false);

  function _createPanel(options) {
    var self = this,
      threadDictionary,
      options = extend({
        url: undefined,
        width: 240,
        height: 316,
        floatWindow: false,
        hiddenClose: false,
        data: null,
        callback: function (data) { return data; }
      }, options),
      result = false;

    if (!options.remote) {
      options.url = encodeURI("file://" + options.url);
    }

    var frame = NSMakeRect(0, 0, options.width, (options.height + 32)),
      contentBgColor = NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1);

    if (options.identifier) {
      threadDictionary = NSThread.mainThread().threadDictionary();
      if (threadDictionary[options.identifier]) {
        COScript.currentCOScript().setShouldKeepAround_(true);
        return;
      }
    }

    const Panel = NSPanel.alloc().init();

    // var Panel = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, 31, 2, 'YES');
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
      threadDictionary[options.identifier] = Panel;
      // Long-running script
      COScript.currentCOScript().setShouldKeepAround_(true);
    }

    var contentView = Panel.contentView(),
      webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, options.width, options.height));

    var windowObject = webView.windowScriptObject();

    contentView.setWantsLayer(true);
    contentView.layer().setFrame(contentView.frame());
    // contentView.layer().setCornerRadius(6);
    // contentView.layer().setMasksToBounds(true);

    webView.setBackgroundColor(contentBgColor);
    webView.setMainFrameURL_(options.url);
    contentView.addSubview(webView);

    var delegate = new MochaJSDelegate({
      "webView:didFinishLoadForFrame:": (function (webView, webFrame) {
        var MDAction = [
          "function MDAction(hash, data) {",
          "if (data) { window.MDData = encodeURI(JSON.stringify(data)); }",
          "window.location.hash = hash;",
          "}"
        ].join(""),
          DOMReady = [
            "$(", "function() {", "init(" + JSON.stringify(options.data) + ");", "}", ");"
          ].join("");

        if (!options.remote) {
          windowObject.evaluateWebScript(MDAction);
          windowObject.evaluateWebScript(DOMReady);
        }
      }),
      "webView:didChangeLocationWithinPageForFrame:": (function (webView, webFrame) {
        var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();

        if (request == "submit") {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));
          try {
            options.callback(data);
          } catch (e) {
            logger.error(e);
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
          addFirstMouseAcceptor(webView, contentView);
        }

        if (request == "close") {
          if (!options.floatWindow) {
            Panel.orderOut(nil);
            NSApp.stopModal();
          }
          else {
            Panel.close();
          }
        }

        if (request == "focus") {
          var point = Panel.currentEvent().locationInWindow(),
            y = NSHeight(Panel.frame()) - point.y - 32;
          windowObject.evaluateWebScript("lookupItemInput(" + point.x + ", " + y + ")");
        }
        windowObject.evaluateWebScript("window.location.hash = '';");
      })
    });

    webView.setFrameLoadDelegate_(delegate.getClassInstance());
    // NSButton already returns YES for -acceptsFirstMouse: so all we need to do
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
      }
      else {
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
})();
