goog.provide('bootstrap3.ComboDatePicker');

goog.require('goog.events.InputHandler');
goog.require('goog.ui.Component');
goog.require('goog.ui.DatePicker');

goog.require('bootstrap3.utils');

/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
bootstrap3.ComboDatePicker = function(opt_domHelper) {
	goog.ui.Component.call( this, opt_domHelper );

};
goog.inherits(bootstrap3.ComboDatePicker, goog.ui.Component);

/**
 * @type {boolean}
 */
bootstrap3.ComboDatePicker.prototype.visible = false;

/**
 * Keyboard event handler to manage key events dispatched by the input element.
 * @type {goog.events.KeyHandler}
 * @private
 */
bootstrap3.ComboDatePicker.prototype.keyHandler_;

/**
 * Input handler to take care of firing events when the user inputs text in
 * the input.
 * @type {goog.events.InputHandler?}
 * @private
 */
bootstrap3.ComboDatePicker.prototype.inputHandler_ = null;

/**
 * @private
 * @type goog.ui.DatePicker
 */
bootstrap3.ComboDatePicker.prototype.datePicker;


bootstrap3.ComboDatePicker.prototype.decorateInternal = function(element) {
//	goog.ui.Component.prototype.decorateInternal.call(this, element);

	this.valueInput_ = element;
	if( element.type != 'date' ) {
		// Older browser that does not support HTML "date" input control
		// To get the round corners where we want them, we need:
		// - .input-group
		//   - .input-group-addon.glyphicon.glyphicon-calendar
		//   - 'drowdownWrapper':.dropdown or 'element':<input type="hidden"
		//   - <input type="text"
		var dom = this.getDomHelper();
//		element.autocomplete = 'off';

		this.dropdownPanel = dom.createDom('div', 'dropdown-panel');
		this.dropdownWrapper = dom.createDom( 'div', 'dropdown', this.dropdownPanel );
		dom.replaceNode( this.dropdownWrapper, element );
		this.dropdownWrapper.parentNode.appendChild( element ); // insertBefore( element, this.dropDownPanel );

		// create a "hidden" element to hold the wire value, so that the visible input control
		// can be used to display & edit the value in a non-ISO format
		element.setAttribute('type', 'hidden');
		this.labelInput_ = //new goog.ui.LabelInput();
			dom.createDom('input', {'type': 'text',
				'class': element.className,
				'placeholder': element.placeholder,
				'value': element.value.substr(8) + '/' + element.value.substr(5,2) + '/' + element.value.substr(0,4)
			});

		this.dropdownWrapper.parentNode.appendChild(this.labelInput_); //this.dropdownWrapper.insertBefore(this.labelInput_, element);

		this.datePicker = new goog.ui.DatePicker();
		this.datePicker.setUseSimpleNavigationMenu(true);
		this.datePicker.setShowWeekNum(false);
		this.datePicker.render( this.dropdownPanel );
		this.datePicker.setDate( new goog.date.Date( parseInt(element.value.substr(0,4)),
													parseInt(element.value.substr(5,2)) - 1,
													parseInt(element.value.substr(8)) ) );


		element = this.dropdownWrapper;
	}

	goog.ui.Component.prototype.decorateInternal.call(this, element);
};

bootstrap3.ComboDatePicker.prototype.enterDocument = function() {
	goog.ui.Component.prototype.enterDocument.call(this);

	var input = this.getElement();
	if( input.type != 'date' ) {
		// Older browser that does not support HTML "date" input control
		var handler = this.getHandler();
		handler.listen( this.datePicker, goog.ui.DatePicker.Events.CHANGE, // or SELECT
						this.onChangeEvent_, false, this );
		handler.listen( this.labelInput_, goog.events.EventType.FOCUS, this.showCalendar, false, this )
			.listen( this.labelInput_, goog.events.EventType.BLUR, this.showCalendar, false, this );
			//.listen( this.labelInput_, goog.events.EventType.CHANGE, this.validateCalendar, false, this );
			//.listen( this.labelInput_, goog.events.EventType.KEYPRESS, this.validateCalendar, false, this );

		this.keyHandler_ = new goog.events.KeyHandler(this.labelInput_);
		handler.listen(this.keyHandler_,
			goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent);

		this.inputHandler_ = new goog.events.InputHandler(this.labelInput_);
		handler.listen(this.inputHandler_,
			goog.events.InputHandler.EventType.INPUT, this.onInputEvent_);
	}
};

/** @override */
bootstrap3.ComboDatePicker.prototype.exitDocument = function() {
	this.keyHandler_.dispose();
	delete this.keyHandler_;
	this.inputHandler_.dispose();
	this.inputHandler_ = null;
	bootstrap3.ComboDatePicker.superClass_.exitDocument.call(this);
};

/**
 * @return {string} yyyy-mm-dd
 */
bootstrap3.ComboDatePicker.prototype.getValue = function() {
	var input = this.getElement();
//	if( input.type != 'date' ) {
//		return this.value;
//	}
	return input.value;
};

/**
 * @param {goog.events.Event} e
 */
bootstrap3.ComboDatePicker.prototype.clickOutOfCalendar = function(e) {
	var outOfWrapper = bootstrap3.utils.checkMouseOut(e, this.dropdownWrapper.parentNode);
	var outOfPanel = bootstrap3.utils.checkMouseOut(e, this.dropdownPanel);
	if( outOfWrapper && outOfPanel ) {
		this.showCalendar(false);
	}
};

/**
 * @param {boolean?} show
 */
bootstrap3.ComboDatePicker.prototype.showCalendar = function(show) {
	if( show.type == 'blur' ) {
		var mouseOut = bootstrap3.utils.checkMouseOut( show, this.datePicker.getElement() );
		show = !mouseOut;
	} else {
		show = !!show;
	}
	if( show && !this.visible ) {
		this.getHandler().listen( window, goog.events.EventType.CLICK, this.clickOutOfCalendar, false, this );
	} else if( !show && this.visible ) {
		this.getHandler().unlisten( window, goog.events.EventType.CLICK, this.clickOutOfCalendar, false, this  );
	}

	goog.dom.classes.enable( this.dropdownWrapper, 'open', show );

//	if( this.datePicker == null ) {
//		this.datePicker = new goog.ui.DatePicker();
//		this.datePicker.render();
//	} else {
////		this.datePicker.
//	}
};

/**
 * Handles the content of the input box changing.
 * @param {goog.events.Event} e The CHANGE event to handle.
 * @private
 */
bootstrap3.ComboDatePicker.prototype.onChangeEvent_ = function (event) {
	if( event.date == null ) {
		this.labelInput_.value = '';
		this.valueInput_.value = '';
	} else {
		var str = event.date.toString();
		this.labelInput_.value = str.substr(6) + '/' + str.substr(4,2) + '/' + str.substr(0,4);
		this.valueInput_.value = str.substr(0,4) + '-' + str.substr(4,2) + '-' + str.substr(6);
	}

	goog.dom.classes.remove( this.dropdownWrapper, 'has-error' );
	goog.dom.classes.remove( this.dropdownWrapper, 'has-warning' );
};

/**
 * Handles the content of the input box changing.
 * @param {goog.events.Event} e The INPUT event to handle.
 * @private
 */
bootstrap3.ComboDatePicker.prototype.onInputEvent_ = function(e) {
	// If the key event is text-modifying, update the menu.
	//goog.log.fine(this.logger_, 'Key is modifying: ' + this.labelInput_.getValue());
//	this.handleInputChange_();
	var valid = this.validateCalendar( this.labelInput_.value ); //getValue()

//	goog.dom.classes.set(this.dropdownWrapper, 'dropdown-panel');
	goog.dom.classes.enable( this.dropdownWrapper, 'has-error', valid == bootstrap3.ComboDatePicker.Validity.ERROR );
	goog.dom.classes.enable( this.dropdownWrapper, 'has-warning', valid == bootstrap3.ComboDatePicker.Validity.WARNING );

	if( valid == bootstrap3.ComboDatePicker.Validity.ERROR || valid == bootstrap3.ComboDatePicker.Validity.ERROR ) {
//		goog.dom.classes.add(this.dropdownWrapper, valid);
//		goog.dom.classes.set(this.dropdownPanel, 'dropdown-panel ' + valid);
		e.preventDefault();
		return true;
	} else {

	}
};

/**
 * @enum {string}
 */
bootstrap3.ComboDatePicker.Validity = {
	WARNING: 'has-warning',
	ERROR: 'has-error'
};

/**
 * Expects a string of the form 'dd/mm/yyyy'
 * @param {string} value - date as entered by user
 * @param {bootstrap3.ComboDatePicker.Validity|null} - 'has-error' if completely invalid,
 * 							'has-warning' for an incomplete date
 * 							null if valid
 */
bootstrap3.ComboDatePicker.prototype.validateCalendar = function(value) {
//	if( value == null ) {
//		return bootstrap3.ComboDatePicker.Validity.WARNING;
//	}
	var date = this.datePicker.getDate(),
		parts = value.split(/[-\/]/ );
	if( parts.length > 3 ) {
		return bootstrap3.ComboDatePicker.Validity.ERROR;
	}

	var day = parts[0].match(/^\d{1,2}$/);
	if( day == null ) {
		return bootstrap3.ComboDatePicker.Validity.ERROR;
	} else {
		day = parseInt(day[0]);
		if( day < 0 || day > 31 ) {
			return bootstrap3.ComboDatePicker.Validity.ERROR;
		} else {
			date.setDate( day );

			if( parts.length == 1 || parts[1] == '' ) {
				return bootstrap3.ComboDatePicker.Validity.WARNING;
			} else {
				var month = parts[1].match(/^\d{1,2}$/);
				if( month == null ) {
					return bootstrap3.ComboDatePicker.Validity.ERROR;
				} else {
					month = parseInt(month[0]);
					if( month < 0 || month > 12 ) {
						return bootstrap3.ComboDatePicker.Validity.ERROR;
					} else {
						date.setMonth(month - 1);

						if( parts.length == 2 || parts[2] == '' ) {
							return bootstrap3.ComboDatePicker.Validity.WARNING;
						} else {
							var year = parts[2].match(/^\d{1,4}$/);
							if( year == null ) {
								return bootstrap3.ComboDatePicker.Validity.ERROR;
							} else {
								year = parseInt( year[0] );
								if(	year < 2013 || year > 3000 ) {
									return bootstrap3.ComboDatePicker.Validity.ERROR;
								} else if( year == 2 || (year >= 20 && year < 30) || (year >= 200 && year < 300) ) {
									return bootstrap3.ComboDatePicker.Validity.WARNING;
								} else {
									date.setYear(year);
								}
							}
						}
					}
				}
			}
		}
	}
	this.datePicker.setDate(date);
};


/**
 * Handles keyboard events from the input box.
 * @param {goog.events.KeyEvent} e Key event to handle.
 * @return {boolean} Whether the event was handled by the control.
 * @protected
 */
bootstrap3.ComboDatePicker.prototype.handleKeyEvent = function(e) {
	var handled = false;

	switch (e.keyCode) {
	case goog.events.KeyCodes.ESC:
		this.showCalendar(false);
		break;
//	case goog.events.KeyCodes.TAB:
//		break;
	case goog.events.KeyCodes.UP:
		case goog.events.KeyCodes.DOWN:
		// TODO: increment/decrement value at caret - see http://stackoverflow.com/questions/2897155/get-cursor-position-within-a-text-input-field
		break;
	}
//
//	if (handled) {
//		e.preventDefault();
//	}
//
//	return handled;
};
