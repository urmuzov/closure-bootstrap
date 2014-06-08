goog.provide('bootstrap3.TabBarRenderer');

goog.require('goog.ui.TabBarRenderer');
goog.require('bootstrap3.TabRenderer');

/**
 * Renderer for {@link goog.ui.TabBar}s, based on the {@code goog.ui.TabBarRenderer} code.
 * <pre>
 *   &lt;div class="ui-tabs ui-widget ui-widget-content ui-corner-all">
 *     ...(tabs here)...
 *   &lt;/div>
 * </pre>
 * @constructor
 * @extends {goog.ui.TabBarRenderer}
 * @author Nicholas Albion
 */
bootstrap3.TabBarRenderer = function() {
	goog.ui.TabBarRenderer.call(this);
};
goog.inherits(bootstrap3.TabBarRenderer, goog.ui.TabBarRenderer);
goog.addSingletonGetter(bootstrap3.TabBarRenderer);

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
bootstrap3.TabBarRenderer.CSS_CLASS = goog.getCssName('nav');


/**
 * Returns the CSS class name to be applied to the root element of all tab bars
 * rendered or decorated using this renderer.
 * @return {string} Renderer-specific CSS class name.
 * @override
 */
bootstrap3.TabBarRenderer.prototype.getCssClass = function() {
	return bootstrap3.TabBarRenderer.CSS_CLASS;
};

bootstrap3.TabBarRenderer.prototype.createDom = function(container) {
	return container.getDomHelper().createDom('ul',
		this.getClassNames(container).join(' '));
};

/**
* Default implementation of {@code canDecorate}; returns true if the element
* is a DIV, false otherwise.
* @param {Element} element Element to decorate.
* @return {boolean} Whether the renderer can decorate the element.
* @override
*/
bootstrap3.TabBarRenderer.prototype.canDecorate = function(element) {
	return element.tagName == 'UL';
}; 

bootstrap3.TabBarRenderer.prototype.getDecoratorForChild = function(element) {
	if( element.tagName == 'LI' ) {
		return new goog.ui.Tab(null, bootstrap3.TabRenderer.getInstance());
	} else {
		goog.ui.registry.getDecorator(element);
	}
};
