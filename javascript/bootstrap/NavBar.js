goog.provide('bootstrap.NavBar');

goog.require('bootstrap.NavBarRenderer');
goog.require('goog.dom.DomHelper');

/**
 * NavBar UI component styled with Twitter Bootstrap
 * @param {string} opt_title
 * @param {string} opt_home_url
 * @param {boolean=} opt_collapsible
 * @param {bootstrap.NavBar.Location=} opt_location
 * @param {bootstrap.NavBarRenderer=} opt_renderer Renderer used to render or decorate the container; defaults to {@link bootstrap.PillsRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {goog.ui.Container}
 */
bootstrap.NavBar = function(opt_title, opt_home_url, opt_collapsible, opt_location, opt_renderer, opt_domHelper) {
	goog.ui.Container.call(this, goog.ui.Container.Orientation.HORIZONTAL, opt_renderer || bootstrap.NavBarRenderer.getInstance(), opt_domHelper);
	
	/** @type {string} */
	this.title = opt_title;
	/** @type {string} */
	this.url = opt_home_url || '#';
	/** @type {boolean|undefined} */
	this.collapsible = opt_collapsible;
	
	/** @type {bootstrap.NavBar.Location|undefined} */
	this.location = opt_location;
	
	this.setFocusable(false);
};
goog.inherits(bootstrap.NavBar, goog.ui.Container);


/**
 * Fix the navbar to the top or bottom of the viewport with an additional class on the outermost div, .navbar. 
 * These will also remove rounded corners.
 * @enum {string|null}
 */
bootstrap.NavBar.Location = {
	TOP: null,
	FIXED_TOP: 'navbar-fixed-top',			// body { padding-top: 70px; }
	FIXED_BOTTOM: 'navbar-fixed-bottom',		// body { padding-bottom: 70px; }
	STATIC_TOP: 'navbar-static-top'
};

bootstrap.NavBar.prototype.handleBlur = goog.nullFunction;
