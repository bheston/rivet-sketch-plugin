import { context } from './context';
import { logger } from './logger';
import { sketch } from './sketch';
import { extend } from './util';

export const metadata = (function() {
  const KEY = 'RivetConfig';

  var _getUIMetadata = function() {
    return context.current().document.mutableUIMetadata();
  };

  var _getConfigs = function(container) {
    var configsData;
    if (container) {
      configsData = context.current().command.valueForKey_onLayer(KEY, container);
    } else {
      configsData = _getUIMetadata().objectForKey(KEY);
    }

    return JSON.parse(configsData);
  };

  var _setConfigs = function(newConfigs, container, replace) {
    var configsData = newConfigs || {};
    if (replace == undefined || replace != true) {
      configsData = extend(_getConfigs(container) || {}, newConfigs);
    }
    configsData.timestamp = new Date().getTime();

    if (container) {
      context.current().command.setValue_forKey_onLayer(JSON.stringify(configsData), KEY, container);
    } else {
      _getUIMetadata().setObject_forKey(JSON.stringify(configsData), KEY);
    }

    var saveDoc = sketch.addShape();
    context.current().document.currentPage().addLayers([saveDoc]);
    sketch.removeLayer(saveDoc);

    return configsData;
  };

  var _removeConfigs = function(container) {
    if (container) {
      context.current().command.setValue_forKey_onLayer({}, KEY, container);
    } else {
      _getUIMetadata().setObject_forKey({}, KEY);
    }
  }

  return {
    getConfigs: _getConfigs,
    setConfigs: _setConfigs,
    removeConfigs: _removeConfigs
  };
})();

const testMetadata = function(context) {
  context.run(context, function(context) {
    logger.setLevel(logger.levels.DEBUG);

    var selectedLayers = context.selection;
    var selectedCount = selectedLayers.count();
    if (selectedCount > 0) {
      var layer = selectedLayers[0];
      logger.debug('layer');
      metadata.removeConfigs(layer)
      logger.debug('  get md', metadata.getConfigs(layer));
      logger.debug('  set md', metadata.setConfigs({prop1: "abc", prop2: 5}, layer));
      logger.debug('  get md', metadata.getConfigs(layer));
      var c = metadata.getConfigs(layer);
      delete c.prop1;
      c.prop3 = "def";
      logger.debug('  set md', metadata.setConfigs(c, layer, false));
      logger.debug('  get md', metadata.getConfigs(layer));
      //logger.debug('  rem md', metadata.removeConfigs(layer));
    }

    logger.debug('global');
    metadata.removeConfigs()
    logger.debug('  get md', metadata.getConfigs());
    logger.debug('  set md', metadata.setConfigs({prop1: "abc", prop2: 5}));
    logger.debug('  get md', metadata.getConfigs());
    logger.debug('  set md', metadata.setConfigs({prop3: "def", prop1: null}));
    logger.debug('  get md', metadata.getConfigs());
    //logger.debug('  rem md', metadata.removeConfigs());
  });
};
