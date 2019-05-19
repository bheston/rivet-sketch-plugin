import { coerceString } from './coerce';

/* Borrowed from https://github.com/wonderbit/sketch-select-similar-layers */

// TODO: Select layers with the same shadow / inner shadow
// TODO: Select same symbols
// TODO: Select layers with the same shared style

/*
// defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool YES
// defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool NO
*/

var debugMode = false;

var selectInAllArtboards = true;
var itemsMatched = 0;

var debugLog = function(msg) {
	if (debugMode) {
		logger.debug(msg);
		//log(msg);
	}
}

var selectSameFill = function(context)
{
	// Error handling
	if(!selectionErrorHandling(context, false)) return;

	var selectedLayer = context.selection.firstObject();
	var fill = firstVisibleFill(selectedLayer);

	if(!fill) // Does the layer have any visible fills?
	{
		[[NSApplication sharedApplication] displayDialog:"Please select a layer with at least one fill and try again." withTitle:"No visible fills"];
		return;
	}

	iterateThroughLayers(context, selectedLayer, selectIfSameFill);

}

var selectSameBorder = function(context)
{
	// Error handling
	if(!selectionErrorHandling(context, false)) return;

	var selectedLayer = context.selection.firstObject();
	var border = firstVisibleBorder(selectedLayer);

	if(!border) // Does the layer have any visible borders?
	{
		[[NSApplication sharedApplication] displayDialog:"Please select a layer with at least one border and try again." withTitle:"No visible borders"];
		return;
	}

	iterateThroughLayers(context, selectedLayer, selectIfSameBorder);
}

var selectSameBorderThickness = function(context)
{
	// Error handling
	if(!selectionErrorHandling(context, false)) return;

	var selectedLayer = context.selection.firstObject();
	var border = firstVisibleBorder(selectedLayer);

	if(!border) // Does the layer have any visible borders?
	{
		[[NSApplication sharedApplication] displayDialog:"Please select a layer with at least one border and try again." withTitle:"No visible borders"];
		return;
	}

	iterateThroughLayers(context, selectedLayer, selectIfSameBorderThickness);
}

var selectSameFont = function(context)
{
	// Error handling
	if(!selectionErrorHandling(context, false)) return;

	var selectedLayer = context.selection.firstObject();
	if([selectedLayer class] != MSTextLayer) // Is it a text layer?
	{
		[[NSApplication sharedApplication] displayDialog:"Please select a text layer and try again." withTitle:"Layer is not of type text"];
		return;
	}

	iterateThroughLayers(context, selectedLayer, selectIfSameFontAndSize);
}

var selectSameFontAndColor = function(context)
{
	// Error handling
	if(!selectionErrorHandling(context, false)) return;

	var selectedLayer = context.selection.firstObject();
	if([selectedLayer class] != MSTextLayer) // Is it a text layer?
	{
		[[NSApplication sharedApplication] displayDialog:"Please select a text layer and try again." withTitle:"Layer is not of type text"];
		return;
	}
	iterateThroughLayers(context, selectedLayer, selectIfSameFontSizeAndColor);
}

var selectSameOpacity = function(context)
{
	var selectedLayer = context.selection.firstObject();

	// Error handling
	if(!selectionErrorHandling(context, true)) return;

	iterateThroughLayers(context, selectedLayer, selectIfSameOpacity);
}

var selectSameBlendMode = function(context)
{
	var selectedLayer = context.selection.firstObject();

	// Error handling
	if(!selectionErrorHandling(context, true)) return;

	iterateThroughLayers(context, selectedLayer, selectIfSameBlendMode);
}

var selectSameLayerName = function(context)
{
	var selectedLayer = context.selection.firstObject();

	// Error handling
	if(!selectionErrorHandling(context, true)) return;

	iterateThroughLayers(context, selectedLayer, selectIfSameLayerName);
}

var selectSameLayerNameAndClass = function(context)
{
	var selectedLayer = context.selection.firstObject();

	// Error handling
	if(!selectionErrorHandling(context, true)) return;

	iterateThroughLayers(context, selectedLayer, selectIfSameLayerNameAndClass);
}

var selectSameLayerClass = function(context)
{
	var selectedLayer = context.selection.firstObject();

	// Error handling
	if(!selectionErrorHandling(context, true)) return;

	iterateThroughLayers(context, selectedLayer, selectIfSameLayerClass);
}

/***********************/
/** Callback functions */
/***********************/

var selectIfSameFill = function(layer, selectedLayer)
{
	if(typeof layer.style == "undefined" || typeof layer.style().fills == "undefined") { //  Replace type by features [layer class] == MSLayerGroup
		return;
	}

	for (var j = 0; j < selectedLayer.style().fills().count(); j++) {
		var fill = selectedLayer.style().fills().objectAtIndex(j)
		var shouldSelect = false;

		// debugLog("Selected layer is enabled: " + fill.isEnabled());
		// debugLog("Selected layer color: " + fill.color());
		// debugLog("Selected layer fill type: " + fill.fillType());
		// debugLog("Selected layer gradient type: " + fill.gradient().gradientType());
		// debugLog("Selected layer noise pattern: " + fill.noiseIndex());

		//debugLog("layer: " + [layer class]);
		//debugLog("layer.style ? " + layer.style());

		if (fill.isEnabled()) {
			for(var i = 0; i < layer.style().fills().count(); i++) // Repeat with every fill
			{
				var thisFill = layer.style().fills().objectAtIndex(i)

				if (thisFill.fillType() == fill.fillType()
				&& thisFill.isEnabled()
				&& layer.isVisible()) {
					if (fill.fillType() == 0) { // Color
						if (coerceString(thisFill.color().immutableModelObject().stringValueWithAlpha(false)) == coerceString(fill.color().immutableModelObject().stringValueWithAlpha(false))) {
						//if (thisFill.color().isEqual(fill.color())) {
							debugLog("* Same color");
							shouldSelect = true;
						}
					} else if (fill.fillType() == 1) { // Gradient
						if (compareGradients(thisFill.gradient(), fill.gradient())) {
							debugLog("* Same gradient");
							shouldSelect = true;
						}
					} else if (fill.fillType() == 4) { // Image
						 if (thisFill.image().isEqual(fill.image())) {
							debugLog("* Same image");
							shouldSelect = true;
						}
					} else if (fill.fillType() == 5) { // Noise
						if (thisFill.noiseIndex() == fill.noiseIndex()) {
							debugLog("* Same noise pattern");
							shouldSelect = true;
						}
					}
				}

				if (shouldSelect) {
					[layer select:true byExpandingSelection:true];
					itemsMatched++;
					selectedLayers.push(layer);
				}
			}
		}
	}
}

var compareGradients = function(gradient1, gradient2) {
	if(gradient1.gradientType() != gradient2.gradientType()) {
		debugLog("different gradient types");
		return false;
	}

	if(gradient1.stops().count() != gradient2.stops().count()) {
		debugLog("different stop counts");
		return false;
	}

	for(var i = 0; i < gradient1.stops().count(); i++) {
		if(!gradient1.stops().objectAtIndex(i).color().isEqual(gradient2.stops().objectAtIndex(i).color())) {
			debugLog("different color at stop number "+i);
			return false;
		}
	}

	debugLog("gradients are equal");
	return true;
}

var selectIfSameBorder = function(layer, selectedLayer)
{

	if(typeof layer.style == "undefined" || typeof layer.style().borders == "undefined") { //  Replace type by features [layer class] == MSLayerGroup
		return;
	}

	// TODO: add to an option ?
	if(!layer.isVisible()) {
		return;
	}

	var color = firstVisibleBorder(selectedLayer).color();

	if(layer.style().borders().count() > 0) // If layer has at least one border
	{
		for(var i = 0; i < layer.style().borders().count(); i++) // Repeat with every border
		{
			var border = layer.style().borders().objectAtIndex(i);
			if (border.isEnabled()) {
				if (coerceString(border.color().immutableModelObject().stringValueWithAlpha(false)) == coerceString(color.immutableModelObject().stringValueWithAlpha(false))) {
					[layer select:true byExpandingSelection:true];
					itemsMatched++;
					selectedLayers.push(layer);
				}
			}
		}
	}
}

var selectIfSameBorderThickness = function(layer, selectedLayer)
{

	/**
	if([layer class] == MSLayerGroup) {
		return;
	}
	**/

	if(typeof layer.style == "undefined" || typeof layer.style().borders == "undefined") { //  Replace type by features [layer class] == MSLayerGroup ||
		return;
	}

	var thickness = firstVisibleBorder(selectedLayer).thickness();

	if(layer.style().borders().count() > 0) // If layer has at least one border
	{
		for(var i = 0; i < layer.style().borders().count(); i++) // Repeat with every border
		{
			if(layer.style().borders().objectAtIndex(i).thickness() == thickness
			&& layer.style().borders().objectAtIndex(i).isEnabled()
			&& layer.isVisible())
			{
				[layer select:true byExpandingSelection:true];
				itemsMatched++;
				selectedLayers.push(layer);
			}
		}

	}
}

var selectIfSameFontAndSize = function(layer, selectedLayer)
{
	if([layer class] == MSTextLayer)
	{
		if(
			layer.fontPostscriptName() == selectedLayer.fontPostscriptName()
			&& layer.fontSize() == selectedLayer.fontSize()
			&& layer.isVisible()
      )
		{
			[layer select:true byExpandingSelection:true];
			itemsMatched++;
			selectedLayers.push(layer);
		}
	}
}

var selectIfSameFontSizeAndColor = function(layer, selectedLayer)
{
	if([layer class] == MSTextLayer)
	{
        //rgb and alpha paring for the font color in the layer
    var layerFontColor = [layer.textColor().toString().substring(3,12), // Red Color parsing
                          layer.textColor().toString().substring(14,22),  // Green Color parsing
                          layer.textColor().toString().substring(25,33),  // Blue Color parsing
                          layer.textColor().toString().substring(36,44)]  // Alpha Color parsing

    //rgb and alpha paring for the font color in the selectedLayerFontColor
    var selectedLayerFontColor = [selectedLayer.textColor().toString().substring(3,12), // Red Color parsing
                                  selectedLayer.textColor().toString().substring(14,22), // Green Color parsing
                                  selectedLayer.textColor().toString().substring(25,33), // Blue Color parsing
                                  selectedLayer.textColor().toString().substring(36,44)] // Alpha Color parsing

		if(layer.fontPostscriptName() == selectedLayer.fontPostscriptName()
			&& layer.fontSize() == selectedLayer.fontSize()
			&& layerFontColor[0] == selectedLayerFontColor[0]
			&& layerFontColor[1] == selectedLayerFontColor[1]
			&& layerFontColor[2] == selectedLayerFontColor[2]
			&& layerFontColor[3] == selectedLayerFontColor[3]
			&& layer.isVisible()
            )
		{
			[layer select:true byExpandingSelection:true];
			itemsMatched++;
			selectedLayers.push(layer);
		}
	}
}

var selectIfSameOpacity = function(layer, selectedLayer)
{
	if(selectedLayer.style().contextSettings().opacity() == layer.style().contextSettings().opacity()
	&& layer.isVisible())
	{
		[layer select:true byExpandingSelection:true];
		itemsMatched++;
		selectedLayers.push(layer);
	}
}

var selectIfSameBlendMode = function(layer, selectedLayer)
{
	if(selectedLayer.style().contextSettings().blendMode() == layer.style().contextSettings().blendMode()
	&& layer.isVisible())
	{
		[layer select:true byExpandingSelection:true];
		itemsMatched++;
		selectedLayers.push(layer);
	}
}

var selectIfSameLayerName = function(layer, selectedLayer)
{
	// add by Thierryc
	if([selectedLayer name].localeCompare([layer name]) == 0) {
		// debugLog("* Same name ");
		[layer select:true byExpandingSelection:true];
		itemsMatched++;
		selectedLayers.push(layer);
	}
}

var selectIfSameLayerNameAndClass = function(layer, selectedLayer)
{
	// add by Thierryc
	if([selectedLayer class] == [layer class] && [selectedLayer name].localeCompare([layer name]) == 0) {
		// debugLog("* Same name and class");
		[layer select:true byExpandingSelection:true];
		itemsMatched++;
		selectedLayers.push(layer);
	}
}

var selectIfSameLayerClass = function(layer, selectedLayer)
{
	// add by seehadley
	if([selectedLayer class] == [layer class]) {
		// debugLog("* Same name and class");
		[layer select:true byExpandingSelection:true];
		itemsMatched++;
		selectedLayers.push(layer);
	}
}

/**********************/
/** Utility functions */
/**********************/

var selectedLayers = [];

var iterateThroughLayers = function(context, attr, callback)
{
	var doc = context.document;
	var page = doc.currentPage();
	var artboard = page.currentArtboard(); // if selected object is not inside of an artboard, this will be null.

	debugLog("Objects on page: " + page.layers().count());

	selectedLayers = [];

	if(selectInAllArtboards || !artboard)
	{
		for (var j = 0; j < page.layers().count(); j++) {
			var layer = page.layers().objectAtIndex(j);

			handleObject(layer, attr, callback);
		}
	} else {
		for (var k = 0; k < artboard.layers().count(); k++) {
			var layer = artboard.layers().objectAtIndex(k);
			handleObject(layer, attr, callback);
		}
	}
	// add by Thierryc
	[doc showMessage: itemsMatched + " item" + (itemsMatched != 1 ? "s" : "") + " selected"];

	return selectedLayers;
}

var handleObject = function(obj, attr, fn)
{

	debugLog("handle object: " + obj);

	// Is it a slice? ignore it
	if([obj class] == MSSliceLayer) {
		return;
	}

	// MSArtboardGroup √
	// MSShapeGroup
	// MSLayerGroup √
	// MSTextLayer
	// MSBitmapLayer
	// MSSymbolInstance

	// Is it a group?
	if([obj class] == MSLayerGroup) {

		// Call the function on the group itself
		fn.call(this, obj, attr);
		// Call the function on each of the group inside the layers
		for(var i = 0; i < obj.layers().count(); i++)
		{
			layer = obj.layers().objectAtIndex(i);
			handleObject(layer, attr, fn);
		}
		return;
	}

	// Is it a MSShapeGroup?
	if([obj class] == MSShapeGroup) {

		// Call the function on the group itself
		fn.call(this, obj, attr);
		// Call the function on each of the group inside the layers
		for(var i = 0; i < obj.layers().count(); i++)
		{
			layer = obj.layers().objectAtIndex(i);
			handleObject(layer, attr, fn);
		}
		return;
	}

	// Is it an artboard?
	if([obj class] == MSArtboardGroup) {
		// Call the function on the group itself
		fn.call(this, obj, attr);
		// Call the function on each of the group inside the layers
		for(var i = 0; i < obj.layers().count(); i++)
		{
			layer = obj.layers().objectAtIndex(i);
			handleObject(layer, attr, fn);
		}
		return;
	}

	// add by Thierryc
	// Is it an MSSymbolMaster ? for page symbol.
	if([obj class] == MSSymbolMaster) {
		// Call the function on the group itself
		fn.call(this, obj, attr);
		// Call the function on each of the group inside the layers
		for(var i = 0; i < obj.layers().count(); i++)
		{
			layer = obj.layers().objectAtIndex(i);
			handleObject(layer, attr, fn);
		}
		return;
	}

	// debugLog("handle object: "+ [obj class]);
	fn.call(this, obj, attr);
}

var firstVisibleFill = function(layer)
{
	if(typeof layer.style == "undefined" || typeof layer.style().fills == "undefined") {
		return;
	}

	for(var i = 0; i < layer.style().fills().count(); i++)
	{
		var fill = layer.style().fills().objectAtIndex(i);
		if(fill.isEnabled())
		{
			return fill;
		}
	}

	return false;
}

var firstVisibleBorder = function(layer)
{
	if(typeof layer.style == "undefined" || typeof layer.style().borders == "undefined") {
		return;
	}

	for(var i = 0; i < layer.style().borders().count(); i++)
	{
		var border = layer.style().borders().objectAtIndex(i);
		if(border.isEnabled())
		{
			return border;
		}
	}

	return false;
}

var selectionErrorHandling = function(context, groupsAllowed)
{
	if(context.selection.count() == 0) // Nothing selected
	{
		[[NSApplication sharedApplication] displayDialog:"You must select a layer in order to use this plugin." withTitle:"No layers selected!"];
		return false;
	}

	if(context.selection.count() > 1) // More than one layer selected
	{
		[[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with multiple layers. Please select a single layer and try again." withTitle:"Multiple layers selected!"];
		return false;
	}


	var firstObject = context.selection.firstObject();
	if([firstObject class] == MSLayerGroup && groupsAllowed == false) // Group selected
	{
		[[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with groups. Please select a layer instead." withTitle:"You've selected a group!"];
		return false;
	}

	if([firstObject class] == MSSliceLayer) // Slice selected
	{
		[[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with slices. Please select a layer instead." withTitle:"You've selected a slice!"];
		return false;
	}

	return true;
}
