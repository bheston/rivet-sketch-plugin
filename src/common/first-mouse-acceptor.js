function createCocoaObject(methods, superclass) {
    var uniqueClassName = "MD.sketch_" + NSUUID.UUID().UUIDString();
    var classDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject);
    classDesc.registerClass();
    for (var selectorString in methods) {
        var selector = NSSelectorFromString(selectorString);
        classDesc.addInstanceMethodWithSelector_function(selector, methods[selectorString]);
    }
    return NSClassFromString(uniqueClassName).new();
}

export function addFirstMouseAcceptor(webView, contentView) {
    var button = createCocoaObject({
        'mouseDown:': function (evt) {
            // Remove this view. Subsequent events such the mouseUp event that will
            // probably immediately follow mouseDown or any other mouse events will
            // be handled as if this view is not here because it will not be here!
            this.removeFromSuperview();

            // Now send the same mouseDown event again as if the user had just
            // clicked. With the button gone, this will be handled by the WebView.
            NSApplication.sharedApplication().sendEvent(evt);
        },
    }, NSButton);

    button.setIdentifier('firstMouseAcceptor');
    button.setTransparent(true);
    button.setTranslatesAutoresizingMaskIntoConstraints(false);

    contentView.addSubview(button);

    var views = {
        button: button,
        webView: webView
    };

    // Match width of WebView.
    contentView.addConstraints(
        NSLayoutConstraint.constraintsWithVisualFormat_options_metrics_views(
            'H:[button(==webView)]',
            NSLayoutFormatDirectionLeadingToTrailing,
            null,
            views)
    );

    // Match height of WebView.
    contentView.addConstraints(
        NSLayoutConstraint.constraintsWithVisualFormat_options_metrics_views(
            'V:[button(==webView)]',
            NSLayoutFormatDirectionLeadingToTrailing,
            null,
            views)
    );

    // Match top of WebView.
    contentView.addConstraints(
        NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
            button,
            NSLayoutAttributeTop,
            NSLayoutRelationEqual,
            webView,
            NSLayoutAttributeTop,
            1,
            0)
    );
}
