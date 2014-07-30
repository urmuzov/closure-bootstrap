goog.provide('bootstrap3.MenuItemRenderer');

goog.require('goog.ui.MenuItemRenderer');

/**
 * {@link goog.ui.MenuItem} Renderer for {@link bootstrap3.ComboBox}.
 * Each item has the following structure:
 *
 * <pre>
 *   <li>
 *     <a>
 *       ...(menu item contents)...
 *     </a>
 *   </li>
 * </pre>
 * @constructor
 * @extends {goog.ui.MenuItemRenderer}
 */
bootstrap3.MenuItemRenderer = function() {
	goog.ui.MenuItemRenderer.call(this);
};
goog.inherits(bootstrap3.MenuItemRenderer, goog.ui.MenuItemRenderer);

/**
 * Overrides {@link goog.ui.ControlRenderer#createDom} by adding extra markup
 * and stying to the menu item's element if it is selectable or checkable.
 * @param {goog.ui.Control} item Menu item to render.
 * @return {Element} Root element for the item.
 * @override
 */
bootstrap3.MenuItemRenderer.prototype.createDom = function(item) {
	var dom = item.getDomHelper(),
		element = dom.createDom('li', null, //this.getClassNames(item).join(' '),
								dom.createDom('a', '', item.getContent()));
//		this.createContent(item.getContent(), item.getDomHelper()));
//	this.setEnableCheckBoxStructure(item, element,
//		item.isSupportedState(goog.ui.Component.State.SELECTED) ||
//			item.isSupportedState(goog.ui.Component.State.CHECKED));
//	this.setAriaStates(item, element);
	return element;
};

/**
 * Nothing to do for Bootstrap
 * @param {goog.ui.Control} control Control instance to update.
 * @param {goog.ui.Component.State} state State to enable or disable.
 * @param {boolean} enable Whether the control is entering or exiting the state.
 */
//bootstrap3.MenuItemRenderer.prototype.setState = function(control, state, enable) {
//
//};


bootstrap3.MenuItemRenderer.prototype.getClassForState = function(state) {
	if( state == goog.ui.Component.State.HOVER ) {
		return 'active';
	}
};