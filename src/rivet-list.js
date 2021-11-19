import { context } from './common/context';
import { logger } from './common/logger';
import { metadata} from './common/metadata';
import { panel } from './common/panel';
import { search } from './common/search';
import { sketch } from './common/sketch';

export default function(ctx) {
  context.run(ctx, function() {
    logger.setLevel(logger.levels.DEBUG);

    List().generateList();
  });
};

var List = function() {
  // Parts
  var items, // Only the actual list items, not decorators
    props;

  // Symbols & Groups
  var list;

  var listToReplace = null;
  var layerForPositioning = null;

  // This includes any decorator "items" (search, etc.)
  var totalCount;

  var doc = context.current().document;
  var pageOrArtboard = doc.currentPage().currentArtboard() || doc.currentPage();
  logger.debug(pageOrArtboard);

  var listSymbols = search.findSymbolsByNameBegin('Rivet/Dropdown/');

  var _generateList = function() {
    var initialData = {missingSymbols: listSymbols.length === 0};
    var sel = context.current().selection;
    var selCount = sel.count();
    if (selCount == 1) {
      if (sketch.is(sel[0], MSSymbolInstance)) {
        var symbolName = sel[0].symbolMaster().name();
        if (symbolName.startsWith('Rivet/Dropdown')) {
          listToReplace = sel[0];
          var selectionType = symbolName.replace('Rivet\/Dropdown\/', '').split('-')[0];
          var params = sketch.describeOverrides(sel[0]);
          var hasSearch = false;
          var items = '';
          for (var i = 0; i < 10; i++) {
            logger.debug('Looking for item ' + i);
            var item = params['Item ' + (i + 1)];
            if (item == undefined) {
              logger.debug('  Breaking');
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
          }
          //{"Item 5":{"symbol":"Rivet/Dropdown/SingleItem-Group","Label":"Group"},"Item 6":{"Label":"Four"},"Item 3":{"Label":"Two"},"Item 1":{"symbol":"Rivet/Dropdown/Search"},"Item 8":{"Label":"Six"},"Item 4":{"Label":"Three"},"Item 2":{"Label":"One"},"Item 9":{"Label":"Seven"},"Item 7":{"Label":"Five"}}
          //debugObject(temp);
          //initialData = metadata.getConfigs(sel[0]);
          initialData.selectionType = selectionType;
          initialData.hasSearch = hasSearch;
          initialData.items = items;
        }
      }

      if (listToReplace == null) { // Use for positioning
        layerForPositioning = sel[0];
      }
    }

    _listPanel(function(data) {
      _parseDataFromPanel(data);
      _getListSize();
      //_storeConfig();
      _addList();
      _makeItems();
      _positionOrReplaceList();
    }, initialData);
  };

  var _listPanel = function(callback, data) {
    return panel.createPanel({
      url: context.getPluginRoot() + "/Contents/Resources/panel/list.html",
      width: 1180,
      height: 700,
      data: data,
      identifier: 'com.sketch.material.list',
      floatWindow: false,
      callback: callback
    });
  };

  var _parseDataFromPanel = function(data) {
    items = data.items;
    logger.debug('Props: ' + data.props);
    props = JSON.parse(data.props);
  };

  var _getListSize = function() {
    totalCount = items.length;
    if (props.hasSearch) {
      totalCount++;
    }
    logger.debug('totalCount - ' + totalCount);
  };

  var _storeConfig = function() {
    metadata.setConfigs(props, list);
  };

  var _addList = function() {
    var symbol = search.findSymbolsByName('Rivet/Dropdown/' + props.selectionType + '-' + totalCount)[0];
    list = symbol.newSymbolInstance();
    list.setName('List');

    pageOrArtboard.addLayer(list);
  };

  var _makeItems = function() {
    var item = 0;

    var values = {};

    if (props.hasSearch) {
      var searchSymbol = search.findSymbolsByName('Rivet/Dropdown/_Pieces/Search')[0];
      values['Item 1'] = {'symbolID': searchSymbol};
      item++;
    }

    for (var i = 0; i < items.length; i++) {
      var itemKey = 'Item ' + (item + i + 1);
      var itemValues = {'Label': items[i]};
      if (items[i].startsWith('-')) {
        var groupSymbol = search.findSymbolsByName('Rivet/Dropdown/_Pieces/SingleItem-Group')[0];
        itemValues['symbolID'] = groupSymbol;
        itemValues['Label'] = items[i].substr(1);
      }
      values[itemKey] = itemValues;
    }

    sketch.updateOverrides(list, values);
  };

  var _positionOrReplaceList = function() {
    if (listToReplace != null) {
      sketch.moveLayerAbove(pageOrArtboard, listToReplace, list);
      var replaceRect = sketch.getRect(listToReplace);
      var listRect = sketch.getRect(list);
      listRect.setX(replaceRect.x);
      listRect.setY(replaceRect.y);
      listRect.setWidth(replaceRect.width);
      list.setName(listToReplace.name());
      sketch.removeLayer(listToReplace);
    } else if (layerForPositioning != null) {
      sketch.moveLayerAbove(pageOrArtboard, layerForPositioning, list);
      var layerRect = sketch.getRect(layerForPositioning);
      var listRect = sketch.getRect(list);
      listRect.setX(layerRect.x);
      listRect.setY(layerRect.y + layerRect.height + 5);
      list.setName(layerForPositioning.name() + ' List');
    } else {
      list.select_byExpandingSelection(true, true);
    }
  };

  return {
    generateList: function() {
      _generateList();
    }
  };
};
