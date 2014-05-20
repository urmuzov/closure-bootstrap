goog.provide('bootstrap3.ComboBox');

//goog.require('goog.ui.Component');
goog.require('goog.ui.ComboBox');
goog.require('bootstrap3.DropDownMenuRenderer');
goog.require('bootstrap3.MenuItemRenderer');

/**
 * A ComboBox styled with Twitter Bootstrap.
 * @see http://getbootstrap3.com/css/#forms-controls
 *
 * @param {string} opt_btn_class - 'default', 'primary', 'success', 'info', 'warning', 'danger', 'link'
 *
 * @constructor
 * @extends {goog.ui.ComboBox}
 */
bootstrap3.ComboBox = function( opt_btn_class, opt_domHelper) {
	var menu = new goog.ui.Menu(opt_domHelper, new bootstrap3.DropDownMenuRenderer());
	goog.ui.ComboBox.call(this, opt_domHelper, menu);

	this.btn_class = opt_btn_class || 'default';

//	goog.setCssNameMapping( {'goog-combobox': 'input-group',
//							'goog-combobox-button': 'input-group-btn'}, 'BY_WHOLE' );
};
goog.inherits(bootstrap3.ComboBox, goog.ui.ComboBox);

bootstrap3.ComboBox.menuItemRenderer = new bootstrap3.MenuItemRenderer();

bootstrap3.ComboBox.CLASS_NAME = 'input-group combobox';

/**
 * Create the DOM objects needed for the combo box.  A span and text input.
 * @override
 */
bootstrap3.ComboBox.prototype.createDom = function() {
	goog.ui.ComboBox.prototype.createDom.call(this);

//	this.input_.className = 'form-control';
};

/**
 * @param {goog.ui.ControlContent} content Text caption or DOM structure to
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 * @param {Object=} opt_data Identifying data for the menu item.
 */
bootstrap3.ComboBox.prototype.addItem = function( content, opt_data ) {
	var item = new goog.ui.ComboBoxItem( content, opt_data, null,
										bootstrap3.ComboBox.menuItemRenderer );
	goog.ui.ComboBox.prototype.addItem.call( this, item );
};

/**
 * Create the DOM objects needed for the combo box.  A span and text input.
 * @override
 */
bootstrap3.ComboBox.prototype.createDom = function() {
	var dom = this.getDomHelper();
	this.input_ = dom.createDom( 'input', {name: this.fieldName_, type: 'text', autocomplete: 'off'} );
	this.button_ = dom.createDom('span', 'dropdown-toggle btn btn-' + this.btn_class);
	var buttonWrapper = dom.createDom('span', 'input-group-btn', this.button_);
	this.setElementInternal(dom.createDom('div', bootstrap3.ComboBox.CLASS_NAME, this.input_,
											//this.button_));
											buttonWrapper));
//	if (this.useDropdownArrow_) {
		//this.button_.innerHTML = '&#x25BC;';
		//goog.dom.classes.add(this.button_, 'glyphicon glyphicon-chevron-down');
		this.button_.appendChild( dom.createDom('span', 'caret') );
		goog.style.setUnselectable(this.button_, true /* unselectable */);
//	}
	this.input_.setAttribute('label', this.defaultText_);
	this.labelInput_.decorate(this.input_);
	goog.dom.classes.set( this.labelInput_.getElement(), 'form-control' );
	this.menu_.setFocusable(false);
	if (!this.menu_.isInDocument()) {
		this.addChild(this.menu_, true);
	}
};

/**
 * Enables/Disables the combo box.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     combo box.
 */
bootstrap3.ComboBox.prototype.setEnabled = function(enabled) {
	this.enabled_ = enabled;
	this.labelInput_.setEnabled(enabled);
	goog.dom.classes.enable(this.input_, 'disabled', !enabled);
	goog.dom.classes.enable(this.button_, 'disabled', !enabled);
};


/**
 * Show the menu and add an active class to the combo box's element.
 * @private
 */
bootstrap3.ComboBox.prototype.showMenu_ = function() {
	this.menu_.setVisible(true);
	goog.dom.classes.add(this.getElement(), 'open');
	goog.dom.classes.add(this.button_, 'active');
};

/**
 * Hide the menu and remove the active class from the combo box's element.
 * @private
 */
bootstrap3.ComboBox.prototype.hideMenu_ = function() {
	this.menu_.setVisible(false);
	goog.dom.classes.remove(this.getElement(), 'open');
	goog.dom.classes.remove(this.button_, 'active');
};
