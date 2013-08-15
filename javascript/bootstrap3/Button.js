goog.provide('bootstrap3.Button');

goog.require('goog.ui.Button');
goog.require('bootstrap.ButtonRenderer');

/**
 * A button control, rendered as a native browser button styled with Twitter Bootstrap.
 * @see http://getbootstrap.com/css/#buttons
 *
 * @param {goog.ui.ControlContent} content Text caption or existing DOM structure to display as the button's caption.
 * @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or decorate the button; defaults to {@link bootstrap.ButtonRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for document interaction.
 * @constructor
 * @extends {goog.ui.Button}
 */
bootstrap3.Button = function(content, opt_renderer, opt_domHelper) {
    goog.ui.Button.call(this, content, opt_renderer || bootstrap.ButtonRenderer.getInstance(), opt_domHelper)
};
goog.inherits(bootstrap3.Button, goog.ui.Button);

/**
 * Button sizes
 * @enum {string}
 */
bootstrap3.Button.Size = {
    LARGE: 'btn-lg',
    NORMAL: '',
    SMALL: 'btn-sm',
	EXTRA_SMALL: 'btn-xs'
};

/**
 * Button kinds
 * @enum {string}
 */
bootstrap3.Button.Kind = {
    DEFAULT: 'default',
	PRIMARY: 'primary',
	SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    DANGER: 'danger',
	LINK: 'link'
};

/**
 * @param {Array.<string>} classNames
 * @protected
 */
bootstrap3.Button.prototype.removeClassNames = function(classNames) {
    for (var i = 0; i < classNames.length; i++) {
        this.removeClassName(classNames[i]);
    }
};

/**
 * @param {bootstrap3.Button.Size} size
 */
bootstrap3.Button.prototype.setSize = function(size) {
    this.removeClassNames(goog.object.getValues(bootstrap3.Button.Size));
    this.addClassName(size);
};

/**
 * @param {bootstrap3.Button.Kind} kind
 */
bootstrap3.Button.prototype.setKind = function(kind) {
    this.removeClassNames(goog.object.getValues(bootstrap3.Button.Kind));
    this.addClassName(kind);
};