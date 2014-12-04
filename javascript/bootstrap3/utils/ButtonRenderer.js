goog.provide('bootstrap3.ButtonRenderer');

goog.require('goog.ui.NativeButtonRenderer');
goog.require('goog.ui.registry');

/**
 * @constructor
 * @extends {goog.ui.NativeButtonRenderer}
 */
bootstrap3.ButtonRenderer = function() {
    goog.ui.NativeButtonRenderer.call(this);
};
goog.inherits(bootstrap3.ButtonRenderer, goog.ui.NativeButtonRenderer);
goog.addSingletonGetter(bootstrap3.ButtonRenderer);

bootstrap3.ButtonRenderer.prototype.canDecorate = function(element) {
	return goog.ui.NativeButtonRenderer.prototype.canDecorate.call(this, element) || goog.dom.classes.has(element, 'btn');
};


/**
 * @const
 * @type string
 */
bootstrap3.ButtonRenderer.CSS_CLASS = 'btn';

goog.ui.registry.setDecoratorByClassName(bootstrap3.ButtonRenderer.CSS_CLASS,
    function() {
        return new goog.ui.Button(null, bootstrap3.ButtonRenderer.getInstance());
    });

/**
 * @inheritDoc
 */
bootstrap3.ButtonRenderer.prototype.getClassForState = function(state) {
    return bootstrap3.ButtonRenderer.CSS_CLASS;
};

/**
 * @inheritDoc
 */
bootstrap3.ButtonRenderer.prototype.getCssClass = function() {
  return bootstrap3.ButtonRenderer.CSS_CLASS;
};

// TODO: override goog.ui.ButtonRenderer.prototype.setCollapsed = function(button, sides) - ensure the element is wrapped in a btn-group
