import { logger } from './logger';

export const context = (function() {
  var currentContext;

  function init(context) {
    currentContext = context;
    logger.info('Context initialized');
  }

  function run(context, func) {
    // try {
      init(context);

      func(context, context.document);
    // } catch (e) {
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
    var pluginRoot = currentContext.scriptPath
      .stringByDeletingLastPathComponent()
      .stringByDeletingLastPathComponent()
      .stringByDeletingLastPathComponent();
    return pluginRoot;
  }

  function displayDialog(body) {
    logger.log('SHOW DIALOG: ' + body);
		var app = NSApplication.sharedApplication();
		app.displayDialog_withTitle(body, getCommandName());
	}

  function tryCurrent() {
    return currentContext;
  }

  function complete() {
    logger.info('Plugin run complete');
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
})();
