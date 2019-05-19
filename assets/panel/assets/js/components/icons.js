(function() {

  var _getIconsOrTints = function(tints) {
    var values = [$('#icon1' + (tints === true ? 'Tint' : '')).val()];
    //var tints = [$('#icon1Tint').val()];
    for (var i = 2; i < 4; i++) {
      var val = $('#icon' + i + (tints === true ? 'Tint' : '')).val();
      if (val != '') {
        values.push(val);
      }
    }
    return values;
  }

  var _submit = function() {
    var options = {};
    options.icons = _getIconsOrTints(false);
    options.tints = _getIconsOrTints(true);
    MDAction('submit', options);
  }

  $('#submit').on('click', _submit);
})();

function debugLog(message) {
  $('#debugLogging').append('<option>' + message + '</option>');
};

function fillIconFields(index, icon) {
  $('#icon' + index).val(icon.symbol.replace('Rivet/Icon/', ''));
  $('#icon' + index).trigger('change');
  if (icon.Tint) {
    $('#icon' + index + 'Tint').val(icon.Tint.symbol.replace('Rivet/Icon-Tint/', ''));
    $('#icon' + index + 'Tint').trigger('change');
  }
};

function updatePreview() {
  $('#icon1Preview').css('background-image', 'url(assets/img/rivet-icons/' + $('#icon1').val() + '.png)');
  $('#icon2Preview').css('background-image', 'url(assets/img/rivet-icons/' + $('#icon2').val() + '.png)');
  $('#icon3Preview').css('background-image', 'url(assets/img/rivet-icons/' + $('#icon3').val() + '.png)');
};

function formatState(state) {
  if (!state.id) {
    return state.text;
  }
  var baseUrl = "assets/img/rivet-icons";
  if (state['_resultId'].indexOf('Tint-result') > -1) {
    baseUrl += '/tints';
  }
  var $state = $(
    '<span><img src="' + baseUrl + '/' + state.element.value + '.png" /> ' + state.text + '</span>'
  );
  return $state;
};

function init(data) {
  if (data) {
    var selectParams = {theme: 'material', width: '230px', templateResult: formatState};
    for (var i = 0; i < 3; i++) {
      var iconSelect = $('#icon' + (i + 1));
      data.availableIcons.forEach(function(item) {
        iconSelect.append('<option value="' + item + '" data-type="icon">' + item + '</option>');
      });
      iconSelect.select2(selectParams);
      iconSelect.on("change", updatePreview);

      var tintSelect = $('#icon' + (i + 1) + 'Tint');
      data.availableTints.forEach(function(item) {
        tintSelect.append('<option value="' + item + '" data-type="tint">' + item + '</option>');
      });
      tintSelect.val('Plain');
      tintSelect.select2(selectParams);
      tintSelect.on("change", updatePreview);
    }
    $('#icon1').val('Beaker');
    $('#icon1').trigger('change');

    $('.select2-selection__arrow')
      .addClass('material-icons')
      .html('arrow_drop_down');

    if (data.config) {
      var icon = data.config['Icon'] || data.config['Icon 1'];
      if (icon) {
        fillIconFields(1, icon);

        var icon2 = data.config['Icon 2'];
        if (icon2) {
          fillIconFields(2, icon2);

          var icon3 = data.config['Icon 3'];
          if (icon3) {
            fillIconFields(3, icon3);
          }
        }
      }
    }
  }
}
