import { logger } from './logger';

export function extend(target, options) {
  var target = target || {};

  for (var key in options) {
    target[key] = options[key];
  }
  return target;
}

export function debugObject(obj) {
  logger.debug(JSON.stringify(obj));
}
