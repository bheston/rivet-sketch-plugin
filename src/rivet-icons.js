import { context } from './common/context';
import { logger } from './common/logger';
import { metadata} from './common/metadata';
import { panel } from './common/panel';
import { search } from './common/search';
import { sketch } from './common/sketch';
import { debugObject } from './common/util';

export default function(ctx) {
  context.run(ctx, function() {
    logger.setLevel(logger.levels.DEBUG);

    Icons().generateIcons();
  });
};

var Icons = function() {
  // Parts
  var icons,
    tints;

  // Symbols & Groups
  var iconContainer;

  var layerForPositioning = null;

  var doc = context.current().document;
  var pageOrArtboard = doc.currentPage().currentArtboard() || doc.currentPage();

  var _getAvailableIconsAndTints = function() {
    var iconSymbols = search.findSymbolsByNameBegin('Rivet/Icon/');
    var tintSymbols = search.findSymbolsByNameBegin('Rivet/Icon-Tint/');
    var icons = [],
      tints = [];

    iconSymbols.forEach(function(item) {
      icons.push(item.name().replace('Rivet/Icon/', ''));
    });
    tintSymbols.forEach(function(item) {
      tints.push(item.name().replace('Rivet/Icon-Tint/', ''));
    });

    return {availableIcons: icons, availableTints: tints};
  };

  var _generateIcons = function() {
    var initialData = _getAvailableIconsAndTints();

    var sel = context.current().selection;
    if (sel.count() == 1) {
      if (sketch.is(sel[0], MSSymbolInstance)) {
        var symbolName = sel[0].symbolMaster().name();
        if (symbolName.startsWith('Rivet/Icon-Container')) {
          iconContainer = sel[0];
          var params = sketch.describeOverrides(iconContainer);
          debugObject(params);
          initialData.config = params;
        }
      }

      if (iconContainer === null) { // Use selection for positioning
        layerForPositioning = sel[0];
      }
    }

    _iconsPanel(function(data) {
      _parseDataFromPanel(data);
      //_storeConfig();
      _setupIconContainer();
      _setIcons();
      _positionSymbol();
    }, initialData);
  };

  function _iconsPanel(callback, data) {
    return panel.createPanel({
      url: context.getPluginRoot() + "/Contents/Resources/panel/icons.html",
      width: 850,
      height: 700,
      data: data,
      identifier: 'com.sketch.material.icons',
      floatWindow: false,
      callback: callback
    });
  }
  
  var _parseDataFromPanel = function(data) {
    icons = data.icons;
    tints = data.tints;
  };

  var _storeConfig = function() {
    //metadata.setConfigs(props, list);
  };

  var _setupIconContainer = function() {
    var size = (icons.length == 2 ? '-Double' : (icons.length == 3 ? '-Triple' : ''));
    var symbol = search.findSymbolsByName('Rivet/Icon-Container/35x35' + size)[0];

    if (iconContainer != null) {
      iconContainer.replaceWithInstanceOfSymbol(symbol);
      iconContainer.resetSizeToMaster();
    } else {
      iconContainer = symbol.newSymbolInstance();
      pageOrArtboard.addLayer(iconContainer);
    }

    if (icons.length == 1) {
      iconContainer.setName(icons[0] + ' Icon');
    } else {
      iconContainer.setName('Icons');
    }
  };

  var _setIcons = function() {
    var values = {};

    for (var i = 0; i < icons.length; i++) {
      var itemKey = 'Icon' + (icons.length == 1 ? '' : ' ' + (i + 1));
      var iconSymbol = search.findSymbolsByName('Rivet/Icon/' + icons[i])[0];
      var tintSymbol = search.findSymbolsByName('Rivet/Icon-Tint/' + tints[i])[0];
      values[itemKey] = {'symbolID': iconSymbol, 'Tint': {'symbolID': tintSymbol}};
    }

    sketch.updateOverrides(iconContainer, values);
  };

  var _positionSymbol = function() {
    if (layerForPositioning != null) {
      sketch.moveLayerAbove(pageOrArtboard, layerForPositioning, iconContainer);
      var layerRect = sketch.getRect(layerForPositioning);
      var iconContainerRect = sketch.getRect(iconContainer);
      iconContainerRect.setX(layerRect.x);
      iconContainerRect.setY(layerRect.y);
    }

    iconContainer.select_byExtendingSelection(false, true);
    iconContainer.select_byExtendingSelection(true, true);
  };

  return {
    generateIcons: function() {
      _generateIcons();
    }
  };
};
