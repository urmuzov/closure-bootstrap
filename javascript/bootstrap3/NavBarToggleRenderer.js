goog.provide('bootstrap3.NavBarToggleRenderer');

goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');

/**
 * @see http://getbootstrap3.com/components/#navbar-responsive
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
bootstrap3.NavBarToggleRenderer = function() {
    goog.ui.ButtonRenderer.call(this);
};
goog.inherits(bootstrap3.NavBarToggleRenderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(bootstrap3.NavBarToggleRenderer);

/**
 * @const
 * @type string
 */
bootstrap3.NavBarToggleRenderer.CSS_CLASS = 'navbar-toggle';
/**
 * @const
 * @type string
 */
bootstrap3.NavBarToggleRenderer.NAV_BAR_COLLAPSE = 'navbar-collapse';
/**
 * @const
 * @type string
 */
bootstrap3.NavBarToggleRenderer.COLLAPSED = 'collapsed';
/**
 * @const
 * @type string
 */
bootstrap3.NavBarToggleRenderer.COLLAPSE = 'collapse';
/**
 * @const
 * @type string
 */
bootstrap3.NavBarToggleRenderer.OPEN = 'in';	// was 'in'
/**
 * @const
 * @type string
 */
bootstrap3.NavBarToggleRenderer.NAV_BAR_RESPONSIVE_COLLAPSE = '.navbar-responsive-collapse';
/**
 * @const
 * @type {string|Array.<Node>}
 */
bootstrap3.NavBarToggleRenderer.CONTENT = '<span class="icon-bar"><span class="icon-bar"><span class="icon-bar">';
	// goog.dom.createDom('span', 'icon-bar'), dom.createDom('span', 'icon-bar'), dom.createDom('span', 'icon-bar')

/**
 * Returns the button's contents wrapped in a native HTML button element.  Sets
 * the button's disabled attribute as needed.
 * @param {goog.ui.Control} button Button to render.
 * @return {Element} Root element for the button (a native HTML button element).
 * @override
 */
bootstrap3.NavBarToggleRenderer.prototype.createDom = function(button) {
  this.setUpNativeButton_(button);
  return button.getDomHelper().createDom('button', {
    'class': bootstrap3.NavBarToggleRenderer.CSS_CLASS,
    'type' : 'button'
//    ,'data-toggle': 'collapse',
//    'data-target': bootstrap3.NavBarToggleRenderer.NAV_BAR_RESPONSIVE_COLLAPSE
  }, bootstrap3.NavBarToggleRenderer.CONTENT );
};

/** @override */
bootstrap3.NavBarToggleRenderer.prototype.decorate = function(navBarToggle, element) {
	var navBar = /** @type {bootstrap3.NavBar} */(navBarToggle.getParent());
	// .nav-collapse.collapse
	navBarToggle.navCollapseEl = goog.dom.getElementByClass( bootstrap3.NavBarToggleRenderer.NAV_BAR_COLLAPSE, navBar.getElement() );
	navBarToggle.setOpen( goog.dom.classes.has( navBarToggle.navCollapseEl, bootstrap3.NavBarToggleRenderer.OPEN ) );
	bootstrap3.NavBarToggleRenderer.superClass_.decorate.call(this, navBarToggle, element);
	return element;
};

///**
// * @inheritDoc
// */
bootstrap3.NavBarToggleRenderer.prototype.getClassForState = function(state) {
	if( state == goog.ui.Component.State.CLOSED ) {
		return bootstrap3.NavBarToggleRenderer.COLLAPSED;
	}
};

/**
 * @inheritDoc
 */
bootstrap3.NavBarToggleRenderer.prototype.getCssClass = function() {
  return bootstrap3.NavBarToggleRenderer.CSS_CLASS;
};

/**
 * @inheritDoc
 */
bootstrap3.NavBarToggleRenderer.prototype.setState = function(navBarToggle, state, enable) {
	if( state == goog.ui.Component.State.OPENED ) {
		// when goog.ui.Component.State.OPENED, set the ".nav-collapse" element to "in"
		goog.dom.classes.enable( navBarToggle.navCollapseEl, bootstrap3.NavBarToggleRenderer.OPEN, enable );
//		goog.dom.classes.enable( navBarToggle.navCollapseEl, bootstrap3.NavBarToggleRenderer.COLLAPSE, !enable );
		goog.dom.classes.enable( navBarToggle.getElement(), bootstrap3.NavBarToggleRenderer.COLLAPSED, !enable );
	}

	bootstrap3.NavBarToggleRenderer.superClass_.setState.call(this, navBarToggle, state, enable);
};

/**
 * @inheritDoc
 */
goog.ui.registry.setDecoratorByClassName( bootstrap3.NavBarToggleRenderer.CSS_CLASS,
	function() {
		return new bootstrap3.NavBarToggle( bootstrap3.NavBarToggleRenderer.CONTENT, 
											bootstrap3.NavBarToggleRenderer.getInstance() );
	}
);