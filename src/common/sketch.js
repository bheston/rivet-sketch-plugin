import { coerceString } from './coerce';
import { logger } from './logger';
import { search } from './search';
import { extend } from './util';

export const sketch = {};

extend(sketch, {
  is: function(layer, theClass) {
    if (!layer) return false;
    var klass = layer.class();
    return klass === theClass;
  },
  addGroup: function() {
    return MSLayerGroup.new();
  },
  addShape: function() {
    return MSShapeGroup.shapeWithRect(NSMakeRect(0, 0, 100, 100));
  },
  addText: function(string) {
    var text = MSTextLayer.new();
    text.setStringValue(string || 'Text');
    return text;
  },
  removeLayer: function(layer) {
    var container = layer.parentGroup();
    if (container) container.removeLayer(layer);
  },
  moveLayerAbove: function(parent, lower, upper) {
    if (!this.is(lower, MSArtboardGroup)) {
      upper.moveToLayer_beforeLayer(parent, lower);
      lower.moveToLayer_beforeLayer(parent, upper);
    }
  },
  setAsMask: function(layer) {
    layer.hasClippingMask = true;
    layer.clippingMaskMode = 0; // 0 - outline mask, 1 - alpha mask
  },
  setRadius: function(layer, radius) {
    radius = '' + radius;
    layer.layers().firstObject().setCornerRadiusFromComponents(radius);
  },
  getGroupRect: function(group) {
    var rect = group.groupBoundsForLayers();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
      maxX: Math.round(rect.x() + rect.width()),
      maxY: Math.round(rect.y() + rect.height()),
      setX: function(x) { rect.setX(x); this.x = x; this.maxX = this.x + this.width; },
      setY: function(y) { rect.setY(y); this.y = y; this.maxY = this.y + this.height; },
      setWidth: function(width) { rect.setWidth(width); this.width = width; this.maxX = this.x + this.width; },
      setHeight: function(height) { rect.setHeight(height); this.height = height; this.maxY = this.y + this.height; }
    };
  },
  getRect: function(layer) {
    var rect = layer.frame();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
      maxX: Math.round(rect.x() + rect.width()),
      maxY: Math.round(rect.y() + rect.height()),
      setX: function(x) { rect.setX(x); this.x = x; this.maxX = this.x + this.width; },
      setY: function(y) { rect.setY(y); this.y = y; this.maxY = this.y + this.height; },
      setWidth: function(width) { rect.setWidth(width); this.width = width; this.maxX = this.x + this.width; },
      setHeight: function(height) { rect.setHeight(height); this.height = height; this.maxY = this.y + this.height; },
      setConstrainProportions: function(val) { rect.setConstrainProportions(val); }
    };
  },
  OVERRIDE_NULL_SYMBOL: 'NULL_SYMBOL',
  updateOverrides: function(instance, values) {
    var existingOverrides = instance.overrides();
    if (!existingOverrides) { existingOverrides = NSMutableDictionary.dictionary(); }
    var mutableOverrides = NSMutableDictionary.dictionaryWithDictionary(existingOverrides);

    var idValuePairs = this._setupOverrides(instance, values);

    for (var id in idValuePairs) {
      mutableOverrides.setObject_forKey(idValuePairs[id], id);
    }

    instance.overrides = mutableOverrides;
  },
  _setupOverrides: function(instanceOrMaster, values) {
    var idValuePairs = {};
    var symbolMaster = (instanceOrMaster.className() == 'MSSymbolInstance' ? instanceOrMaster.symbolMaster() : instanceOrMaster);
    if (symbolMaster == null) {
      logger.error('Symbol master not found.  Make sure instance has been added to the page first.');
    }
    var children = symbolMaster.children();
    for (var i = 0; i < children.count(); i++) {
      var layer = children[i];
      if (layer.isVisible() == 1 && layer.isLocked() == 0) {
        var fieldNames = Object.keys(values);
        if (layer.className() == 'MSSymbolInstance') {
          //logger.debug('Checking overrides for symbol ' + layer.name());
          var layerValues = values[layer.name()];
          var layerInstanceOrMaster = layer;

          var layerOverrides = {};

          if (layerValues != null) {
            var symbol = layerValues['symbolID'];
            //logger.debug('  Symbol ' + symbol);
            if (symbol == sketch.OVERRIDE_NULL_SYMBOL) {
              layerOverrides['symbolID'] = "";
            } else if (symbol != null) {
              layerOverrides['symbolID'] = symbol.symbolID();
              layerInstanceOrMaster = symbol;
            }
          }

          var otherOverrides = this._setupOverrides(layerInstanceOrMaster, layerValues || values);
          layerOverrides = extend(layerOverrides, otherOverrides);

          /*for (var j = 0; j < fieldNames.length; j++) {
            var fieldName = fieldNames[j];
            if (layer.name() == fieldNames[j]) {
              logger.debug('  Setting ' + layer.className() + ' symbolID override.');
              layerOverrides['symbolID'] = values[fieldName].symbolID();
              break;
            }
          }*/

          var propertyCount = Object.keys(layerOverrides).length;
          if (propertyCount > 0) {
            //logger.debug('  Symbol instance overrides, adding ' + propertyCount);
            idValuePairs[layer.objectID()] = layerOverrides;
          }
        } else {
          //logger.debug('Checking overrides for layer ' + layer.name());
          for (var j = 0; j < fieldNames.length; j++) {
            var fieldName = fieldNames[j];
            if (layer.name() == fieldNames[j]) {
              //logger.debug('  Setting ' + layer.className() + ' overrides.');
              idValuePairs[layer.objectID()] = values[fieldName];
              break;
            }
          }
        }
      }
    }

    return idValuePairs;
  },
  describeOverrides: function(instance) {
    var existingOverrides = instance.overrides();
    return this._describeLayerOverrides('', instance, existingOverrides);
  },
  _describeLayerOverrides: function(indent, instance, overrides) {
    var ret = null;
    if (overrides != null) {
      ret = {};
      var symbolMaster = instance.symbolMaster();
      var symbolId = overrides['symbolID'];
      if (symbolId != undefined) {
        if (symbolId == "") {
          logger.debug(indent + 'Symbol removed');
          ret['symbol'] = null;
        } else {
          symbolMaster = search.findSymbolsByID(symbolId)[0];
          logger.debug(indent + 'Looked up symbol ' + symbolMaster.name());
          ret['symbol'] = coerceString(symbolMaster.name());
        }
      }
      logger.debug(indent + 'Found overrides ' + overrides.count());
      var keys = overrides.allKeys();
      //logger.debug('  Keys ' + keys);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var layer = null;
        var children = symbolMaster.children();
        for (var j = 0; j < children.count(); j++) {
          var child = children[j];
          logger.debug(indent + '  Checking ' + child.objectID() + ' (' + child.name() + ')');
          if (coerceString(child.objectID()) == coerceString(key)) {
            logger.debug(indent + '  Found layer: ' + child.name());
            layer = child;
            break;
          }
        }
        if (layer != null) {
          var layerOverrides = overrides.objectForKey(key);
          logger.debug(indent + '  Layer ' + layer.className() + ' overrides ' + layerOverrides);
          if (this.is(layer, MSSymbolInstance)) {
            var layerDesc = this._describeLayerOverrides(indent + '  ', layer, layerOverrides);
            if (layerDesc != null) {
              logger.debug(indent + '    Adding map');
              ret[layer.name()] = layerDesc;
            }
          } else {
            logger.debug(indent + '    Adding ' + layerOverrides.className());
            ret[layer.name()] = coerceString(layerOverrides);
          }
        }
      }
    }
    return ret;
  },
  toNopPath: function(str) {
    return this.toJSString(str).replace(/[\/\\\?]/g, " ");
  },
  toHTMLEncode: function(str) {
    return this.toJSString(str)
      .replace(/\</g, "&lt;")
      .replace(/\>/g, '&gt;')
      .replace(/\'/g, "&#39;")
      .replace(/\"/g, "&quot;")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029")
      .replace(/\ud83c|\ud83d/g, "")
      ;
    // return str.replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, '&gt;');
  },
  emojiToEntities: function(str) {
    var emojiRanges = [
      "\ud83c[\udf00-\udfff]", // U+1F300 to U+1F3FF
      "\ud83d[\udc00-\ude4f]", // U+1F400 to U+1F64F
      "\ud83d[\ude80-\udeff]"  // U+1F680 to U+1F6FF
    ];
    return str.replace(
      new RegExp(emojiRanges.join("|"), "g"),
      function(match) {
        var c = encodeURIComponent(match).split("%"),
          h = ((parseInt(c[1], 16) & 0x0F))
            + ((parseInt(c[2], 16) & 0x1F) << 12)
            + ((parseInt(c[3], 16) & 0x3F) << 6)
            + (parseInt(c[4], 16) & 0x3F);
        return "&#" + h.toString() + ";";
      });
  },
  toSlug: function(str) {
    return this.toJSString(str)
      .toLowerCase()
      .replace(/(<([^>]+)>)/ig, "")
      .replace(/[\/\+\|]/g, " ")
      .replace(new RegExp("[\\!@#$%^&\\*\\(\\)\\?=\\{\\}\\[\\]\\\\\\\,\\.\\:\\;\\']", "gi"), '')
      .replace(/\s+/g, '-')
      ;
  },
  toJSString: function(str) {
    return new String(str).toString();
  },
  toJSNumber: function(str) {
    return Number(this.toJSString(str));
  },
  pointToJSON: function(point) {
    return {
      x: parseFloat(point.x),
      y: parseFloat(point.y)
    };
  },
  rectToJSON: function(rect, referenceRect) {
    if (referenceRect) {
      return {
        x: Math.round(rect.x() - referenceRect.x()),
        y: Math.round(rect.y() - referenceRect.y()),
        width: Math.round(rect.width()),
        height: Math.round(rect.height())
      };
    }

    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height())
    };
  },
  colorToJSON: function(color) {
    return {
      r: Math.round(color.red() * 255),
      g: Math.round(color.green() * 255),
      b: Math.round(color.blue() * 255),
      a: color.alpha(),
      "color-hex": color.immutableModelObject().stringValueWithAlpha(false) + " " + Math.round(color.alpha() * 100) + "%",
      "argb-hex": "#" + this.toHex(color.alpha() * 255) + color.immutableModelObject().stringValueWithAlpha(false).replace("#", ""),
      "css-rgba": "rgba(" + [
        Math.round(color.red() * 255),
        Math.round(color.green() * 255),
        Math.round(color.blue() * 255),
        (Math.round(color.alpha() * 100) / 100)
      ].join(",") + ")",
      "ui-color": "(" + [
        "r:" + (Math.round(color.red() * 100) / 100).toFixed(2),
        "g:" + (Math.round(color.green() * 100) / 100).toFixed(2),
        "b:" + (Math.round(color.blue() * 100) / 100).toFixed(2),
        "a:" + (Math.round(color.alpha() * 100) / 100).toFixed(2)
      ].join(" ") + ")"
    };
  },
  colorStopToJSON: function(colorStop) {
    return {
      color: this.colorToJSON(colorStop.color()),
      position: colorStop.position()
    };
  },
  gradientToJSON: function(gradient) {
    var stopsData = [],
      stop, stopIter = gradient.stops().objectEnumerator();
    while (stop = stopIter.nextObject()) {
      stopsData.push(this.colorStopToJSON(stop));
    }

    return {
      type: GradientTypes[gradient.gradientType()],
      from: this.pointToJSON(gradient.from()),
      to: this.pointToJSON(gradient.to()),
      colorStops: stopsData
    };
  },
  shadowToJSON: function(shadow) {
    return {
      type: shadow instanceof MSStyleShadow ? "outer" : "inner",
      offsetX: shadow.offsetX(),
      offsetY: shadow.offsetY(),
      blurRadius: shadow.blurRadius(),
      spread: shadow.spread(),
      color: this.colorToJSON(shadow.color())
    };
  },
  hexToColor: function(hex) {
    var hexRgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (hexRgb) {
      return MSColor.colorWithRed_green_blue_alpha(parseInt(hexRgb[1], 16) / 255, parseInt(hexRgb[2], 16) / 255, parseInt(hexRgb[3], 16) / 255, 1.0);
    } else {
      return null;
    }
  },
  getRadius: function(layer) {
    return (layer.layers && this.is(layer.layers().firstObject(), MSRectangleShape)) ? layer.layers().firstObject().fixedRadius() : 0;
  },
  getBorders: function(style) {
    var bordersData = [],
      border, borderIter = style.borders().objectEnumerator();
    while (border = borderIter.nextObject()) {
      if (border.isEnabled()) {
        var fillType = FillTypes[border.fillType()],
          borderData = {
            fillType: fillType,
            position: BorderPositions[border.position()],
            thickness: border.thickness()
          };

        switch (fillType) {
          case "color":
            borderData.color = this.colorToJSON(border.color());
            break;

          case "gradient":
            borderData.gradient = this.gradientToJSON(border.gradient());
            break;

          default:
            continue;
        }

        bordersData.push(borderData);
      }
    }

    return bordersData;
  },
  getFills: function(style) {
    var fillsData = [],
      fill, fillIter = style.fills().objectEnumerator();
    while (fill = fillIter.nextObject()) {
      if (fill.isEnabled()) {
        var fillType = FillTypes[fill.fillType()],
          fillData = {
            fillType: fillType
          };

        switch (fillType) {
          case "color":
            fillData.color = this.colorToJSON(fill.color());
            break;

          case "gradient":
            fillData.gradient = this.gradientToJSON(fill.gradient());
            break;

          default:
            continue;
        }

        fillsData.push(fillData);
      }
    }

    return fillsData;
  },
  getShadows: function(style) {
    var shadowsData = [],
      shadow, shadowIter = style.shadows().objectEnumerator();
    while (shadow = shadowIter.nextObject()) {
      if (shadow.isEnabled()) {
        shadowsData.push(this.shadowToJSON(shadow));
      }
    }

    shadowIter = style.innerShadows().objectEnumerator();
    while (shadow = shadowIter.nextObject()) {
      if (shadow.isEnabled()) {
        shadowsData.push(this.shadowToJSON(shaxdow));
      }
    }

    return shadowsData;
  },
  getOpacity: function(style) {
    return style.contextSettings().opacity()
  },
  getStyleName: function(layer) {
    if (layer.sharedStyle()) {
      return this.toJSString(layer.sharedStyle().name());
    } else {
      return "";
    }
  },
  setColor: function(layer, color, replacementProperty) {
    if (color) {
      if (layer.class() == MSShapeGroup) {
        // Shape
        if (replacementProperty == 'Fill') {
          var fill = layer.style().fills().firstObject();

          if (fill != undefined) {
            fill.color = color;
          }
        }

        if (replacementProperty == 'Border') {
          var border = layer.style().borders().firstObject();

          if (border != undefined) {
            border.color = color;
          }
        }
      } else {
        layer.textColor = color;
      }
    }
  },
  updateContext: function() {
    this.context.document = NSDocumentController.sharedDocumentController().currentDocument();
    this.context.selection = this.context.document.selectedLayers();

    return this.context;
  },
  openURL: function(url){
    var nsurl = NSURL.URLWithString(url);
    NSWorkspace.sharedWorkspace().openURL(nsurl)
  }
});
