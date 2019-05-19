import { context } from './common/context';
import { logger } from './common/logger';
import { metadata} from './common/metadata';
import { panel } from './common/panel';
import { search } from './common/search';
import { sketch } from './common/sketch';

export default function(ctx) {
  context.run(ctx, function() {
    logger.setLevel(logger.levels.DEBUG);

    Table().generateTable();
  });
};

var Table = function() {
  const BORDER_WIDTH = 1;

  // Parts
  var headers,
    columns,
    widths,
    metas,
    props;

  // Symbols & Groups
  var table,
    tableMask,
    tableGroup;

  var tableToReplace = null; // TODO
  var layerForPositioning = null;

  // Counts
  var rowCount;

  var doc = context.current().document;
  var pageOrArtboard = doc.currentPage().currentArtboard() || doc.currentPage();

  var _generateTable = function() {
    var initialData = null;
    var sel = context.current().selection;
    var selCount = sel.count();
    if (selCount == 1) {
      if (sketch.is(sel[0], MSLayerGroup)) {
        initialData = metadata.getConfigs(sel[0]);
        logger.debug('loading config', initialData);
      }

      if (tableToReplace == null) { // Use for positioning
        if (!sketch.is(sel[0], MSArtboardGroup)) {
          layerForPositioning = sel[0];
        }
      }
    }

    _tablePanel(function(data) {
      _parseDataFromPanel(data);
      _getTableSize();
      _createGroup();
      _storeConfig();
      _addPagination();
      _addTableBase();
      _makeCols();
      _addGroupsToTable();
      _positionOrReplaceTable();
    }, initialData);
  };

  var _tablePanel = function(callback, data) {
    return panel.createPanel({
      url: context.getPluginRoot() + "/Contents/Resources/panel/table.html",
      width: 1180,
      height: 700,
      data: data,
      identifier: 'com.sketch.material.table',
      floatWindow: false,
      callback: callback
    });
  };

  var _parseDataFromPanel = function(data) {
    var _parseDataFromString = function(str, sep) {
      return str.split(sep);
    }

    headers = _parseDataFromString(data.headers, '|');
    columns = JSON.parse(data.cells);
    widths = _parseDataFromString(data.widths, '|');
    metas = _parseDataFromString(data.metas, '|');
    props = JSON.parse(data.props);
  };

  var _getTableSize = function() {
    rowCount = columns[0].length;
    logger.debug('rowCount - ' + rowCount);
  };

  var _createGroup = function() {
    tableGroup = sketch.addGroup();
    tableGroup.setName('Table');
  };

  var _storeConfig = function() {
    metadata.setConfigs(props, tableGroup);
  };

  var _addPagination = function() {
    if (props.hasPagination == 'off') {
      return;
    }

    var symbol = search.findSymbolsByName('Rivet/Table/Paging')[0];
    var instance = symbol.newSymbolInstance();
    instance.setName('Paging');

    tableGroup.addLayers([instance]);

    var rect = sketch.getRect(instance);
    rect.setY(395);
    rect.setX(0);

    //var action = MSMoveToBackAction.alloc().init();
    //[action moveToBack:instance];
  };

  var _addTableBase = function() {
    tableMask = sketch.addShape();
    tableMask.setName('Mask');
    sketch.setAsMask(tableMask);
    //if (props.hasShadow == 'on') {
      //sketch.setRadius(tableMask, 0);
      var maskStyle = search.findLayerStyleByName('Rivet Table Mask');
      tableMask.setSharedStyle(maskStyle);
    //}
    var maskRect = sketch.getRect(tableMask);

    var symbol = search.findSymbolsByName('Rivet/Table/Table')[0];
    table = symbol.newSymbolInstance();
    table.setName('Table');
    var tableRect = sketch.getRect(table);

    maskRect.setWidth(tableRect.width);
    maskRect.setHeight(tableRect.height);

    tableGroup.addLayers([tableMask, table]);

    pageOrArtboard.addLayer(tableGroup);
  };

  var _makeCols = function() {
    var x = BORDER_WIDTH;
    var symbol = search.findSymbolsByName('Rivet/Table/Column-Dimension')[0];
    var metricSymbol = search.findSymbolsByName('Rivet/Table/Column-Metric-Number')[0];
    var iconSymbol = search.findSymbolsByName('Rivet/Table/Column-Icon')[0];

    if (props.hasCheckboxes == 'on') {
      var selectSymbol = search.findSymbolsByName('Rivet/Table/Column-Select')[0];
      var instance = selectSymbol.newSymbolInstance();
      instance.setName('Select Column');
      tableGroup.addLayers([instance]);
      var rect = sketch.getRect(instance);
      rect.setX(x);
      x += rect.width;
    }

    var tableRect = sketch.getRect(table);
    var tableWidth = tableRect.width;

    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];

      var isIcon = false;
      var uniqueValues = new Set(columns[i]);
      uniqueValues.delete('');
      if (uniqueValues.size == 1 && uniqueValues.has('x')) {
        isIcon = true;
      }

      var instance = symbol.newSymbolInstance();
      if (metas[i] == 'htRight') {
        instance = metricSymbol.newSymbolInstance();
      } else if (isIcon) {
        instance = iconSymbol.newSymbolInstance();
      }

      instance.setName(header + ' Column');
      tableGroup.addLayers([instance]);
      sketch.moveLayerAbove(tableGroup, table, instance);

      var overrideValues = {'Title': header};
      if (i == headers.length - 1) {
        overrideValues['Last Column'] = {'symbolID': sketch.OVERRIDE_NULL_SYMBOL};
      }
      for (var j = 0; j < 10; j++) {
        var value = columns[i][j];
        if (props.hasDefaultValues == 'off' && value == '') { value = ' '; }
        if (isIcon && value.toLowerCase() != 'x') {
          logger.debug('Setting icon to null for row ' + (j + 1));
          value = {'symbolID': sketch.OVERRIDE_NULL_SYMBOL};
        }
        overrideValues['Row ' + (j + 1)] = value;
      }
      sketch.updateOverrides(instance, overrideValues);

      var width = Math.round(parseInt(widths[i]) / 5) * 5;
      if (i == headers.length - 1 && x + width < tableWidth) {
        width = tableWidth - x - BORDER_WIDTH;
      }
      var columnRect = sketch.getRect(instance);
      columnRect.setX(x);
      columnRect.setWidth(width);

      x += width;
    }
  };

  var _addGroupsToTable = function() {
    tableGroup.setConstrainProportions(false);

    tableGroup.select_byExpandingSelection(true, true);
  };

  var _positionOrReplaceTable = function() {
    if (tableToReplace != null) {
      /*sketch.moveLayerAbove(pageOrArtboard, tableToReplace, list);
      var replaceRect = sketch.getRect(tableToReplace);
      var listRect = sketch.getRect(list);
      listRect.setX(replaceRect.x);
      listRect.setY(replaceRect.y);
      listRect.setWidth(replaceRect.width);
      list.setName(tableToReplace.name());
      sketch.removeLayer(tableToReplace);*/
    } else if (layerForPositioning != null) {
      sketch.moveLayerAbove(pageOrArtboard, layerForPositioning, tableGroup);
      var layerRect = sketch.getRect(layerForPositioning);
      var tableGroupRect = sketch.getRect(tableGroup);
      tableGroupRect.setX(layerRect.x);
      tableGroupRect.setY(layerRect.y);
    }

    tableGroup.select_byExpandingSelection(true, false);
    //tableGroup.select_byExpandingSelection(true, true);
  };

  return {
    generateTable: function() {
      _generateTable();
    }
  };
};
