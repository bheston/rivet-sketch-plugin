(function() {

  var _getItems = function() {
    var itemsText = $('#itemsList').val();
    var items = itemsText.split('\n');
    for (var i = items.length - 1; i >= 0; i--) {
      if (items[i].trim() == '') {
        items.pop();
      } else {
        break;
      }
    }
    return items;
  }

  var _getProps = function() {
    var selectionType = $('[name="selection"]:checked').val() || 'S',
      hasSearch = $('#hasSearch:checked').val() || 'off';

    return JSON.stringify({
      selectionType: selectionType,
      hasSearch: (hasSearch == 'on')
    });
  }

  var _toggleMulti = function() {
    $('.checkbox').toggleClass('hide');
  }

  var _toggleSearch = function() {
    //$('.checkbox').toggleClass('hide');
  }

  /*var _togglePagination = function() {
    $('.min-table-footer').toggleClass('hide');
  }

  var _toggleDefaultValues = function() {
    $('.checkbox').toggleClass('hide-sample');
  }

  var _toggleShadow = function() {
    $('.mini-table').toggleClass('mdl-shadow--2dp');
  }*/

  var _submit = function() {
    var options = {};
    options.items = _getItems();
    options.props = _getProps();
    MDAction('submit', options);
  }

  $('#submit').on('click', _submit);
  $('[name="selection"]').on('change', _toggleMulti);
  $('#hasSearch').on('change', _toggleSearch);
  //$('#hasDefaultValues').on('change', _toggleDefaultValues);
  //$('#hasShadow').on('change', _toggleShadow);
  //$('#hasPagination').on('change', _togglePagination);
})();

function init(data) {
  if (data) {
    $('#selection-' + data.selectionType).trigger('click');
    mdlSetCheckbox($('#hasSearch'), data.hasSearch);
    $('#itemsList').val(data.items);
    //mdlSetCheckbox($('#hasShadow'), data.hasShadow == 'on');
    //mdlSetCheckbox($('#hasPagination'), data.hasPagination == 'on');
    //mdlSetCheckbox($('#hasCheckboxes'), data.hasCheckboxes == 'on');
  }
}
