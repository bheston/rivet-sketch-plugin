import { coerceString } from './coerce';
import { context } from './context';
import { logger } from './logger';

export const search = (function() {
  function findLayersMatchingPredicate_inContainer_filterByType(predicate, container, layerType) {
    var doc = context.current().document;
    var scope;
    switch (layerType) {
      case MSPage:
        scope = doc.pages();
        return scope.filteredArrayUsingPredicate(predicate);
    		break;

      case MSArtboardGroup:
        if (typeof container !== 'undefined' && container != nil) {
          if (container.className == "MSPage") {
            scope = container.artboards();
            return scope.filteredArrayUsingPredicate(predicate);
          }
        } else {
          // search all pages
          var filteredArray = NSArray.array();
          var loopPages = doc.pages().objectEnumerator(), page;
          while (page = loopPages.nextObject()) {
            scope = page.artboards();
            filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate));
          }
          return filteredArray;
        }
    		break;

      case MSSymbolMaster:
        scope = doc.documentData().allSymbols();
        return scope.filteredArrayUsingPredicate(predicate);
        break;

      default:
        if (typeof container !== 'undefined' && container != nil) {
          scope = container.children();
          return scope.filteredArrayUsingPredicate(predicate);
        } else {
          // search all pages
          var filteredArray = NSArray.array();
          var loopPages = doc.pages().objectEnumerator(), page;
          while (page = loopPages.nextObject()) {
            scope = page.children();
            filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate));
          }
          return filteredArray;
        }
    }
    return NSArray.array(); // Return an empty array if no matches were found
  }

  /*function findFirstLayerMatchingPredicate_inContainer_filterByType(predicate, container, layerType) {
    var filteredArray = findLayersMatchingPredicate_inContainer_filterByType(predicate, container, layerType);
    return filteredArray.firstObject();
  }

  function findLayersNamed_inContainer_filterByType(layerName, container, layerType) {
    var predicate = (typeof layerType === 'undefined' || layerType == nil) ? NSPredicate.predicateWithFormat("name == %@", layerName) : NSPredicate.predicateWithFormat("name == %@ && class == %@", layerName, layerType);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, container);
  }*/

  function findPagesByName(pageName) {
    var predicate = NSPredicate.predicateWithFormat("name == %@", pageName);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSPage);
  }

  function findSymbolsByID(id) {
    var predicate = NSPredicate.predicateWithFormat("symbolID == %@", id);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSSymbolMaster);
  }

  function findSymbolsByName(name) {
    var predicate = NSPredicate.predicateWithFormat("name == %@", name);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSSymbolMaster);
  }

  function findSymbolsByNameBegin(name) {
    var predicate = NSPredicate.predicateWithFormat("name BEGINSWITH[cd] %@", name);
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSSymbolMaster);
  }

  function findLayerStyleByName(styleName) {
    var doc = context.current().document;
		var styles = doc.documentData().layerStyles().objects();

		if (styles) {
			for (var i = 0; i < styles.count(); i++) {
				if (styles.objectAtIndex(i).name() == styleName) {
				  return styles.objectAtIndex(i);
				}
			}
		}

		return false;
	}

  function findTextStyleByName(styleName) {
    var doc = context.current().document;
		var textStyles = doc.documentData().layerTextStyles().objects();

		if (textStyles) {
			for (var i = 0; i < textStyles.count(); i++) {
				if (textStyles.objectAtIndex(i).name() == styleName) {
				  return textStyles.objectAtIndex(i);
				}
			}
		}

		return false;
	}

  function findTextStyleByID(styleID) {
    styleID = coerceString(styleID);
    //logger.debug("Looking for text style " + styleID);
    var doc = context.current().document;
		var textStyles = doc.documentData().layerTextStyles().objects();

		if (textStyles) {
			for (var i = 0; i < textStyles.count(); i++) {
        var current = textStyles.objectAtIndex(i);
        //logger.debug("  Checking text style " + current.objectID());
				if (coerceString(current.objectID()) === styleID) {
				  return current;
				}
			}
		}

    logger.warn("Was looking for text style " + styleID + ", but didn't find it.");
		return false;
	}

  return {
    findLayersMatchingPredicate_inContainer_filterByType: findLayersMatchingPredicate_inContainer_filterByType,
    findPagesByName: findPagesByName,
    findSymbolsByID: findSymbolsByID,
    findSymbolsByName: findSymbolsByName,
    findSymbolsByNameBegin: findSymbolsByNameBegin,
    findLayerStyleByName: findLayerStyleByName,
    findTextStyleByName: findTextStyleByName,
    findTextStyleByID: findTextStyleByID
  };
})();
