import { context } from './context';

export const logger = (function() {
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
      if (context && context.getCommandName() != null) {
        prefix = context.getCommandName() + ' - ';
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
})();
