goog.provide('bootstrap3.DropDownMenuRenderer');

goog.require('goog.ui.MenuRenderer');

/**
 * Renderer for {@link bootstrap3.ComboBox}es, based on {@link goog.ui.MenuRenderer}.
 * @constructor
 * @extends {goog.ui.MenuRenderer}
 */
bootstrap3.DropDownMenuRenderer = function() {
	goog.ui.MenuRenderer.call(this);
};
goog.inherits(bootstrap3.DropDownMenuRenderer, goog.ui.MenuRenderer);

/**
 * @type {string}
 */
bootstrap3.DropDownMenuRenderer.CSS_CLASS = 'dropdown-menu';

///**
// * Returns the CSS class to be applied to the root element of containers rendered using this renderer.
// * @return {string} Renderer-specific CSS class.
// * @override
// */
//bootstrap3.DropDownMenuRenderer.prototype.getCssClass = function() {
//	return bootstrap3.DropDownMenuRenderer.CSS_CLASS;
//};

/**
 * @param {goog.ui.Container} container Container to render.
 * @return {Element} Root element for the container.
 */
bootstrap3.DropDownMenuRenderer.prototype.createDom = function(container) {
	return container.getDomHelper().createDom('ul', bootstrap3.DropDownMenuRenderer.CSS_CLASS);
//		this.getClassNames(container).join(' '));
};
