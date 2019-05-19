(function() {
  var debugLog = function(message) {
    $('#debugLogging').append('<option>' + message + '</option>');
  };

  var data = function() {
    var d = Handsontable.helper.createEmptySpreadsheetData(11, 5);
    var headerRow = d[0];
    for (var i = 0; i < headerRow.length; i++) {
      headerRow[i] = 'Header ' + (i + 1);
    }
    return d;
  };

  Handsontable.hooks.add('afterPaste', function(data, coords) {
    //debugLog('paste ' + JSON.stringify(coords[0]));
    for (var i = coords[0].startCol; i <= coords[0].endCol; i++) {
      debugLog('looking at col ' + i);
      var data = hot.getDataAtCol(i);
      debugLog('-data ' + data);
      var isNumeric = null;
      data.forEach(function(item) {
        isNumeric = isNumeric || !isNaN(item);
      });
      debugLog('--col ' + i + ' isNumeric: ' + isNumeric);
      if (isNumeric == true) {
        debugLog('---meta ' + i);
        for (var row = 1; row <= 10; row++) {
          hot.setCellMeta(row, i, 'className', 'htRight');
        }
      }
    }
    hot.render();
  });

  var container = document.getElementById('sheet');
  window.hot = new Handsontable(container, {
    data: data(),
    minSpareCols: 0,
    minSpareRows: 0,
    minRows: 1,
    minCols: 1,
    manualColumnResize: true,
    rowHeaders: false,
    colHeaders: true,
    colWidths: 150,
    contextMenu: true,
    fixedRowsTop: 1,
    height: 490,
    contextMenu: ['row_above', 'row_below', 'col_left', 'col_right', '---------', 'remove_row', 'remove_col', '---------', 'alignment']
  });

  var _getColWidths = function() {
    var headers = hot.countCols(), widths = '', metas = '';
    for (var i = 0; i < headers; i++) {
      widths = widths + hot.getColWidth(i) + '|';
      var alignment = hot.getCellMeta(0, i).className ? hot.getCellMeta(0, i).className : 'htLeft';
      metas = metas + alignment + '|'
    }

    return {
      widths: widths,
      metas: metas
    };
  };

  var _getCellData = function() {
    var colsCount = hot.countCols(), rowsData = [];
    for (var i = 0; i < colsCount; i++) {
      var col = hot.getDataAtCol(i);
      col.shift();
      rowsData.push(col);
    }
    return JSON.stringify(rowsData);
  };

  var _getProps = function() {
    var hasPagination = $('#hasPagination:checked').val() || 'off',
      hasShadow = 'on', //$('#hasShadow:checked').val() || 'off',
      hasDefaultValues = $('#hasDefaultValues:checked').val() || 'off',
      hasCheckboxes = $('#hasCheckboxes:checked').val() || 'off';

    return JSON.stringify({
      hasDefaultValues: hasDefaultValues,
      hasShadow: hasShadow,
      hasPagination: hasPagination,
      hasCheckboxes: hasCheckboxes
    });
  };

  var _toggleCheckBoxes = function() {
    $('.checkbox').toggleClass('hide');
  };

  var _togglePagination = function() {
    $('.min-table-footer').toggleClass('hide');
  };

  var _toggleDefaultValues = function() {
    $('.checkbox').toggleClass('hide-sample');
  };

  var _toggleShadow = function() {
    $('.mini-table').toggleClass('mdl-shadow--2dp');
  };

  var _submit = function() {
    var options = {};
    options.headers = hot.getDataAtRow(0).join('|');
    options.cells = _getCellData();
    options.widths = _getColWidths().widths;
    options.metas = _getColWidths().metas;
    options.props = _getProps();
    MDAction('submit', options);
  };

  $('#submit').on('click', _submit);
  $('#hasCheckboxes').on('change', _toggleCheckBoxes);
  $('#hasDefaultValues').on('change', _toggleDefaultValues);
  $('#hasShadow').on('change', _toggleShadow);
  $('#hasPagination').on('change', _togglePagination);
})();

function init(data) {
  if (data) {
    mdlSetCheckbox($('#hasDefaultValues'), data.hasDefaultValues == 'on');
    mdlSetCheckbox($('#hasShadow'), data.hasShadow == 'on');
    mdlSetCheckbox($('#hasPagination'), data.hasPagination == 'on');
    mdlSetCheckbox($('#hasCheckboxes'), data.hasCheckboxes == 'on');
  }
}
