goog.provide('bootstrap.NavBarToggleRenderer');

goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.registry');

/**
 * @see http://getbootstrap.com/components/#navbar-responsive
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
bootstrap.NavBarToggleRenderer = function() {
    goog.ui.ButtonRenderer.call(this);
};
goog.inherits(bootstrap.NavBarToggleRenderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(bootstrap.NavBarToggleRenderer);

/**
 * @const
 * @type string
 */
bootstrap.NavBarToggleRenderer.CSS_CLASS = 'navbar-toggle';
/**
 * @const
 * @type string
 */
bootstrap.NavBarToggleRenderer.NAV_BAR_COLLAPSE = 'navbar-collapse';
/**
 * @const
 * @type string
 */
bootstrap.NavBarToggleRenderer.COLLAPSED = 'collapsed';
/**
 * @const
 * @type string
 */
bootstrap.NavBarToggleRenderer.NAV_BAR_RESPONSIVE_COLLAPSE = '.navbar-responsive-collapse';
/**
 * @const
 * @type {string|Array.<Node>}
 */
bootstrap.NavBarToggleRenderer.CONTENT = '<span class="icon-bar"><span class="icon-bar"><span class="icon-bar">';
	// goog.dom.createDom('span', 'icon-bar'), dom.createDom('span', 'icon-bar'), dom.createDom('span', 'icon-bar')

/**
 * Returns the button's contents wrapped in a native HTML button element.  Sets
 * the button's disabled attribute as needed.
 * @param {goog.ui.Control} button Button to render.
 * @return {Element} Root element for the button (a native HTML button element).
 * @override
 */
bootstrap.NavBarToggleRenderer.prototype.createDom = function(button) {
  this.setUpNativeButton_(button);
  return button.getDomHelper().createDom('button', {
    'class': bootstrap.NavBarToggleRenderer.CSS_CLASS,
    'type' : 'button'
//    ,'data-toggle': 'collapse',
//    'data-target': bootstrap.NavBarToggleRenderer.NAV_BAR_RESPONSIVE_COLLAPSE
  }, bootstrap.NavBarToggleRenderer.CONTENT );
};

/** @override */
bootstrap.NavBarToggleRenderer.prototype.decorate = function(navBarToggle, element) {
	var navBar = /** @type {bootstrap.NavBar} */(navBarToggle.getParent());
	// .nav-collapse.collapse
	navBarToggle.navCollapseEl = goog.dom.getElementByClass( bootstrap.NavBarToggleRenderer.NAV_BAR_COLLAPSE, navBar.getElement() );
	navBarToggle.setOpen( goog.dom.classes.has( navBarToggle.navCollapseEl, 'in' ) );
	bootstrap.NavBarToggleRenderer.superClass_.decorate.call(this, navBarToggle, element);
	return element;
};

/**
 * @inheritDoc
 */
bootstrap.NavBarToggleRenderer.prototype.getClassForState = function(state) {
	if( state == goog.ui.Component.State.OPENED ) {
		return bootstrap.NavBarToggleRenderer.COLLAPSED;
	}
};

/**
 * @inheritDoc
 */
bootstrap.NavBarToggleRenderer.prototype.getCssClass = function() {
  return bootstrap.NavBarToggleRenderer.CSS_CLASS;
};

/**
 * @inheritDoc
 */
bootstrap.NavBarToggleRenderer.prototype.setState = function(navBarToggle, state, enable) {
	if( state == goog.ui.Component.State.OPENED ) {
		// when goog.ui.Component.State.OPENED, set the ".nav-collapse" element to "in"
		goog.dom.classes.enable( navBarToggle.navCollapseEl, 'in', enable );
	}
	bootstrap.NavBarToggleRenderer.superClass_.setState.call(this, navBarToggle, state, enable);
};

/**
 * @inheritDoc
 */
goog.ui.registry.setDecoratorByClassName( bootstrap.NavBarToggleRenderer.CSS_CLASS,
	function() {
		return new bootstrap.NavBarToggle( bootstrap.NavBarToggleRenderer.CONTENT, 
											bootstrap.NavBarToggleRenderer.getInstance() );
	}
);
