goog.provide('bootstrap3.NavBarToggle');

goog.require('goog.ui.Button');
goog.require('bootstrap3.NavBarRenderer');
goog.require('goog.dom.classes');

/**
 * A button control, rendered as a native browser button styled with Twitter Bootstrap.
 * @see http://getbootstrap3.com/css/#buttons
 *
 * @param {goog.ui.ControlContent} content Text caption or existing DOM structure to display as the button's caption.
 * @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or decorate the button; defaults to {@link bootstrap3.ButtonRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for document interaction.
 * @constructor
 * @extends {goog.ui.Button}
 */
bootstrap3.NavBarToggle = function(content, opt_renderer, opt_domHelper) {
    goog.ui.Button.call(this, content, opt_renderer || bootstrap3.NavBarRenderer.getInstance(), opt_domHelper);
    
    this.setSupportedState(goog.ui.Component.State.OPENED, true);
    this.setAutoStates(goog.ui.Component.State.OPENED, true);
};
goog.inherits(bootstrap3.NavBarToggle, goog.ui.Button);

/**
 * @type {HTMLElement|undefined}
 */
bootstrap3.NavBarToggle.prototype.navCollapseEl;

/**
 * The only className expected is 'collapsed', but we need to negate the enable flag 
 * because Closure define 'OPENED' but Bootstrap use 'collapsed'
 */
bootstrap3.NavBarToggle.prototype.enableClassName = function(control, className, enable) {
	bootstrap3.NavBarToggle.superClass_.enableClassName.call(this, control, className, !enable);
};

bootstrap3.NavBarToggle.prototype.setOpen = function(open) {
	bootstrap3.NavBarToggle.superClass_.setOpen.call(this, open);
	goog.dom.classes.enable( this.navCollapseEl, 'in', open );
	goog.dom.classes.enable( this.navCollapseEl, 'collapse', !open );
};
